import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { addExpense, getRoomExpenses, deleteExpense, updateExpense } from '../controllers/expenseController.js';

const expenseRouter = express.Router();

expenseRouter.post('/add', userAuth, addExpense);
expenseRouter.get('/my-expenses', userAuth, getRoomExpenses);
expenseRouter.post('/delete', userAuth, deleteExpense);
expenseRouter.put('/update', userAuth, updateExpense);

export default expenseRouter;