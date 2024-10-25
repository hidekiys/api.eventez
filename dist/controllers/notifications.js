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
exports.getNotifications = exports.newNotification = void 0;
var Event_1 = __importDefault(require("../models/Event"));
var Notifications_1 = __importDefault(require("../models/Notifications"));
var User_1 = __importDefault(require("../models/User"));
var Partner_1 = __importDefault(require("../models/Partner"));
var jwt = require('jsonwebtoken');
var newNotification = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var type = _b.type, event = _b.event, users = _b.users;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, Notifications_1.default.find({}).sort({ updatedAt: 1 }).then(function (find) { return __awaiter(void 0, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                data = find.filter(function (filter) { return filter.users.receiver == users.receiver && filter.users.sender == users.sender && filter.notificationType == type; });
                                if (!(data.length > 0)) return [3 /*break*/, 1];
                                return [2 /*return*/];
                            case 1: return [4 /*yield*/, Notifications_1.default.create({
                                    notificationType: type,
                                    users: users,
                                    event: event
                                })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.newNotification = newNotification;
var getNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                            }
                            return [4 /*yield*/, Notifications_1.default.find().sort({ updatedAt: -1 }).then(function (find) { return __awaiter(void 0, void 0, void 0, function () {
                                    var data, i, event_1, user, _a;
                                    var _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                data = find.filter(function (filter) { return filter.users.receiver == decoded.userId; });
                                                i = 0;
                                                _d.label = 1;
                                            case 1:
                                                if (!(i < data.length)) return [3 /*break*/, 9];
                                                return [4 /*yield*/, Event_1.default.findById(data[i].event)];
                                            case 2:
                                                event_1 = _d.sent();
                                                if (!(data[i].notificationType != "eventDay")) return [3 /*break*/, 7];
                                                return [4 /*yield*/, User_1.default.findById(data[i].users.sender)];
                                            case 3:
                                                if (!((_b = _d.sent()) !== null && _b !== void 0)) return [3 /*break*/, 4];
                                                _a = _b;
                                                return [3 /*break*/, 6];
                                            case 4: return [4 /*yield*/, Partner_1.default.findById(data[i].users.sender)];
                                            case 5:
                                                _a = _d.sent();
                                                _d.label = 6;
                                            case 6:
                                                user = _a;
                                                data[i] = {
                                                    event: [data[i].event, event_1],
                                                    sender: [data[i].users.sender, (((_c = user === null || user === void 0 ? void 0 : user.name) === null || _c === void 0 ? void 0 : _c.firstName) || (user === null || user === void 0 ? void 0 : user.name))],
                                                    notificationType: data[i].notificationType,
                                                    updatedAt: data[i].created
                                                };
                                                return [3 /*break*/, 8];
                                            case 7:
                                                data[i] = {
                                                    event: [data[i].event, event_1],
                                                    sender: ["eventEz", "EventEz"],
                                                    notificationType: data[i].notificationType,
                                                    updatedAt: data[i].created
                                                };
                                                _d.label = 8;
                                            case 8:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 9:
                                                if (data)
                                                    return [2 /*return*/, res.status(200).json(data)];
                                                return [2 /*return*/];
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
        catch (_b) {
            return [2 /*return*/, res.status(400).send('Ocorreu um erro ao tentar carregar as notificações!')];
        }
        return [2 /*return*/];
    });
}); };
exports.getNotifications = getNotifications;
