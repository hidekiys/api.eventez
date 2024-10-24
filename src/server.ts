import express from 'express';
import helmet from 'helmet';
import path from 'path';
import router from './routes';
import { mongoConnect } from './data/mongoDb';
import http from 'http'
import { verifyEventDay, verifyPayment } from './services/crons';
const cors = require('cors');
const { Server } = require('socket.io');


mongoConnect();

const server = express();
const httpServer = http.createServer(server)
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }})

global.onlineUsers = new Map();


io.on("connection", (socket)=>{
    global.chatSocket = socket;

    socket.on("add-user", (userId)=>{
        
        global.onlineUsers.set(userId, socket.id)
        console.log("o usuário: "+userId+" conectou")
    })
    socket.on("send-msg",(data)=>{
        
        const sendUserSocket = global.onlineUsers.get(data.to);
        
        if(sendUserSocket) {
            io.to(sendUserSocket).emit("msg-recieve", data.message)
            console.log(data)
        }
    })
});


verifyEventDay()
verifyPayment()

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, '../public')))
server.use('/', router)
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


httpServer.listen(3001, () => {
    console.log("O servidor está rodando no link: http://localhost:3001")
})