import { createServer } from 'http'
import { Server } from 'socket.io'
const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? flase : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
    socket.on('message', data => {
        console.log(`${data} from ${socket.id}`)
        socket.emit('message', `${socket.id.substring(0, 5)} :${data}`)
    })
})

httpServer.listen(3500, () => {
    console.log('Server is running on port 3500')
})