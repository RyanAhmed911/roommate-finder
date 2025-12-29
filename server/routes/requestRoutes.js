import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { sendInvite, getMyRequests, respondToRequest, requestToJoin } from '../controllers/requestController.js';

const requestRouter = express.Router();

requestRouter.post('/send', userAuth, sendInvite);
requestRouter.post('/join', userAuth, requestToJoin);
requestRouter.get('/my-requests', userAuth, getMyRequests);
requestRouter.post('/respond', userAuth, respondToRequest);

export default requestRouter;