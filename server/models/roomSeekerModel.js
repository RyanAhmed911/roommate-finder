import mongoose from "mongoose";
// Neshat: From class diagram
const roomSeekerSchema = new mongoose.Schema({
    budget: { type: Number, required: true },
    locationPreference: { type: [String], default: [] },
    status: { type: Boolean, default: false }
});
// Neshat: From class diagram
const roomSeekerModel = mongoose.models.roomSeeker || mongoose.model('roomSeeker', roomSeekerSchema);
export default roomSeekerModel;