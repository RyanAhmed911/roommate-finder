//This part was implemented by Ryan
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, getAllUsers, getUserProfileById, updateUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/all-users', userAuth, getAllUsers);
userRouter.get('/:id', userAuth, getUserProfileById);
userRouter.post('/update-profile', userAuth, updateUserProfile);

export default userRouter;
//This part was implemented by Ryan

