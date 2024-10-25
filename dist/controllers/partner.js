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
exports.getPartnerBudgets = exports.deletePartnerQuestion = exports.putPartnerQuestion = exports.postPartnerQuestion = exports.getPartnerQuestions = exports.putPartnerAbout = exports.getPartnerAbout = exports.deleteOfferService = exports.putOfferService = exports.postOfferService = exports.deletePartnerImage = exports.getPartnerOfferServices = exports.getPartnerImages = exports.putPartnerAddress = exports.getPartnerAddressPageController = exports.getPartnerBanner = exports.getPartnerAddressController = exports.getPartnerPage = exports.putPartnerBanner = exports.putPartnerImage = exports.putPartnerAvatar = exports.getPartnerEventController = exports.getPartnerEventsController = exports.putCreateBudget = exports.getNotificationsController = exports.getBudgetsController = exports.getPartnerController = void 0;
var nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
var fs = require('fs');
var Event_1 = __importDefault(require("../models/Event"));
var Partner_1 = __importDefault(require("../models/Partner"));
var User_1 = __importDefault(require("../models/User"));
var storage_1 = require("firebase/storage");
var sharp_1 = __importDefault(require("sharp"));
var firebase_1 = require("../data/firebase");
var notifications_1 = require("./notifications");
var Budget_1 = __importDefault(require("../models/Budget"));
var getPartnerController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partnerLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partnerLogin = _a.sent();
                        return [4 /*yield*/, Event_1.default.find().then(function (events) { return __awaiter(void 0, void 0, void 0, function () {
                                var eventsFilter, partnerEvents;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            eventsFilter = events.filter(function (filter) { var _a; return (_a = filter.services) === null || _a === void 0 ? void 0 : _a.some(function (service) { return service.partnerId == (partnerLogin === null || partnerLogin === void 0 ? void 0 : partnerLogin.id); }); });
                                            return [4 /*yield*/, Promise.all(eventsFilter.map(function (data, index) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var dataService, owner;
                                                    var _a;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                dataService = (_a = data.services) === null || _a === void 0 ? void 0 : _a.find(function (service) { return service.partnerId == (partnerLogin === null || partnerLogin === void 0 ? void 0 : partnerLogin.id); });
                                                                return [4 /*yield*/, User_1.default.findById(data.owner)];
                                                            case 1:
                                                                owner = _b.sent();
                                                                if (owner && dataService) {
                                                                    return [2 /*return*/, {
                                                                            "value": dataService === null || dataService === void 0 ? void 0 : dataService.value,
                                                                            "eventId": data.id,
                                                                            "ownerName": (owner === null || owner === void 0 ? void 0 : owner.name.firstName) + ' ' + (owner === null || owner === void 0 ? void 0 : owner.name.lastName),
                                                                            "eventName": data.name,
                                                                            "services": dataService === null || dataService === void 0 ? void 0 : dataService.services,
                                                                            "description": dataService === null || dataService === void 0 ? void 0 : dataService.description
                                                                        }];
                                                                }
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            partnerEvents = _a.sent();
                                            return [2 /*return*/, res.json({
                                                    "id": partnerLogin === null || partnerLogin === void 0 ? void 0 : partnerLogin._id,
                                                    "name": partnerLogin === null || partnerLogin === void 0 ? void 0 : partnerLogin.name,
                                                    "events": partnerEvents,
                                                    "email": partnerLogin === null || partnerLogin === void 0 ? void 0 : partnerLogin.email,
                                                    "url_avatar": partnerLogin === null || partnerLogin === void 0 ? void 0 : partnerLogin.url_avatar
                                                })];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerController = getPartnerController;
var getBudgetsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partner = _a.sent();
                        return [2 /*return*/, res.json(partner === null || partner === void 0 ? void 0 : partner.budgets)];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getBudgetsController = getBudgetsController;
var getNotificationsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partner = _a.sent();
                        return [2 /*return*/, res.json(partner === null || partner === void 0 ? void 0 : partner.notifications)];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getNotificationsController = getNotificationsController;
var putCreateBudget = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, eventId, budgetId, description, value;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body, eventId = _a.eventId, budgetId = _a.budgetId, description = _a.description, value = _a.value;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var event_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        console.log(req.body);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Event_1.default.findById(eventId)];
                    case 2:
                        event_1 = _a.sent();
                        return [4 /*yield*/, Budget_1.default.findByIdAndUpdate(budgetId, { $set: { budgetDescription: description, value: value, status: { user: "received", partner: "sended" } } }).then(function () {
                                if (event_1 && event_1.owner) {
                                    var users = { sender: decoded.userId, receiver: event_1.owner };
                                    var notifications = {
                                        type: "budget",
                                        event: eventId,
                                        users: users
                                    };
                                    (0, notifications_1.newNotification)(notifications);
                                }
                                return res.status(200).send('Orçamento criado com sucesso!');
                            }).catch(function (err) {
                                console.log(err);
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, res.status(400).send('ocorreu um erro')];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.putCreateBudget = putCreateBudget;
var getPartnerEventsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partner = _a.sent();
                        return [4 /*yield*/, Event_1.default.find().then(function (events) { return __awaiter(void 0, void 0, void 0, function () {
                                var eventsFilter, data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            eventsFilter = events.filter(function (filter) { var _a; return (_a = filter.services) === null || _a === void 0 ? void 0 : _a.some(function (service) { return service.partnerId == (partner === null || partner === void 0 ? void 0 : partner.id); }); });
                                            return [4 /*yield*/, Promise.all(eventsFilter.map(function (data, index) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var dataService, owner;
                                                    var _a;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                dataService = (_a = data.services) === null || _a === void 0 ? void 0 : _a.find(function (service) { return service.partnerId == (partner === null || partner === void 0 ? void 0 : partner.id); });
                                                                return [4 /*yield*/, User_1.default.findById(data.owner)];
                                                            case 1:
                                                                owner = _b.sent();
                                                                if (owner && dataService) {
                                                                    return [2 /*return*/, {
                                                                            "value": dataService === null || dataService === void 0 ? void 0 : dataService.value,
                                                                            "eventId": data.id,
                                                                            "ownerName": (owner === null || owner === void 0 ? void 0 : owner.name.firstName) + ' ' + (owner === null || owner === void 0 ? void 0 : owner.name.lastName),
                                                                            "eventName": data.name,
                                                                            "services": dataService === null || dataService === void 0 ? void 0 : dataService.services,
                                                                            "description": dataService === null || dataService === void 0 ? void 0 : dataService.description
                                                                        }];
                                                                }
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            data = _a.sent();
                                            return [2 /*return*/, res.status(200).json(data)];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerEventsController = getPartnerEventsController;
var getPartnerEventController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, id, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        id = req.headers.eventid;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Event_1.default.find().then(function (events) { return __awaiter(void 0, void 0, void 0, function () {
                                                var eventsFilter, data;
                                                return __generator(this, function (_a) {
                                                    eventsFilter = events.filter(function (filter) { var _a; return (_a = filter.services) === null || _a === void 0 ? void 0 : _a.some(function (service) { return service.partnerId == (partner === null || partner === void 0 ? void 0 : partner.id); }); });
                                                    data = eventsFilter.filter(function (event) { return event.id == id; });
                                                    if (data)
                                                        return [2 /*return*/, res.json(data[0])];
                                                    return [2 /*return*/];
                                                });
                                            }); })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        partner = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerEventController = getPartnerEventController;
var putPartnerAvatar = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (err) {
                    return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                }
                return [2 /*return*/, decoded.userId];
            });
        }); }).then(function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(id)];
                    case 1:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 3];
                        if (!req.file || (req.file && !req.file.mimetype.includes('image'))) {
                            return [2 /*return*/, res.status(400).send("Nenhuma imagem recebida.")];
                        }
                        return [4 /*yield*/, (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path)
                                .resize(300, 300, { fit: 'cover' })
                                .toBuffer(function (err, data) {
                                var storageRef = (0, storage_1.ref)(firebase_1.storage, "profileImages/".concat(user._id + '.jpg'));
                                var uploadTask = (0, storage_1.uploadBytesResumable)(storageRef, data);
                                uploadTask.on("state_changed", function (snapshot) {
                                }, function (error) {
                                    console.log(error);
                                    return res.status(400).send(error);
                                }, function () {
                                    (0, storage_1.getDownloadURL)(uploadTask.snapshot.ref).then(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    fs.unlink("./uploads/".concat((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename), function (err) {
                                                        if (err)
                                                            console.log(err);
                                                    });
                                                    return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(id, { $set: { url_avatar: url } })];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/, res.status(200).json({ "url_avatar": url }).send()];
                                            }
                                        });
                                    }); });
                                });
                                if (err) {
                                    return res.status(400).send('Erro ao carregar a imagem para o banco de dados');
                                }
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.putPartnerAvatar = putPartnerAvatar;
var putPartnerImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (err) {
                    return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                }
                return [2 /*return*/, decoded.userId];
            });
        }); }).then(function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var user, imageId_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(id)];
                    case 1:
                        user = _c.sent();
                        if (user) {
                            imageId_1 = (_a = user.images) === null || _a === void 0 ? void 0 : _a.length;
                            if (!req.file || (req.file && !req.file.mimetype.includes('image'))) {
                                return [2 /*return*/, res.status(400).send("Nenhuma imagem recebida.")];
                            }
                            (0, sharp_1.default)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path)
                                .resize(1920, 1080, { fit: 'cover' })
                                .toBuffer(function (err, data) {
                                var storageRef = (0, storage_1.ref)(firebase_1.storage, "partnerImages/".concat(user._id, "/").concat(imageId_1 + '.jpg'));
                                var uploadTask = (0, storage_1.uploadBytesResumable)(storageRef, data);
                                uploadTask.on("state_changed", function (snapshot) {
                                }, function (error) {
                                    console.log(error);
                                    return res.status(400).send(error);
                                }, function () {
                                    (0, storage_1.getDownloadURL)(uploadTask.snapshot.ref).then(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    fs.unlink("./uploads/".concat((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename), function (err) {
                                                        if (err)
                                                            console.log(err);
                                                    });
                                                    return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(id, { $push: { images: url } })];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/, res.status(200).json({ "image": url }).send()];
                                            }
                                        });
                                    }); });
                                });
                                if (err) {
                                    return res.status(400).send('Erro ao carregar a imagem para o banco de dados');
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.putPartnerImage = putPartnerImage;
var putPartnerBanner = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (err) {
                    return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                }
                return [2 /*return*/, decoded.userId];
            });
        }); }).then(function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(id)];
                    case 1:
                        user = _b.sent();
                        if (user) {
                            if (!req.file || (req.file && !req.file.mimetype.includes('image'))) {
                                return [2 /*return*/, res.status(400).send("Nenhuma imagem recebida.")];
                            }
                            (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path)
                                .resize(1920, 1080, { fit: 'cover' })
                                .toBuffer(function (err, data) {
                                var storageRef = (0, storage_1.ref)(firebase_1.storage, "partnerImages/".concat(user._id, "/banner").concat('.jpg'));
                                var uploadTask = (0, storage_1.uploadBytesResumable)(storageRef, data);
                                uploadTask.on("state_changed", function (snapshot) {
                                }, function (error) {
                                    console.log(error);
                                    return res.status(400).send(error);
                                }, function () {
                                    (0, storage_1.getDownloadURL)(uploadTask.snapshot.ref).then(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    fs.unlink("./uploads/".concat((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename), function (err) {
                                                        if (err)
                                                            console.log(err);
                                                    });
                                                    return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(id, { $set: { banner: url } })];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/, res.status(200).json({ "image": url }).send()];
                                            }
                                        });
                                    }); });
                                });
                                if (err) {
                                    return res.status(400).send('Erro ao carregar a imagem para o banco de dados');
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.putPartnerBanner = putPartnerBanner;
var getPartnerPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var partnerId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                partnerId = req.params.partnerId;
                return [4 /*yield*/, Partner_1.default.findById(partnerId).then(function (partner) {
                        var data = {
                            name: partner === null || partner === void 0 ? void 0 : partner.name,
                            offerServices: partner === null || partner === void 0 ? void 0 : partner.offerServices,
                            local: partner === null || partner === void 0 ? void 0 : partner.local,
                            url_avatar: partner === null || partner === void 0 ? void 0 : partner.url_avatar,
                            type: partner === null || partner === void 0 ? void 0 : partner.types,
                            about: partner === null || partner === void 0 ? void 0 : partner.about,
                            questions: partner === null || partner === void 0 ? void 0 : partner.questions,
                            images: partner === null || partner === void 0 ? void 0 : partner.images,
                            rate: partner === null || partner === void 0 ? void 0 : partner.rate,
                            reviews: partner === null || partner === void 0 ? void 0 : partner.reviews,
                            banner: partner === null || partner === void 0 ? void 0 : partner.banner,
                        };
                        return res.status(200).json(data);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getPartnerPage = getPartnerPage;
var getPartnerAddressController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partner = _a.sent();
                        return [2 /*return*/, res.json(partner === null || partner === void 0 ? void 0 : partner.local)];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerAddressController = getPartnerAddressController;
var getPartnerBanner = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partner = _a.sent();
                        return [2 /*return*/, res.json(partner === null || partner === void 0 ? void 0 : partner.banner)];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPartnerBanner = getPartnerBanner;
var getPartnerAddressPageController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var partnerId, partner;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                partnerId = req.params.partnerId;
                return [4 /*yield*/, Partner_1.default.findById(partnerId)];
            case 1:
                partner = _a.sent();
                return [2 /*return*/, res.json(partner === null || partner === void 0 ? void 0 : partner.local)];
        }
    });
}); };
exports.getPartnerAddressPageController = getPartnerAddressPageController;
var putPartnerAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, local, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        local = req.body.local;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { $set: { local: local } }).then(function () {
                                return res.status(202).send('Endereço alterado com sucesso');
                            }).catch(function (err) {
                                return res.status(500).send(err);
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
exports.putPartnerAddress = putPartnerAddress;
var getPartnerImages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) {
                            var data = partner === null || partner === void 0 ? void 0 : partner.images;
                            return res.status(200).json(data);
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
exports.getPartnerImages = getPartnerImages;
var getPartnerOfferServices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) {
                            var data = partner === null || partner === void 0 ? void 0 : partner.offerServices;
                            return res.status(200).json(data);
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
exports.getPartnerOfferServices = getPartnerOfferServices;
var deletePartnerImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, index, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        index = req.params.index;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var partner, i_1, storageRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Partner_1.default.findById(decoded.userId)];
                    case 1:
                        partner = _a.sent();
                        if (partner) {
                            i_1 = parseInt(index);
                            storageRef = (0, storage_1.ref)(firebase_1.storage, "partnerImages/".concat(partner._id, "/").concat(index + '.jpg'));
                            (0, storage_1.deleteObject)(storageRef).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            data = partner.images;
                                            if (data)
                                                data[i_1] = '';
                                            return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { images: data }).then(function () {
                                                    console.log('imagem deletada');
                                                    return res.status(200).send('Imagem deletada com sucesso!');
                                                }).catch(function () {
                                                    console.log('erro deletada');
                                                    return res.status(400).send('Erro ao deletar a imagem!');
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }).catch(function () {
                                console.log('errp deletada');
                                return res.status(400).send('Erro ao deletar a imagem!');
                            });
                        }
                        else {
                            console.log(decoded.userId);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.deletePartnerImage = deletePartnerImage;
var postOfferService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, service;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        service = req.body.service;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { $push: { offerServices: service } }).then(function () {
                            return res.status(200).send('Serviço criado com sucesso!');
                        }).catch(function () {
                            return res.status(400).send('Ocorreu um erro ao tentar criar o serviço.');
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
exports.postOfferService = postOfferService;
var putOfferService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, index, name, description, averagePrice;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body, index = _a.index, name = _a.name, description = _a.description, averagePrice = _a.averagePrice;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                            var offerServices;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        offerServices = partner === null || partner === void 0 ? void 0 : partner.offerServices;
                                        if (offerServices) {
                                            offerServices[index] = {
                                                name: name == '' ? offerServices[index].name : name,
                                                description: description == '' ? offerServices[index].description : description,
                                                averagePrice: averagePrice == 0 ? offerServices[index].averagePrice : averagePrice,
                                            };
                                        }
                                        return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { offerServices: offerServices }).then(function () {
                                                return res.status(200).send('Serviço editado com sucesso!');
                                            }).catch(function () {
                                                return res.status(400).send('Ocorreu um erro ao tentar editar o serviço.');
                                            })];
                                    case 1:
                                        _a.sent();
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
        return [2 /*return*/];
    });
}); };
exports.putOfferService = putOfferService;
var deleteOfferService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, index;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        index = req.params.index;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                            var offerServices, nIndex;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        offerServices = partner === null || partner === void 0 ? void 0 : partner.offerServices;
                                        nIndex = parseInt(index);
                                        offerServices === null || offerServices === void 0 ? void 0 : offerServices.splice(nIndex, 1);
                                        return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { offerServices: offerServices }).then(function () {
                                                return res.status(200).send('Serviço excluido com sucesso!');
                                            }).catch(function () {
                                                return res.status(400).send('Ocorreu um erro ao tentar excluir o serviço.');
                                            })];
                                    case 1:
                                        _a.sent();
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
        return [2 /*return*/];
    });
}); };
exports.deleteOfferService = deleteOfferService;
var getPartnerAbout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) {
                            var data = partner === null || partner === void 0 ? void 0 : partner.about;
                            return res.status(200).json(data);
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
exports.getPartnerAbout = getPartnerAbout;
var putPartnerAbout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, about;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        about = req.body.about;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { about: about }).then(function (partner) {
                            return res.status(200).send('Sobre a empresa alterado com sucesso!');
                        }).catch(function () {
                            return res.status(400).send('Ocorreu um erro ao tentar editar o sobre da empresa.');
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
exports.putPartnerAbout = putPartnerAbout;
var getPartnerQuestions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) {
                            var data = partner === null || partner === void 0 ? void 0 : partner.questions;
                            return res.status(200).json(data);
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
exports.getPartnerQuestions = getPartnerQuestions;
var postPartnerQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, question;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        question = req.body.question;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { $push: { questions: question } }).then(function () {
                            return res.status(200).send('Pergunta criada com sucesso!');
                        }).catch(function () {
                            return res.status(400).send('Ocorreu um erro ao tentar criar a pergunta.');
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
exports.postPartnerQuestion = postPartnerQuestion;
var putPartnerQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, index, ask, response;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body, index = _a.index, ask = _a.ask, response = _a.response;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                            var questions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        questions = partner === null || partner === void 0 ? void 0 : partner.questions;
                                        if (questions) {
                                            questions[index] = {
                                                ask: ask == '' ? questions[index].ask : ask,
                                                response: response == '' ? questions[index].response : response,
                                            };
                                        }
                                        return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { questions: questions }).then(function () {
                                                return res.status(200).send('Pergunta editada com sucesso!');
                                            }).catch(function () {
                                                return res.status(400).send('Ocorreu um erro ao tentar editar a pergunta.');
                                            })];
                                    case 1:
                                        _a.sent();
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
        return [2 /*return*/];
    });
}); };
exports.putPartnerQuestion = putPartnerQuestion;
var deletePartnerQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, index;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        index = req.params.index;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Partner_1.default.findById(decoded.userId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                            var questions, nIndex;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        questions = partner === null || partner === void 0 ? void 0 : partner.questions;
                                        nIndex = parseInt(index);
                                        questions === null || questions === void 0 ? void 0 : questions.splice(nIndex, 1);
                                        return [4 /*yield*/, Partner_1.default.findByIdAndUpdate(decoded.userId, { questions: questions }).then(function () {
                                                return res.status(200).send('Pergunta excluida com sucesso!');
                                            }).catch(function () {
                                                return res.status(400).send('Ocorreu um erro ao tentar excluir a pergunta.');
                                            })];
                                    case 1:
                                        _a.sent();
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
        return [2 /*return*/];
    });
}); };
exports.deletePartnerQuestion = deletePartnerQuestion;
var getPartnerBudgets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, Budget_1.default.find().then(function (budgets) {
                                var budgetsFilter = budgets.filter(function (filter) { return filter.users.partner == decoded.userId; });
                                return res.status(200).json(budgetsFilter);
                            }).catch(function (err) {
                                console.log(err);
                                return res.status(400).send('Ocorreu um erro!');
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
exports.getPartnerBudgets = getPartnerBudgets;
