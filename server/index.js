import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? flase : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Upon connection - only to the connected user
    socket.emit('message', 'Welcome to the chat room!')

    // Upon connection - to all users except the connected user
    socket.broadcast.emit('message', `${socket.id.substring(0, 5)} has joined the chat`)

    socket.on('message', data => {
        console.log(`${data} from ${socket.id}`)
        socket.emit('message', `${socket.id.substring(0, 5)} :${data}`)
    })

    // When user disconnects - to all other users
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `${socket.id.substring(0, 5)} has left the chat`)
    })

    // Listen for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
})