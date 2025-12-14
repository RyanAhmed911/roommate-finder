import mongoose from "mongoose";


// Prachurzo: From class diagram
const reportSchema = new mongoose.Schema({
    reportID: { type: String, required: true, unique: true },
    sender: { type: String, required: true },
    target: { type: String, required: true },
    reportContent: { type: String, required: true }
});

const reportModel = mongoose.models.report || mongoose.model('report', reportSchema);

// Prachurzo: From class diagram
export default reportModel;

