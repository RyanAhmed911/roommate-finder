//This part was implemented by Ryan
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

export default userRouter;
//This part was implemented by Ryan
