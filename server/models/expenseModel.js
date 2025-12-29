import mongoose from "mongoose";

// Prachurzo: From class diagram
const expenseSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true }, //Added by Ryan
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, //Added by Ryan
    title: { type: String, required: true }, //Added by Ryan
    status: { type: String, default: 'Pending' }, //Added by Ryan
    date: { type: Date, default: Date.now}, //Added by Ryan
    type: { type: String, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true }
});

const expenseModel = mongoose.models.expense || mongoose.model('expense', expenseSchema);

export default expenseModel;

