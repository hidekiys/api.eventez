"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getEventServices = exports.getPartnerSummaryController = exports.putContractService = exports.getPartnerName = exports.createNewTodoItemController = exports.checkTodoItemController = exports.deleteTodoController = exports.deleteEvent = exports.getEventSummaryController = exports.getEventInfoController = exports.getEventsController = exports.editEventController = exports.createNewEventController = void 0;
var jwt = require('jsonwebtoken');
var User_1 = __importDefault(require("../models/User"));
var Event_1 = __importDefault(require("../models/Event"));
var Partner_1 = __importDefault(require("../models/Partner"));
var Financial_1 = __importDefault(require("../models/Financial"));
var Budget_1 = __importDefault(require("../models/Budget"));
var axios = require('axios');
var createNewEventController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, name, date, numberOfGuests, hour, endTime, decoded;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authHeader = req.headers['authorization'];
                token = authHeader && authHeader.split(' ')[1];
                return [4 /*yield*/, req.body];
            case 1:
                _a = _b.sent(), name = _a.name, date = _a.date, numberOfGuests = _a.numberOfGuests, hour = _a.hour, endTime = _a.endTime;
                decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                    var userEvents;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                                }
                                return [4 /*yield*/, Event_1.default.exists({ owner: decoded.userId, name: name })];
                            case 1:
                                userEvents = _a.sent();
                                if (userEvents)
                                    return [2 /*return*/, res.status(400).send("Você já possui um evento com este nome")];
                                Event_1.default.create({ name: name, owner: decoded.userId, date: date, numberOfGuests: numberOfGuests, hour: hour, endTime: endTime, status: "preparing" }).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var event;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, Event_1.default.findOne({ owner: decoded.userId, name: name })];
                                            case 1:
                                                event = _a.sent();
                                                return [4 /*yield*/, User_1.default.updateOne({ _id: decoded.userId }, { $push: { events: event === null || event === void 0 ? void 0 : event.id } })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, res.status(201).json({ "id": event === null || event === void 0 ? void 0 : event.id,
                                                        "message": "Evento criado com sucesso!" })];
                                        }
                                    });
                                }); }).catch(function (err) {
                                    return res.status(500).send('Não foi possível criar o evento');
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
exports.createNewEventController = createNewEventController;
var editEventController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, name, types, place, date, time, numberOfGuests, description, id, endTime, publicOfEvent, decoded;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authHeader = req.headers['authorization'];
                token = authHeader && authHeader.split(' ')[1];
                return [4 /*yield*/, req.body.event];
            case 1:
                _a = _b.sent(), name = _a.name, types = _a.types, place = _a.place, date = _a.date, time = _a.time, numberOfGuests = _a.numberOfGuests, description = _a.description, id = _a.id, endTime = _a.endTime, publicOfEvent = _a.publicOfEvent;
                decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                    var event;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                                }
                                return [4 /*yield*/, Event_1.default.find({ owner: decoded.userId, _id: id })];
                            case 1:
                                event = _a.sent();
                                if (event.length === 0)
                                    return [2 /*return*/, res.status(400).send('Este evento não existe')];
                                return [4 /*yield*/, Event_1.default.findOneAndUpdate({ owner: decoded.userId, _id: id }, __assign(__assign({}, event), { name: name, types: types, place: place, date: date, time: time, numberOfGuests: numberOfGuests, description: description, endTime: endTime, publicOfEvent: publicOfEvent })).then(function () {
                                        return res.status(200).send('O evento alterado com sucesso');
                                    }).catch(function (err) {
                                        return res.status(500).send('Não foi possível alterar o evento');
                                    })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
exports.editEventController = editEventController;
var getEventsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Event_1.default.find({ owner: decoded.userId })];
                    case 1:
                        events = _a.sent();
                        try {
                            return [2 /*return*/, res.status(200).json(events)];
                        }
                        catch (err) {
                            console.log(err + 'DEU ERRO');
                            return [2 /*return*/, res.status(400).send(err)];
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getEventsController = getEventsController;
var getEventInfoController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, id, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        id = req.headers.eventid;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId).then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!!((_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.includes(id))) return [3 /*break*/, 2];
                                            return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, Event_1.default.find().then(function (events) {
                                                                    if (events.filter(function (filter) { var _a; return (_a = filter.services) === null || _a === void 0 ? void 0 : _a.some(function (service) { return service.partnerId == (partner === null || partner === void 0 ? void 0 : partner.id); }); }).length == 0)
                                                                        return res.status(404).json("404 Evento não encontrado");
                                                                })];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); })];
                                        case 1:
                                            _b.sent();
                                            _b.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Event_1.default.findById(id)];
                    case 2:
                        event = _a.sent();
                        try {
                            return [2 /*return*/, res.status(200).json(event)];
                        }
                        catch (err) {
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getEventInfoController = getEventInfoController;
var getEventSummaryController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, id, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        id = req.headers.eventid;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var event, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Event_1.default.findById(id)];
                    case 1:
                        event = _a.sent();
                        return [4 /*yield*/, User_1.default.findById(event === null || event === void 0 ? void 0 : event.owner)];
                    case 2:
                        user = _a.sent();
                        try {
                            return [2 /*return*/, res.status(200).json({
                                    "numberOfGuests": event === null || event === void 0 ? void 0 : event.numberOfGuests,
                                    "publicOfEvent": event === null || event === void 0 ? void 0 : event.publicOfEvent,
                                    "types": event === null || event === void 0 ? void 0 : event.types,
                                    "date": event === null || event === void 0 ? void 0 : event.date,
                                    "name": event === null || event === void 0 ? void 0 : event.name,
                                    "owner": (user === null || user === void 0 ? void 0 : user.name.firstName) + ' ' + (user === null || user === void 0 ? void 0 : user.name.lastName),
                                    "initialTime": event === null || event === void 0 ? void 0 : event.hour,
                                    "endTime": event === null || event === void 0 ? void 0 : event.endTime,
                                    "place": event === null || event === void 0 ? void 0 : event.place,
                                    "ownerId": event === null || event === void 0 ? void 0 : event.owner,
                                    "status": event === null || event === void 0 ? void 0 : event.status,
                                })];
                        }
                        catch (err) {
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getEventSummaryController = getEventSummaryController;
var deleteEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, id, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        id = req.body.eventId;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var deleteEvent_1, user, events, deleteEventFromUser, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, Event_1.default.findByIdAndDelete(id)];
                    case 2:
                        deleteEvent_1 = _b.sent();
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 3:
                        user = _b.sent();
                        return [4 /*yield*/, ((_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.filter(function (event) { return event != id; }))];
                    case 4:
                        events = _b.sent();
                        return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.updateOne({ events: events }))];
                    case 5:
                        deleteEventFromUser = _b.sent();
                        return [2 /*return*/, res.status(200).send()];
                    case 6:
                        err_1 = _b.sent();
                        console.log(err_1 + ' DEU ERRO');
                        return [2 /*return*/, res.status(400).send()];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.deleteEvent = deleteEvent;
var deleteTodoController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, id, itemId, decoded;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body.event, id = _a.id, itemId = _a.itemId;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var event_1, deleteItem, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, Event_1.default.findById(id)];
                    case 2:
                        event_1 = _a.sent();
                        if (!(event_1 === null || event_1 === void 0 ? void 0 : event_1.todoList)) return [3 /*break*/, 4];
                        deleteItem = event_1 === null || event_1 === void 0 ? void 0 : event_1.todoList.filter(function (todoItem) { return todoItem.todoItem != itemId; });
                        return [4 /*yield*/, event_1.updateOne({ todoList: deleteItem })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(200).send('Deletado com sucesso')];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        console.log(err_2 + ' DEU ERRO');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.deleteTodoController = deleteTodoController;
var checkTodoItemController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, id, itemId, decoded;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body.event, id = _a.id, itemId = _a.itemId;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var event_2, todoUpdate, i, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, Event_1.default.findById(id)];
                    case 2:
                        event_2 = _a.sent();
                        if (!(event_2 === null || event_2 === void 0 ? void 0 : event_2.todoList)) return [3 /*break*/, 4];
                        todoUpdate = event_2 === null || event_2 === void 0 ? void 0 : event_2.todoList;
                        for (i = 0; i < todoUpdate.length; i++) {
                            if (todoUpdate[i].todoItem == itemId) {
                                todoUpdate[i].status = (todoUpdate[i].status == true) ? false : true;
                            }
                        }
                        return [4 /*yield*/, event_2.updateOne({ todoList: todoUpdate })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(200).send('Checkado')];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.log(err_3 + ' DEU ERRO');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.checkTodoItemController = checkTodoItemController;
var createNewTodoItemController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, description, id, decoded;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authHeader = req.headers['authorization'];
                token = authHeader && authHeader.split(' ')[1];
                return [4 /*yield*/, req.body.event];
            case 1:
                _a = _b.sent(), description = _a.description, id = _a.id;
                decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                    var existEvent, event;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                                }
                                return [4 /*yield*/, Event_1.default.find({ owner: decoded.userId, _id: id })];
                            case 1:
                                existEvent = _a.sent();
                                if (existEvent.length === 0)
                                    return [2 /*return*/, res.status(400).send('Este evento não existe')];
                                return [4 /*yield*/, Event_1.default.findOne({ owner: decoded.userId, _id: id }).then(function (event) {
                                        if (event === null || event === void 0 ? void 0 : event.todoList) {
                                            var todoLength = (event === null || event === void 0 ? void 0 : event.todoList.length) + 1;
                                            Event_1.default.findOneAndUpdate({ owner: decoded.userId, _id: id }, { $push: { todoList: { todoDescription: description, todoItem: todoLength, status: false } } }).then(function () {
                                                return res.status(200).send('O evento alterado com sucesso');
                                            }).catch(function (err) {
                                                return res.status(500).send('Não foi possível alterar o evento');
                                            });
                                        }
                                    })];
                            case 2:
                                event = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
exports.createNewTodoItemController = createNewTodoItemController;
var getPartnerName = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, id, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        id = req.headers.partnerid;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(id)];
                    case 1:
                        partner = _a.sent();
                        return [2 /*return*/, res.json(partner === null || partner === void 0 ? void 0 : partner.name)];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerName = getPartnerName;
var putContractService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, eventId, budgetId, partnerId, paymentMethod;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body, eventId = _a.eventId, budgetId = _a.budgetId, partnerId = _a.partnerId, paymentMethod = _a.paymentMethod;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var user, event_3, partner, partnerBudget_1, options, options, err_4;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 2:
                        user = _e.sent();
                        return [4 /*yield*/, Event_1.default.findById(eventId)];
                    case 3:
                        event_3 = _e.sent();
                        return [4 /*yield*/, Partner_1.default.findById(partnerId)];
                    case 4:
                        partner = _e.sent();
                        return [4 /*yield*/, Budget_1.default.findById(budgetId)];
                    case 5:
                        partnerBudget_1 = _e.sent();
                        if (!user)
                            return [2 /*return*/, res.status(400).send('usuário não encontrado')];
                        if (paymentMethod == "pix") {
                            console.log(partnerBudget_1);
                            options = {
                                method: 'POST',
                                url: 'https://sandbox.api.pagseguro.com/orders',
                                headers: {
                                    accept: '*/*',
                                    Authorization: process.env.PAGBANK_TOKEN,
                                    'content-type': 'application/json'
                                },
                                data: {
                                    customer: {
                                        name: user.name.firstName + ' ' + user.name.lastName,
                                        email: user.email,
                                        tax_id: user.document,
                                        phones: [{ country: 55, area: (_a = user.phone) === null || _a === void 0 ? void 0 : _a.slice(0, 2), number: (_b = user.phone) === null || _b === void 0 ? void 0 : _b.slice(2, 11), type: "MOBILE" }]
                                    },
                                    reference_id: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1._id,
                                    items: [{
                                            name: 'servico',
                                            quantity: 1,
                                            unit_amount: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.value
                                        }],
                                    qr_codes: [{ amount: { value: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.value } }]
                                }
                            };
                            axios
                                .request(options)
                                .then(function (response) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, Financial_1.default.create({
                                                    users: {
                                                        user: decoded.userId,
                                                        partner: partnerId
                                                    },
                                                    event: eventId,
                                                    service: {
                                                        service: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.service.services[0],
                                                        description: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.service.description
                                                    },
                                                    value: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.value,
                                                    status: {
                                                        user: "waiting payment",
                                                        partner: "waiting"
                                                    },
                                                    payment: {
                                                        paymentMethod: "pix",
                                                        charge: "pix",
                                                        order: response.data.id
                                                    },
                                                    created: new Date
                                                }).then(function () {
                                                    return res.status(200).send(response.data);
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, Budget_1.default.findByIdAndDelete(budgetId)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            })
                                .catch(function (error) {
                                console.error(error.response.data.error_messages[0].code);
                                if (error.response.data.error_messages[0].code == "40002") {
                                    return res.status(406).json({
                                        "msg": "CPF Inválido",
                                        "error": "cpf"
                                    });
                                }
                                return res.status(400).json(error);
                            });
                        }
                        else if (paymentMethod == "boleto") {
                            options = {
                                method: 'POST',
                                url: 'https://sandbox.api.pagseguro.com/orders',
                                headers: {
                                    accept: '*/*',
                                    Authorization: process.env.PAGBANK_TOKEN,
                                    'content-type': 'application/json'
                                },
                                data: {
                                    customer: {
                                        name: user.name.firstName + ' ' + user.name.lastName,
                                        email: user.email,
                                        tax_id: user.document,
                                        phones: [{ country: 55, area: (_c = user.phone) === null || _c === void 0 ? void 0 : _c.slice(0, 2), number: (_d = user.phone) === null || _d === void 0 ? void 0 : _d.slice(2, 11), type: "MOBILE" }]
                                    },
                                    reference_id: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1._id,
                                    items: [{
                                            name: 'servico',
                                            quantity: 1,
                                            unit_amount: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.value
                                        }],
                                    charges: [
                                        {
                                            amount: { value: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.value },
                                            payment_method: { type: 'BOLETO' },
                                            reference_id: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1._id
                                        }
                                    ]
                                }
                            };
                            axios
                                .request(options)
                                .then(function (response) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log(response.data);
                                                return [4 /*yield*/, Financial_1.default.create({
                                                        users: {
                                                            user: decoded.userId,
                                                            partner: partnerId
                                                        },
                                                        event: eventId,
                                                        service: {
                                                            service: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.service.services[0],
                                                            description: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.service.description
                                                        },
                                                        value: partnerBudget_1 === null || partnerBudget_1 === void 0 ? void 0 : partnerBudget_1.value,
                                                        status: {
                                                            user: "waiting payment",
                                                            partner: "waiting"
                                                        },
                                                        payment: {
                                                            paymentMethod: "boleto",
                                                            charge: "boleto",
                                                            order: response.data.id
                                                        }
                                                    })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, res.status(200).send(response.data)];
                                        }
                                    });
                                });
                            })
                                .catch(function (error) {
                                return res.status(400).json(error);
                            });
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_4 = _e.sent();
                        console.log(err_4);
                        return [2 /*return*/, res.status(400).send('ocorreu um erro')];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.putContractService = putContractService;
var getPartnerSummaryController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, id, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        id = req.headers.partnerid;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(id)];
                    case 1:
                        partner = _a.sent();
                        try {
                            return [2 /*return*/, res.status(200).json({
                                    "partnerName": partner === null || partner === void 0 ? void 0 : partner.name
                                })];
                        }
                        catch (err) {
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerSummaryController = getPartnerSummaryController;
var getEventServices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, eventId, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        eventId = req.params.eventId;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        ;
                        if (!eventId)
                            return [2 /*return*/, res.status(404).send('Não foi informado o id do evento.')];
                        return [4 /*yield*/, Event_1.default.findById(eventId).then(function (event) {
                                var _a;
                                var data = [{ partnerId: '', partnerName: '' }];
                                event && ((_a = event.services) === null || _a === void 0 ? void 0 : _a.forEach(function (service, i) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, Partner_1.default.findById(service.partnerId).then(function (partner) {
                                                    if (partner)
                                                        data[i] = { partnerName: partner === null || partner === void 0 ? void 0 : partner.name, partnerId: partner === null || partner === void 0 ? void 0 : partner.id };
                                                    if (event.services && i == (event.services.length - 1)) {
                                                        if (data[0].partnerId == '') {
                                                            return res.status(400).send('não foi encontrado serviços para este evento');
                                                        }
                                                        ;
                                                        return res.status(200).json(data);
                                                    }
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }));
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getEventServices = getEventServices;
