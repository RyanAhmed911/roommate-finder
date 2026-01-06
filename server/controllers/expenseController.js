import expenseModel from '../models/expenseModel.js';
import roomModel from '../models/roomModel.js';

export const addExpense = async (req, res) => {
  try {
    const { roomId, title, type, amount, dueDate } = req.body;
    const userId = req.userId;

    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    const userInRoom = room.users.includes(userId);
    if (!userInRoom) {
      return res.json({ success: false, message: "You are not part of this room" });
    }

    const newExpense = new expenseModel({
      roomId: roomId,
      createdBy: userId,
      title: title,
      type: type,
      amount: amount,
      dueDate: dueDate,
      status: 'Pending'
    });

    await newExpense.save();

    return res.json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getRoomExpenses = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    const userInRoom = room.users.includes(userId);
    if (!userInRoom) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    const expenses = await expenseModel.find({ roomId: roomId })
      .sort({ dueDate: 1 }) 
      .populate('createdBy', 'name'); 

    return res.json({
      success: true,
      expenses: expenses
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.userId;

    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.json({ success: false, message: "Expense not found" });
    }

    if (expense.createdBy.toString() !== userId) {
      return res.json({ success: false, message: "Only the creator can delete this expense" });
    }

    await expenseModel.findByIdAndDelete(expenseId);

    return res.json({
      success: true,
      message: "Expense deleted successfully"
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const toggleExpenseStatus = async (req, res) => {
  try {
    const { expenseId } = req.body;

    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.json({ success: false, message: "Expense not found" });
    }

    if (expense.status === 'Paid') {
      expense.status = 'Pending';
    } else {
      expense.status = 'Paid';
    }

    await expense.save();

    return res.json({
      success: true,
      message: "Expense status updated",
      expense: expense
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//added by Nusayba