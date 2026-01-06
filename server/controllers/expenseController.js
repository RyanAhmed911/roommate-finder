import expenseModel from '../models/expenseModel.js';
import roomModel from '../models/roomModel.js';

//add new expemse
export const addExpense = async (req, res) => {
  try {
    const { roomId, title, type, amount, dueDate } = req.body;
    const userId = req.userId;

    // Find the room
    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Check if user is in the room
    const userInRoom = room.users.includes(userId);
    if (!userInRoom) {
      return res.json({ success: false, message: "You are not part of this room" });
    }

    // Create new expense object
    const newExpense = new expenseModel({
      roomId: roomId,
      createdBy: userId,
      title: title,
      type: type,
      amount: amount,
      dueDate: dueDate,
      status: 'Pending'
    });

    // Save to database
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

//get expenses for a room
export const getRoomExpenses = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // Find the room
    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Check if user belongs to the room
    const userInRoom = room.users.includes(userId);
    if (!userInRoom) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // Find expenses for the room
    const expenses = await expenseModel.find({ roomId: roomId })
      .sort({ dueDate: 1 }) // sort by due date
      .populate('createdBy', 'name'); // attach creator info

    return res.json({
      success: true,
      expenses: expenses
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.userId;

    // Find the expense
    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.json({ success: false, message: "Expense not found" });
    }

    // Only creator can delete
    if (expense.createdBy.toString() !== userId) {
      return res.json({ success: false, message: "Only the creator can delete this expense" });
    }

    // Delete the expense
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

    // Find the expense
    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.json({ success: false, message: "Expense not found" });
    }

    // Switch status
    if (expense.status === 'Paid') {
      expense.status = 'Pending';
    } else {
      expense.status = 'Paid';
    }

    // Save updated expense
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