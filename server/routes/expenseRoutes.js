import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { addExpense, getRoomExpenses, deleteExpense, toggleExpenseStatus } from '../controllers/expenseController.js';

const expenseRouter = express.Router();

expenseRouter.post('/add', userAuth, addExpense);
expenseRouter.get('/:roomId', userAuth, getRoomExpenses);
expenseRouter.delete('/:expenseId', userAuth, deleteExpense);
expenseRouter.post('/toggle-status', userAuth, toggleExpenseStatus);

export default expenseRouter;