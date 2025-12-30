import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { sendMessage, getRoomMessages, updateMessage, deleteMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/send', userAuth, sendMessage);
messageRouter.get('/all', userAuth, getRoomMessages);
messageRouter.put('/update', userAuth, updateMessage); 
messageRouter.post('/delete', userAuth, deleteMessage); 

export default messageRouter;