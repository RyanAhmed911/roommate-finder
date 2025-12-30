import expenseModel from '../models/expenseModel.js';
import roomModel from '../models/roomModel.js';

export const addExpense = async (req, res) => {
    try {
        const { type, amount, date } = req.body;
        const userId = req.userId;

        const room = await roomModel.findOne({ users: userId });

        if (!room) {
            return res.json({ success: false, message: 'You are not in a room yet!' });
        }

        const newExpense = new expenseModel({
            room: room._id,
            user: userId,
            type,
            amount,
            date: date || Date.now()
        });

        await newExpense.save();
        await newExpense.populate('user', 'name');

        res.json({ success: true, message: 'Expense added successfully', expense: newExpense });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const getRoomExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const room = await roomModel.findOne({ users: userId });

        if (!room) {
            return res.json({ success: true, expenses: [] });
        }

        const expenses = await expenseModel.find({ room: room._id })
            .populate('user', 'name')
            .sort({ date: -1 });

        res.json({ success: true, expenses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const updateExpense = async (req, res) => {
    try {
        const { expenseId, type, amount, date } = req.body;
        const userId = req.userId;

        const expense = await expenseModel.findById(expenseId);

        if (!expense) {
            return res.json({ success: false, message: 'Expense not found' });
        }

        
        if (expense.user.toString() !== userId) {
            return res.json({ success: false, message: 'You can only edit your own expenses' });
        }

        expense.type = type;
        expense.amount = amount;
        expense.date = date;

        await expense.save();
        await expense.populate('user', 'name');

        res.json({ success: true, message: 'Expense updated', expense });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.body;
        const userId = req.userId;

        const expense = await expenseModel.findById(expenseId);

        if (!expense) {
            return res.json({ success: false, message: 'Expense not found' });
        }

        
        if (expense.user.toString() !== userId) {
            return res.json({ success: false, message: 'You can only delete your own expenses' });
        }

        await expenseModel.findByIdAndDelete(expenseId);
        res.json({ success: true, message: 'Expense deleted' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};