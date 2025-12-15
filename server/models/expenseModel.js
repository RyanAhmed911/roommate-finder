import mongoose from "mongoose";

// Prachurzo: From class diagram

const expenseSchema = new mongoose.Schema({
    status: { type: String, required: true },
    type: { type: String, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true }
});

const expenseModel = mongoose.models.expense || mongoose.model('expense', expenseSchema);

export default expenseModel;

