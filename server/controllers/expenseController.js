import expenseModel from '../models/expenseModel.js';
import roomModel from '../models/roomModel.js';

export const addExpense = async (req, res) => {
    try {
        const { roomId, title, type, amount, dueDate } = req.body;
        const userId = req.userId;

        const room = await roomModel.findById(roomId);
        if (!room || !room.users.includes(userId)) {
            return res.json({ success: false, message: "Unauthorized or Room not found" });
        }

        const newExpense = new expenseModel({
            roomId,
            createdBy: userId,
            title,
            type,
            amount,
            dueDate,
            status: 'Pending'
        });

        await newExpense.save();
        res.json({ success: true, message: "Expense added successfully", expense: newExpense });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getRoomExpenses = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await roomModel.findById(roomId);
        if (!room || !room.users.includes(userId)) {
            return res.json({ success: false, message: "Unauthorized access" });
        }

        const expenses = await expenseModel.find({ roomId })
            .sort({ dueDate: 1 })
            .populate('createdBy', 'name');

        res.json({ success: true, expenses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const userId = req.userId;

        const expense = await expenseModel.findById(expenseId);
        if (!expense) {
            return res.json({ success: false, message: "Expense not found" });
        }

        if (expense.createdBy.toString() !== userId) {
            return res.json({ success: false, message: "Only the creator can delete this" });
        }

        await expenseModel.findByIdAndDelete(expenseId);
        res.json({ success: true, message: "Expense deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleExpenseStatus = async (req, res) => {
    try {
        const { expenseId } = req.body;
        const expense = await expenseModel.findById(expenseId);
        
        if (!expense) return res.json({ success: false, message: "Expense not found" });

        expense.status = expense.status === 'Paid' ? 'Pending' : 'Paid';
        await expense.save();

        res.json({ success: true, message: "Status updated", expense });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}