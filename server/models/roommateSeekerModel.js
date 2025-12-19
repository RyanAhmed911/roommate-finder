import mongoose from "mongoose";

// Neshat from class diagram
const roommateSeekerSchema = new mongoose.Schema({
    numberOfRoomates: { type: Number, required: true }
});

const roommateSeekerModel = mongoose.models.roommateSeeker || mongoose.model('roommateSeeker', roommateSeekerSchema);

export default roommateSeekerModel;