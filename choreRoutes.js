import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { addChore, getRoomChores, updateChoreStatus, deleteChore } from '../controllers/choreController.js';

const choreRouter = express.Router();

choreRouter.post('/add', userAuth, addChore);
choreRouter.get('/my-chores', userAuth, getRoomChores);
choreRouter.put('/update-status', userAuth, updateChoreStatus);
choreRouter.post('/delete', userAuth, deleteChore);

export default choreRouter;