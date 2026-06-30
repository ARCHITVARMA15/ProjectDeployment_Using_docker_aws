import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { YSocketIO } from "y-socket.io/dist/server"


const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

const ysocketIO = new YSocketIO(io)
ysocketIO.initialize()





app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World", success: true })
})


app.get('/health', (req, res) => {
    res.status(200).json({ message: "OK", success: true })
})

const PORT = 3000
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
