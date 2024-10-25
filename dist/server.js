"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var path_1 = __importDefault(require("path"));
var routes_1 = __importDefault(require("./routes"));
var mongoDb_1 = require("./data/mongoDb");
var http_1 = __importDefault(require("http"));
var crons_1 = require("./services/crons");
var cors = require('cors');
var Server = require('socket.io').Server;
(0, mongoDb_1.mongoConnect)();
var server = (0, express_1.default)();
var httpServer = http_1.default.createServer(server);
var io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
global.onlineUsers = new Map();
io.on("connection", function (socket) {
    global.chatSocket = socket;
    socket.on("add-user", function (userId) {
        global.onlineUsers.set(userId, socket.id);
        console.log("o usuário: " + userId + " conectou");
    });
    socket.on("send-msg", function (data) {
        console.log(data);
        var sendUserSocket = global.onlineUsers.get(data.to);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit("msg-recieve", data.message);
            console.log(data);
        }
    });
});
(0, crons_1.verifyEventDay)();
(0, crons_1.verifyPayment)();
server.use(cors());
server.use((0, helmet_1.default)());
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
server.use('/', routes_1.default);
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
httpServer.listen(3001, function () {
    console.log("O servidor está rodando no link: http://localhost:3001");
});
