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
exports.verifyPayment = exports.verifyEventDay = void 0;
var cron = require('node-cron');
var Event_1 = __importDefault(require("../models/Event"));
var notifications_1 = require("../controllers/notifications");
var Financial_1 = __importDefault(require("../models/Financial"));
var axios = require('axios');
var verifyEventDay = function () { return cron.schedule('*/20 * * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Event_1.default.find().then(function (event) {
                    var dates = [new Date()];
                    var today = new Date();
                    event.forEach(function (ev, index) { return __awaiter(void 0, void 0, void 0, function () {
                        var eId, users, type;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!ev.date) return [3 /*break*/, 2];
                                    dates[index] = new Date(ev.date);
                                    if (!(dates[index].getUTCDate() == today.getUTCDate() && dates[index].getMonth() == today.getMonth() && dates[index].getFullYear() == today.getFullYear())) return [3 /*break*/, 2];
                                    eId = ev.id;
                                    return [4 /*yield*/, event[index].updateOne({ status: "inProgress" })];
                                case 1:
                                    _a.sent();
                                    if (ev.owner) {
                                        users = { sender: "eventEz", receiver: ev.owner };
                                        type = "eventDay";
                                        (0, notifications_1.newNotification)({ type: type, event: eId, users: users });
                                    }
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }); };
exports.verifyEventDay = verifyEventDay;
var verifyPayment = function () { return cron.schedule('*/10 * * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Financial_1.default.find().then(function (financial) {
                    var financialFilter = financial.filter(function (filter) { return filter.status.partner == "waiting"; });
                    financialFilter.forEach(function (item, index) { return __awaiter(void 0, void 0, void 0, function () {
                        var axios, options;
                        return __generator(this, function (_a) {
                            axios = require('axios');
                            options = {
                                method: 'GET',
                                url: "https://sandbox.api.pagseguro.com/orders/".concat(item.payment.order),
                                headers: { accept: '*/*', Authorization: process.env.PAGBANK_TOKEN }
                            };
                            axios
                                .request(options)
                                .then(function (response) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var event_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (response.data.charges[0].status == undefined)
                                                    return [2 /*return*/];
                                                if (!(response.data.charges[0].status == 'PAID')) return [3 /*break*/, 4];
                                                return [4 /*yield*/, Financial_1.default.findByIdAndUpdate(item._id, { status: { user: "paid", partner: "pending" } })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, Event_1.default.findByIdAndUpdate(item.event, { $push: {
                                                            services: {
                                                                services: item.service.service,
                                                                partnerId: item.users.partner,
                                                                description: item.service.description,
                                                                value: item.value,
                                                            }
                                                        } })];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, Event_1.default.findById(item.event)];
                                            case 3:
                                                event_1 = _a.sent();
                                                _a.label = 4;
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                });
                            })
                                .catch(function (error) {
                            });
                            return [2 /*return*/];
                        });
                    }); });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }); };
exports.verifyPayment = verifyPayment;
