"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.getAllChats = exports.sendMsg = void 0;
var Chat_1 = __importDefault(require("../models/Chat"));
var User_1 = __importDefault(require("../models/User"));
var Partner_1 = __importDefault(require("../models/Partner"));
var notifications_1 = require("./notifications");
var jwt = require('jsonwebtoken');
var sendMsg = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, to, message, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                            }
                            _a = req.body, to = _a.to, message = _a.message;
                            if (!to || !message)
                                return [2 /*return*/, res.status(400).send('preencha os campos corretamente!')];
                            return [4 /*yield*/, Chat_1.default.create({
                                    message: { text: message },
                                    users: [decoded.userId, to],
                                    sender: decoded.userId,
                                })];
                        case 1:
                            data = _b.sent();
                            if (data) {
                                (0, notifications_1.newNotification)({
                                    type: "chat",
                                    users: {
                                        receiver: to,
                                        sender: decoded.userId
                                    },
                                });
                            }
                            if (data)
                                return [2 /*return*/, res.status(201).send('Mensagem adicionada com sucesso!')];
                            return [2 /*return*/, res.status(400).send('Falha ao adcionar mensagem.')];
                    }
                });
            }); });
        }
        catch (err) {
            console.log(err);
        }
        return [2 /*return*/];
    });
}); };
exports.sendMsg = sendMsg;
var getAllChats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                var jsonn;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                            }
                            return [4 /*yield*/, User_1.default.findById(decoded.userId).then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                    var data_1, _loop_1, i;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(user && user.chats != undefined)) return [3 /*break*/, 5];
                                                data_1 = [{ name: '', id: '' }];
                                                _loop_1 = function (i) {
                                                    var otherUser;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0: return [4 /*yield*/, User_1.default.findById(user.chats[i])];
                                                            case 1:
                                                                otherUser = _b.sent();
                                                                if (!(user.chats && otherUser != null)) return [3 /*break*/, 2];
                                                                data_1[i] = { name: (otherUser === null || otherUser === void 0 ? void 0 : otherUser.name.firstName) + ' ' + (otherUser === null || otherUser === void 0 ? void 0 : otherUser.name.lastName), id: user.chats[i] };
                                                                return [3 /*break*/, 4];
                                                            case 2:
                                                                if (!user.chats) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, Partner_1.default.findById(user.chats[i]).then(function (otherUser) {
                                                                        if (user.chats && otherUser) {
                                                                            data_1[i] = { name: otherUser.name, id: user.chats[i] };
                                                                        }
                                                                    })];
                                                            case 3:
                                                                _b.sent();
                                                                _b.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                };
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < user.chats.length)) return [3 /*break*/, 4];
                                                return [5 /*yield**/, _loop_1(i)];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 4: return [2 /*return*/, res.status(200).json(data_1)];
                                            case 5:
                                                Partner_1.default.findById(decoded.userId).then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var data_2, _loop_2, i;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (!(user && user.chats != undefined)) return [3 /*break*/, 5];
                                                                data_2 = [{ name: '', id: '' }];
                                                                _loop_2 = function (i) {
                                                                    var otherUser;
                                                                    return __generator(this, function (_b) {
                                                                        switch (_b.label) {
                                                                            case 0: return [4 /*yield*/, User_1.default.findById(user.chats[i])];
                                                                            case 1:
                                                                                otherUser = _b.sent();
                                                                                if (!(user.chats && otherUser != null)) return [3 /*break*/, 2];
                                                                                data_2[i] = { name: (otherUser === null || otherUser === void 0 ? void 0 : otherUser.name.firstName) + ' ' + (otherUser === null || otherUser === void 0 ? void 0 : otherUser.name.lastName), id: user.chats[i] };
                                                                                return [3 /*break*/, 4];
                                                                            case 2:
                                                                                if (!user.chats) return [3 /*break*/, 4];
                                                                                return [4 /*yield*/, Partner_1.default.findById(user.chats[i]).then(function (otherUser) {
                                                                                        if (user.chats && otherUser) {
                                                                                            data_2[i] = { name: otherUser.name, id: user.chats[i] };
                                                                                        }
                                                                                    })];
                                                                            case 3:
                                                                                _b.sent();
                                                                                _b.label = 4;
                                                                            case 4: return [2 /*return*/];
                                                                        }
                                                                    });
                                                                };
                                                                i = 0;
                                                                _a.label = 1;
                                                            case 1:
                                                                if (!(i < user.chats.length)) return [3 /*break*/, 4];
                                                                return [5 /*yield**/, _loop_2(i)];
                                                            case 2:
                                                                _a.sent();
                                                                _a.label = 3;
                                                            case 3:
                                                                i++;
                                                                return [3 /*break*/, 1];
                                                            case 4: return [2 /*return*/, res.status(200).json(data_2)];
                                                            case 5: return [2 /*return*/];
                                                        }
                                                    });
                                                }); });
                                                _a.label = 6;
                                            case 6: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (err) {
            console.log(err);
        }
        return [2 /*return*/];
    });
}); };
exports.getAllChats = getAllChats;
var getAllMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                var to, messages, me, _a, userOne, _b, userTwo, _c, projectedMessages;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                            }
                            to = req.params.to;
                            if (!to)
                                return [2 /*return*/, res.status(400).send('preencha os campos corretamente!')];
                            return [4 /*yield*/, Chat_1.default.find({
                                    users: {
                                        $all: [decoded.userId, to],
                                    }
                                })
                                    .sort({ updatedAt: 1 })];
                        case 1:
                            messages = _e.sent();
                            return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                        case 2:
                            _a = (_e.sent());
                            if (_a) return [3 /*break*/, 4];
                            return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                        case 3:
                            _a = (_e.sent());
                            _e.label = 4;
                        case 4:
                            me = _a;
                            if (!(messages.length == 0 && ((_d = me === null || me === void 0 ? void 0 : me.chats) === null || _d === void 0 ? void 0 : _d.filter(function (chat) { return chat == to; }).length) == 0)) return [3 /*break*/, 11];
                            return [4 /*yield*/, User_1.default.findByIdAndUpdate(decoded.userId, { $push: { chats: to } })];
                        case 5:
                            _b = (_e.sent());
                            if (_b) return [3 /*break*/, 7];
                            return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { $push: { chats: to } })];
                        case 6:
                            _b = (_e.sent());
                            _e.label = 7;
                        case 7:
                            userOne = _b;
                            return [4 /*yield*/, User_1.default.findByIdAndUpdate(to, { $push: { chats: decoded.userId } })];
                        case 8:
                            _c = (_e.sent());
                            if (_c) return [3 /*break*/, 10];
                            return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(to, { $push: { chats: decoded.userId } })];
                        case 9:
                            _c = (_e.sent());
                            _e.label = 10;
                        case 10:
                            userTwo = _c;
                            _e.label = 11;
                        case 11:
                            projectedMessages = messages.map(function (msg) {
                                return {
                                    fromSelf: msg.sender.toString() === decoded.userId,
                                    message: msg.message.text,
                                };
                            });
                            res.status(200).json(projectedMessages);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (err) {
            console.log(err);
        }
        return [2 /*return*/];
    });
}); };
exports.getAllMessages = getAllMessages;
