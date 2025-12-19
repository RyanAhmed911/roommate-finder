import mongoose from "mongoose";
// Neshat: From class diagram
const requestSchema = new mongoose.Schema({
    requesterID: { type: String, required: true },
    receiverID: { type: String, required: true },
    senderID: { type: String, required: true }
});

const requestModel = mongoose.models.request || mongoose.model('request', requestSchema);
export default requestModel;
import mongoose from "mongoose";