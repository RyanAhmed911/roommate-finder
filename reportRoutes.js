import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { createReport, getUserReports } from '../controllers/reportController.js';

const reportRouter = express.Router();

reportRouter.post('/create', userAuth, createReport);
reportRouter.get('/user/:userId', userAuth, getUserReports); 

export default reportRouter;