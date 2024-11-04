
import express from 'express';


import { confirmRegisterController, getUserController, loginUserController, registerPartnerController, registerUserController, putUserAddress, putUserAvatar, putUserInfo, getAddressController, getPhoneController, getUserAvatarController, putRequestBudget, newPaymentMethod, getUserBudgets, getDocumentController } from '../controllers/user';
import { verifyJWT } from '../middlewares/verifyJWT'
import { verifyEvent, verifyUser } from '../middlewares/verifySchema';
import { verifyStatusMiddleware } from '../middlewares/verifyStatus';
import multer from 'multer';
import { checkTodoItemController, createNewEventController, createNewTodoItemController, deleteEvent, deleteTodoController, editEventController, getEventInfoController, getEventsController, getEventServices, getEventSummaryController, getPartnerName, getPartnerSummaryController, putContractService } from '../controllers/event';
import { verifyPassMiddleware } from '../middlewares/verifyPassword';
import { verifyPartnerPassMiddleware } from '../middlewares/verifyPartnerPassword';
import { deleteOfferService, deletePartnerImage, deletePartnerQuestion, getBudgetsController, getNotificationsController, getPartnerAbout, getPartnerAddressController, getPartnerAddressPageController, getPartnerBanner, getPartnerBudgets, getPartnerController, getPartnerEventController, getPartnerEventsController, getPartnerImages, getPartnerOfferServices, getPartnerPage, getPartnerQuestions, postOfferService, postPartnerQuestion, putCreateBudget, putOfferService, putPartnerAbout, putPartnerAddress, putPartnerAvatar, putPartnerBanner, putPartnerImage, putPartnerQuestion } from '../controllers/partner';
import { getAllChats, getAllMessages, sendMsg } from '../controllers/chat';
import { getFamousServices, getPlaces, getServicesPagination, searchServices } from '../controllers/services';
import { getNotifications } from '../controllers/notifications';
import { getEventFinancial, getPartnerFinancial } from '../controllers/financial';
import { getReviews, postReview } from '../controllers/review';

const upload = multer({
    dest: 'uploads/'
});
const router = express.Router();

router.get('/', (req, res) => {

    res.json({})
})
//User
router.get('/getUser', verifyJWT, getUserController)
router.get('/getPartner', verifyJWT, getPartnerController)
router.get('/getPhone', verifyJWT, getPhoneController)
router.get('/getAddress', verifyJWT, getAddressController)
router.post('/registro', verifyUser, registerUserController)
router.post('/registroParceiro', registerPartnerController)
router.post('/login', verifyStatusMiddleware, loginUserController)
router.put('/confirmRegister', confirmRegisterController)
router.put('/putUserInfo', verifyPassMiddleware, verifyJWT, putUserInfo)
router.put('/putUserAddress', verifyPassMiddleware, verifyJWT, putUserAddress)
router.put('/putUserAvatar', upload.single('photo'), verifyJWT, putUserAvatar)
router.get('/getUserAvatar', verifyJWT, getUserAvatarController)
router.post('/newPaymentMethod', newPaymentMethod)
router.get('/getDocument', verifyJWT, getDocumentController)

//Reviews
router.get('/getReviews/:partnerId', getReviews)
router.post('/postReview', verifyJWT, postReview)
//Event
router.post('/createNewEvent', verifyJWT, verifyEvent, createNewEventController)
router.put('/editEvent', verifyJWT, verifyEvent, editEventController)
router.get('/getEvents', verifyJWT, getEventsController)
router.get('/getEventInfo', verifyJWT, getEventInfoController)
router.get('/getPartnerEvent', verifyJWT, getPartnerEventController)
router.delete('/deleteEvent', verifyJWT, deleteEvent)
router.get('/getEventServices/:eventId', verifyJWT, getEventServices)

//Todo Item
router.put('/createTodoItem', verifyJWT, createNewTodoItemController)
router.put('/deleteTodoItem', verifyJWT, deleteTodoController)
router.put('/checkTodoItem', verifyJWT, checkTodoItemController)

//Budgets
router.put('/requestBudget', verifyJWT, putRequestBudget)
router.get('/getBudgets', verifyJWT, getBudgetsController)
router.put('/createBudget', verifyJWT, putCreateBudget)
router.get('/getUserBudgets', verifyJWT, getUserBudgets)
router.get('/getPartnerBudgets', verifyJWT, getPartnerBudgets)
router.put('/contractService', verifyJWT, putContractService)

//Financial
router.get('/getPartnerFinancial', verifyJWT, getPartnerFinancial)
router.get('/getEventFinancial/:eventId', verifyJWT, getEventFinancial)

//Partner
router.get('/getEventSummary', verifyJWT, getEventSummaryController)
router.get('/partnerName', verifyJWT, getPartnerName)
router.get('/getPartnerEvents', verifyJWT, getPartnerEventsController)
router.get('/getPartnerSummary', verifyJWT, getPartnerSummaryController)
router.put('/putPartnerAvatar', upload.single('photo'), verifyJWT, putPartnerAvatar)
router.put('/putPartnerImage', upload.single('photo'), verifyJWT, putPartnerImage)
router.put('/putPartnerBanner', upload.single('photo'), verifyJWT, putPartnerBanner)
router.get('/getPartnerPage/:partnerId', getPartnerPage)
router.get('/getPartnerAddress', verifyJWT, getPartnerAddressController)
router.put('/putPartnerAddress', verifyPartnerPassMiddleware, verifyJWT, putPartnerAddress)
router.get('/getPartnerImages', verifyJWT, getPartnerImages)
router.get('/getPartnerOfferServices', verifyJWT, getPartnerOfferServices)
router.delete('/deletePartnerImage/:index', verifyJWT, deletePartnerImage)
router.delete('/deletePartnerService/:index', verifyJWT, deleteOfferService)
router.post('/postOfferService', verifyJWT, postOfferService)
router.put('/putOfferService', verifyJWT, putOfferService)
router.get('/getPartnerAbout', verifyJWT, getPartnerAbout)
router.put('/putPartnerAbout', verifyJWT, putPartnerAbout)
router.get('/getPartnerQuestions', verifyJWT, getPartnerQuestions)
router.delete('/deletePartnerQuestion/:index', verifyJWT, deletePartnerQuestion)
router.post('/postPartnerQuestion', verifyJWT, postPartnerQuestion)
router.put('/putPartnerQuestion', verifyJWT, putPartnerQuestion)
router.get('/getPartnerAddressPage/:partnerId', getPartnerAddressPageController)
router.get('/getPartnerBanner', verifyJWT, getPartnerBanner)

//Notifications
router.get('/getNotifications', verifyJWT, getNotifications)


//Chat
router.put('/sendMsg', verifyJWT, sendMsg)
router.get('/getAllMessages/:to', verifyJWT, getAllMessages)
router.get('/getAllChats', verifyJWT, getAllChats)

//Services
router.get('/getServicesPagination/:page', getServicesPagination)
router.get('/getFamousServices', getFamousServices)
router.get('/getPlaces', getPlaces)
router.get('/searchServices/:search', searchServices)


export default router;