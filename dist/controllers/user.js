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
exports.getUserBudgets = exports.newPaymentMethod = exports.putRequestBudget = exports.getUserAvatarController = exports.getDocumentController = exports.getPhoneController = exports.getAddressController = exports.putUserAvatar = exports.putUserAddress = exports.putUserInfo = exports.loginUserController = exports.registerPartnerController = exports.registerUserController = exports.confirmRegisterController = exports.getUserController = void 0;
var bcrypt_1 = require("bcrypt");
var nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
var nanoid_1 = require("nanoid");
var sharp_1 = __importDefault(require("sharp"));
var fs = require('fs');
var Event_1 = __importDefault(require("../models/Event"));
var axios = require('axios');
var User_1 = __importDefault(require("../models/User"));
var Partner_1 = __importDefault(require("../models/Partner"));
var firebase_1 = require("../data/firebase");
var storage_1 = require("firebase/storage");
var notifications_1 = require("./notifications");
var Budget_1 = __importDefault(require("../models/Budget"));
var getUserController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var userLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 1:
                        userLogin = _a.sent();
                        return [2 /*return*/, res.json({
                                "id": userLogin === null || userLogin === void 0 ? void 0 : userLogin._id,
                                "firstName": userLogin === null || userLogin === void 0 ? void 0 : userLogin.name.firstName,
                                "lastName": userLogin === null || userLogin === void 0 ? void 0 : userLogin.name.lastName,
                                "events": userLogin === null || userLogin === void 0 ? void 0 : userLogin.events,
                                "email": userLogin === null || userLogin === void 0 ? void 0 : userLogin.email,
                                "url_avatar": userLogin === null || userLogin === void 0 ? void 0 : userLogin.url_avatar
                            })];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getUserController = getUserController;
var confirmRegisterController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, validation, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, validation = _a.validation;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, User_1.default.findById(id)];
            case 2:
                user = _b.sent();
                if (!((user === null || user === void 0 ? void 0 : user.validation) == validation)) return [3 /*break*/, 4];
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.updateOne({ $set: { checked: true } }))];
            case 3:
                _b.sent();
                ;
                return [2 /*return*/, res.status(200).send('Liberado!')];
            case 4: return [2 /*return*/, res.status(400).send("O código inserido está incorreto")];
            case 5:
                err_1 = _b.sent();
                console.log(err_1);
                res.status(400).send('Este usúario não existe!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.confirmRegisterController = confirmRegisterController;
var registerUserController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, _a, name_1, email_1, password, user, hashedPassword, validationId, newUser, configEmail, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASS_EMAIL
                    },
                });
                console.log('não tentou');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, req.body];
            case 2:
                _a = _b.sent(), name_1 = _a.name, email_1 = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ email: email_1 })]; //try browse the email in database
            case 3:
                user = _b.sent() //try browse the email in database
                ;
                console.log('tentou');
                if (!!user) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, bcrypt_1.hash)(password, 10)];
            case 4:
                hashedPassword = _b.sent();
                validationId = (0, nanoid_1.nanoid)(6);
                return [4 /*yield*/, User_1.default.create({ name: name_1, email: email_1, password: hashedPassword, checked: false, validation: validationId })];
            case 5:
                _b.sent(); //create this user on db
                return [4 /*yield*/, User_1.default.findOne({ email: email_1 })];
            case 6:
                newUser = _b.sent();
                configEmail = {
                    from: process.env.EMAIL,
                    to: req.body.email,
                    subject: "Cole o código no Site para confirmar seu email.",
                    html: "    \n                <!DOCTYPE html>\n                <html lang=\"en\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                <style>\n                            body {\n                                margin: 0;\n                                padding: 0;\n\n                            }\n                            .divp {\n                                height: 100%;\n                                width: 100%;\n                                display: flex;\n                                justify-content: center;\n                                align-items: center;\n                            }\n                            img {\n                                width: 150px;\n                            }\n                            h1{\n                                font-size: 30px;\n                                text-align: center;\n                            }\n                            p{\n                                font-size: 20px;\n                            }\n                            .code{\n                                display: flex;\n                                flex-direction: row;\n                                justify-content: center;\n                                align-items: center;\n                            }\n                            .codep{\n                                padding: 20px 50px 20px 50px;\n                                border: solid 1px black;\n                                border-radius: 5px;\n                            }\n                        </style>\n                    </head>\n                    <body>\n                        <div class=\"divb\">\n                            <h1>Seja bem vindo a <img src=\"cid:logo\"/></h1>\n                            <br>\n                            <p>Caso n\u00E3o seja voc\u00EA apenas ignore este email, caso seja \n                                cole este c\u00F3digo no Site da EventEz</p>\n                            <div class=\"code\">\n                                <p class=\"codep\">".concat(validationId, "</p>\n                                    \n                            </div>\n                        </div>\n                    </body>"),
                    attachments: [
                        {
                            filename: 'logo.jpg',
                            path: __dirname + '/logo.jpg',
                            cid: 'logo'
                        }
                    ]
                };
                transporter.sendMail(configEmail, function (error) {
                    if (error) {
                        console.log('erro no 500 ' + error);
                        return res.status(500).send();
                    }
                    console.log("email enviado para: ".concat(email_1));
                });
                console.log("veio aqui");
                return [2 /*return*/, ( //return to the front-end this message
                    res.status(201).json({ "id": newUser === null || newUser === void 0 ? void 0 : newUser.id }))];
            case 7: // if user don't exists
            return [2 /*return*/, res.status(400).send("Este usúario já existe")];
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _b.sent();
                console.log(error_1);
                return [2 /*return*/, (res.status(500).send(error_1))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.registerUserController = registerUserController;
var registerPartnerController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, email, password, partner, hashedPassword, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                return [4 /*yield*/, req.body];
            case 1:
                _a = _b.sent(), name_2 = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, Partner_1.default.findOne({ email: email })]; //try browse the email in database
            case 2:
                partner = _b.sent() //try browse the email in database
                ;
                console.log('tentou');
                if (!!partner) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, bcrypt_1.hash)(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, Partner_1.default.create({ name: name_2, email: email, password: hashedPassword })];
            case 4:
                _b.sent(); //create this user on db
                return [2 /*return*/, res.send('criado com sucesso')];
            case 5: // if user don't exists
            return [2 /*return*/, res.status(400).send("Este usúario já existe")];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, (res.status(500).send(error_2))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.registerPartnerController = registerPartnerController;
var loginUserController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userLogin_1, partnerLogin_1, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, req.body];
            case 1:
                _a = _b.sent(), email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                userLogin_1 = _b.sent();
                return [4 /*yield*/, Partner_1.default.findOne({ email: email })];
            case 3:
                partnerLogin_1 = _b.sent();
                console.log("passou por aqui");
                if (userLogin_1) { // if found the email
                    if (userLogin_1.checked == false) {
                        return [2 /*return*/, res.status(203).json({
                                "msg": "Verifique o email",
                                "id": userLogin_1.id
                            })];
                    }
                    (0, bcrypt_1.compare)(password, userLogin_1.password).then(function (result) {
                        if (result) { //if password compare its true
                            var token = jwt.sign({ userId: userLogin_1.id }, process.env.SECRET, {
                                expiresIn: 60 * 60 * 2
                            });
                            return res.json({ auth: true, //send to user
                                token: token, "id": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1._id,
                                "firstName": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1.name.firstName,
                                "lastName": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1.name.lastName,
                                "events": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1.events,
                                "document": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1.document,
                                "email": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1.email,
                                "url_avatar": userLogin_1 === null || userLogin_1 === void 0 ? void 0 : userLogin_1.url_avatar,
                                "role": "user" });
                        }
                        if (!result) {
                            return ( //if password compare its false
                            res.status(401).send("A senha ou o usuário está incorreto"));
                        }
                    });
                }
                else if (partnerLogin_1) {
                    (0, bcrypt_1.compare)(password, partnerLogin_1.password).then(function (result) {
                        return __awaiter(this, void 0, void 0, function () {
                            var token_1;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!result) return [3 /*break*/, 2];
                                        token_1 = jwt.sign({ userId: partnerLogin_1.id }, process.env.SECRET, {
                                            expiresIn: 60 * 60 * 2
                                        });
                                        return [4 /*yield*/, Event_1.default.find().then(function (events) { return __awaiter(_this, void 0, void 0, function () {
                                                var eventsFilter, partnerEvents;
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            eventsFilter = events.filter(function (filter) { var _a; return (_a = filter.services) === null || _a === void 0 ? void 0 : _a.some(function (service) { return service.partnerId == (partnerLogin_1 === null || partnerLogin_1 === void 0 ? void 0 : partnerLogin_1.id); }); });
                                                            return [4 /*yield*/, Promise.all(eventsFilter.map(function (data, index) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var dataService, owner;
                                                                    var _a;
                                                                    return __generator(this, function (_b) {
                                                                        switch (_b.label) {
                                                                            case 0:
                                                                                dataService = (_a = data.services) === null || _a === void 0 ? void 0 : _a.find(function (service) { return service.partnerId == (partnerLogin_1 === null || partnerLogin_1 === void 0 ? void 0 : partnerLogin_1.id); });
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
                                                            return [2 /*return*/, res.json({ auth: true, //send to user
                                                                    token: token_1, "id": partnerLogin_1 === null || partnerLogin_1 === void 0 ? void 0 : partnerLogin_1._id,
                                                                    "name": partnerLogin_1 === null || partnerLogin_1 === void 0 ? void 0 : partnerLogin_1.name,
                                                                    "events": partnerEvents,
                                                                    "email": partnerLogin_1 === null || partnerLogin_1 === void 0 ? void 0 : partnerLogin_1.email,
                                                                    "url_avatar": partnerLogin_1 === null || partnerLogin_1 === void 0 ? void 0 : partnerLogin_1.url_avatar,
                                                                    "role": "partner" })];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        if (!result) {
                                            return [2 /*return*/, ( //if password compare its false
                                                res.status(401).send("A senha ou o usuário está incorreto"))];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                }
                else {
                    return [2 /*return*/, res.status(401).send("A senha ou o usuário está incorreto")];
                }
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.log(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.loginUserController = loginUserController;
var putUserInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, name, email, phone, document, decoded;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body, name = _a.name, email = _a.email, phone = _a.phone, document = _a.document;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findByIdAndUpdate(decoded.userId, { $set: {
                                    name: name,
                                    email: email,
                                    phone: phone,
                                    document: document
                                } }).then(function () {
                                return res.status(202).send('Informações alteradas com sucesso');
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
exports.putUserInfo = putUserInfo;
var putUserAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, address, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        address = req.body.address;
        console.log('passou aqui');
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findByIdAndUpdate(decoded.userId, { $set: { address: address } }).then(function () {
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
exports.putUserAddress = putUserAddress;
var putUserAvatar = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                    case 0: return [4 /*yield*/, User_1.default.findById(id)];
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
                                                    return [4 /*yield*/, User_1.default.findByIdAndUpdate(id, { $set: { url_avatar: url } })];
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
exports.putUserAvatar = putUserAvatar;
var getAddressController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var userLogin;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 1:
                        userLogin = _g.sent();
                        return [2 /*return*/, res.json({
                                "cep": (_a = userLogin === null || userLogin === void 0 ? void 0 : userLogin.address) === null || _a === void 0 ? void 0 : _a.cep,
                                "street": (_b = userLogin === null || userLogin === void 0 ? void 0 : userLogin.address) === null || _b === void 0 ? void 0 : _b.street,
                                "number": (_c = userLogin === null || userLogin === void 0 ? void 0 : userLogin.address) === null || _c === void 0 ? void 0 : _c.addressNumber,
                                "state": (_d = userLogin === null || userLogin === void 0 ? void 0 : userLogin.address) === null || _d === void 0 ? void 0 : _d.state,
                                "neighborhood": (_e = userLogin === null || userLogin === void 0 ? void 0 : userLogin.address) === null || _e === void 0 ? void 0 : _e.neighborhood,
                                "city": (_f = userLogin === null || userLogin === void 0 ? void 0 : userLogin.address) === null || _f === void 0 ? void 0 : _f.city
                            })];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getAddressController = getAddressController;
var getPhoneController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var userLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 1:
                        userLogin = _a.sent();
                        return [2 /*return*/, res.json({
                                "phone": userLogin === null || userLogin === void 0 ? void 0 : userLogin.phone
                            })];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getPhoneController = getPhoneController;
var getDocumentController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var userLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 1:
                        userLogin = _a.sent();
                        return [2 /*return*/, res.json({
                                "document": userLogin === null || userLogin === void 0 ? void 0 : userLogin.document
                            })];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getDocumentController = getDocumentController;
var getUserAvatarController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var userLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 1:
                        userLogin = _a.sent();
                        return [2 /*return*/, res.json({
                                "url_avatar": userLogin === null || userLogin === void 0 ? void 0 : userLogin.url_avatar
                            })];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.getUserAvatarController = getUserAvatarController;
var putRequestBudget = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, eventId, services, partnerId, description, decoded;
    return __generator(this, function (_b) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        _a = req.body, eventId = _a.eventId, services = _a.services, partnerId = _a.partnerId, description = _a.description;
        decoded = jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var users, notifications, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Partner_1.default.findById(partnerId).then(function (partner) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Event_1.default.find().then(function (events) { return __awaiter(void 0, void 0, void 0, function () {
                                                var eventsFilter, event;
                                                return __generator(this, function (_a) {
                                                    eventsFilter = events.filter(function (filter) { var _a; return (_a = filter.services) === null || _a === void 0 ? void 0 : _a.some(function (service) { return service.partnerId == (partner === null || partner === void 0 ? void 0 : partner.id); }); });
                                                    event = eventsFilter.filter(function (key) { return key.id == eventId; });
                                                    if (event && (event === null || event === void 0 ? void 0 : event.length) > 0) {
                                                        return [2 /*return*/, res.status(423).send('Este parceiro já trabalha neste evento!')];
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }).catch(function (err) {
                                console.log(err);
                                return res.status(423).send('Este parceiro já trabalha neste evento!');
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Budget_1.default.create({
                                users: {
                                    user: decoded.userId,
                                    partner: partnerId,
                                },
                                event: eventId,
                                service: {
                                    services: services,
                                    description: description,
                                },
                                budgetDescription: "",
                                value: 0,
                                status: {
                                    user: "requested",
                                    partner: "request"
                                },
                                created: new Date()
                            })];
                    case 3:
                        _a.sent();
                        users = { sender: decoded.userId, receiver: partnerId };
                        notifications = {
                            type: "contract",
                            event: eventId,
                            users: users
                        };
                        (0, notifications_1.newNotification)(notifications);
                        return [2 /*return*/, res.status(200).send('orçamento solicitado com sucesso!')];
                    case 4:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [2 /*return*/, res.status(400).send('ocorreu um erro')];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.putRequestBudget = putRequestBudget;
var newPaymentMethod = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, card;
    return __generator(this, function (_a) {
        authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
        card = req.body.card;
        jwt.verify(token, process.env.SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
            var user, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(500).send('Token fornecido não foi autorizado.')];
                        }
                        return [4 /*yield*/, User_1.default.findById(decoded.userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, res.status(400).send('Usuário não encontrado')];
                        options = {
                            method: 'POST',
                            url: 'https://sandbox.api.pagseguro.com/tokens/cards',
                            headers: {
                                accept: '*/*',
                                Authorization: process.env.PAGBANK_TOKEN,
                                'content-type': 'application/json'
                            },
                            data: {
                                number: card.number,
                                exp_month: card.exp_month,
                                exp_year: card.exp_year,
                                security_code: card.security_code,
                                holder: {
                                    name: user.name.firstName + ' ' + user.name.lastName,
                                    tax_id: user.document
                                }
                            }
                        };
                        axios
                            .request(options)
                            .then(function (response) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    console.log(response.data);
                                    user.updateOne({ $push: { cards: { token: response.data.id, lastNumbers: response.data.last_digits, brand: response.data.brand } } });
                                    res.status(200).json(response.data);
                                    return [2 /*return*/];
                                });
                            });
                        })
                            .catch(function (error) {
                            console.error(error);
                            res.status(400).json(error);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.newPaymentMethod = newPaymentMethod;
var getUserBudgets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                                var budgetsFilter = budgets.filter(function (filter) { return filter.users.user == decoded.userId; });
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
exports.getUserBudgets = getUserBudgets;
