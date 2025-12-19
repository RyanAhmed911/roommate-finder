import mongoose from "mongoose";

// Prachurzo: From class diagram
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    messageContent: { type: String, required: true },
    sendingTime: { type: Date, required: true }
});

const messageModel = mongoose.models.message || mongoose.model('message', messageSchema);

export default messageModel;

