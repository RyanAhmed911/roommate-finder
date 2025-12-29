import mongoose from "mongoose";
// Neshat: From class diagram
const requestSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },  
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, 
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },     
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const requestModel = mongoose.models.request || mongoose.model('request', requestSchema);
export default requestModel;