"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = require("../controllers/user");
var verifyJWT_1 = require("../middlewares/verifyJWT");
var verifySchema_1 = require("../middlewares/verifySchema");
var verifyStatus_1 = require("../middlewares/verifyStatus");
var multer_1 = __importDefault(require("multer"));
var event_1 = require("../controllers/event");
var verifyPassword_1 = require("../middlewares/verifyPassword");
var verifyPartnerPassword_1 = require("../middlewares/verifyPartnerPassword");
var partner_1 = require("../controllers/partner");
var chat_1 = require("../controllers/chat");
var services_1 = require("../controllers/services");
var notifications_1 = require("../controllers/notifications");
var financial_1 = require("../controllers/financial");
var upload = (0, multer_1.default)({
    dest: 'uploads/'
});
var router = express_1.default.Router();
router.get('/', function (req, res) {
    res.json({});
});
//User
router.get('/getUser', verifyJWT_1.verifyJWT, user_1.getUserController);
router.get('/getPartner', verifyJWT_1.verifyJWT, partner_1.getPartnerController);
router.get('/getPhone', verifyJWT_1.verifyJWT, user_1.getPhoneController);
router.get('/getAddress', verifyJWT_1.verifyJWT, user_1.getAddressController);
router.post('/registro', verifySchema_1.verifyUser, user_1.registerUserController);
router.post('/registroParceiro', user_1.registerPartnerController);
router.post('/login', verifyStatus_1.verifyStatusMiddleware, user_1.loginUserController);
router.put('/confirmRegister', user_1.confirmRegisterController);
router.put('/putUserInfo', verifyPassword_1.verifyPassMiddleware, verifyJWT_1.verifyJWT, user_1.putUserInfo);
router.put('/putUserAddress', verifyPassword_1.verifyPassMiddleware, verifyJWT_1.verifyJWT, user_1.putUserAddress);
router.put('/putUserAvatar', upload.single('photo'), verifyJWT_1.verifyJWT, user_1.putUserAvatar);
router.get('/getUserAvatar', verifyJWT_1.verifyJWT, user_1.getUserAvatarController);
router.post('/newPaymentMethod', user_1.newPaymentMethod);
router.get('/getDocument', verifyJWT_1.verifyJWT, user_1.getDocumentController);
//Event
router.post('/createNewEvent', verifyJWT_1.verifyJWT, verifySchema_1.verifyEvent, event_1.createNewEventController);
router.put('/editEvent', verifyJWT_1.verifyJWT, verifySchema_1.verifyEvent, event_1.editEventController);
router.get('/getEvents', verifyJWT_1.verifyJWT, event_1.getEventsController);
router.get('/getEventInfo', verifyJWT_1.verifyJWT, event_1.getEventInfoController);
router.get('/getPartnerEvent', verifyJWT_1.verifyJWT, partner_1.getPartnerEventController);
router.delete('/deleteEvent', verifyJWT_1.verifyJWT, event_1.deleteEvent);
router.get('/getEventServices/:eventId', verifyJWT_1.verifyJWT, event_1.getEventServices);
//Todo Item
router.put('/createTodoItem', verifyJWT_1.verifyJWT, event_1.createNewTodoItemController);
router.put('/deleteTodoItem', verifyJWT_1.verifyJWT, event_1.deleteTodoController);
router.put('/checkTodoItem', verifyJWT_1.verifyJWT, event_1.checkTodoItemController);
//Budgets
router.put('/requestBudget', verifyJWT_1.verifyJWT, user_1.putRequestBudget);
router.get('/getBudgets', verifyJWT_1.verifyJWT, partner_1.getBudgetsController);
router.put('/createBudget', verifyJWT_1.verifyJWT, partner_1.putCreateBudget);
router.get('/getUserBudgets', verifyJWT_1.verifyJWT, user_1.getUserBudgets);
router.get('/getPartnerBudgets', verifyJWT_1.verifyJWT, partner_1.getPartnerBudgets);
router.put('/contractService', verifyJWT_1.verifyJWT, event_1.putContractService);
//Financial
router.get('/getPartnerFinancial', verifyJWT_1.verifyJWT, financial_1.getPartnerFinancial);
router.get('/getEventFinancial/:eventId', verifyJWT_1.verifyJWT, financial_1.getEventFinancial);
//Partner
router.get('/getEventSummary', verifyJWT_1.verifyJWT, event_1.getEventSummaryController);
router.get('/partnerName', verifyJWT_1.verifyJWT, event_1.getPartnerName);
router.get('/getPartnerEvents', verifyJWT_1.verifyJWT, partner_1.getPartnerEventsController);
router.get('/getPartnerSummary', verifyJWT_1.verifyJWT, event_1.getPartnerSummaryController);
router.put('/putPartnerAvatar', upload.single('photo'), verifyJWT_1.verifyJWT, partner_1.putPartnerAvatar);
router.put('/putPartnerImage', upload.single('photo'), verifyJWT_1.verifyJWT, partner_1.putPartnerImage);
router.put('/putPartnerBanner', upload.single('photo'), verifyJWT_1.verifyJWT, partner_1.putPartnerBanner);
router.get('/getPartnerPage/:partnerId', partner_1.getPartnerPage);
router.get('/getPartnerAddress', verifyJWT_1.verifyJWT, partner_1.getPartnerAddressController);
router.put('/putPartnerAddress', verifyPartnerPassword_1.verifyPartnerPassMiddleware, verifyJWT_1.verifyJWT, partner_1.putPartnerAddress);
router.get('/getPartnerImages', verifyJWT_1.verifyJWT, partner_1.getPartnerImages);
router.get('/getPartnerOfferServices', verifyJWT_1.verifyJWT, partner_1.getPartnerOfferServices);
router.delete('/deletePartnerImage/:index', verifyJWT_1.verifyJWT, partner_1.deletePartnerImage);
router.delete('/deletePartnerService/:index', verifyJWT_1.verifyJWT, partner_1.deleteOfferService);
router.post('/postOfferService', verifyJWT_1.verifyJWT, partner_1.postOfferService);
router.put('/putOfferService', verifyJWT_1.verifyJWT, partner_1.putOfferService);
router.get('/getPartnerAbout', verifyJWT_1.verifyJWT, partner_1.getPartnerAbout);
router.put('/putPartnerAbout', verifyJWT_1.verifyJWT, partner_1.putPartnerAbout);
router.get('/getPartnerQuestions', verifyJWT_1.verifyJWT, partner_1.getPartnerQuestions);
router.delete('/deletePartnerQuestion/:index', verifyJWT_1.verifyJWT, partner_1.deletePartnerQuestion);
router.post('/postPartnerQuestion', verifyJWT_1.verifyJWT, partner_1.postPartnerQuestion);
router.put('/putPartnerQuestion', verifyJWT_1.verifyJWT, partner_1.putPartnerQuestion);
router.get('/getPartnerAddressPage/:partnerId', partner_1.getPartnerAddressPageController);
router.get('/getPartnerBanner', verifyJWT_1.verifyJWT, partner_1.getPartnerBanner);
//Notifications
router.get('/getNotifications', verifyJWT_1.verifyJWT, notifications_1.getNotifications);
//Chat
router.put('/sendMsg', verifyJWT_1.verifyJWT, chat_1.sendMsg);
router.get('/getAllMessages/:to', verifyJWT_1.verifyJWT, chat_1.getAllMessages);
router.get('/getAllChats', verifyJWT_1.verifyJWT, chat_1.getAllChats);
//Services
router.get('/getServicesPagination/:page', services_1.getServicesPagination);
router.get('/getFamousServices', services_1.getFamousServices);
router.get('/getPlaces', services_1.getPlaces);
router.get('/searchServices/:search', services_1.searchServices);
exports.default = router;
