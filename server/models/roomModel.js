import mongoose from "mongoose";

// Prachurzo: From class diagram
const roomSchema = new mongoose.Schema({
    location: { type: String, required: true },
    rent: { type: Number, required: true },
    status: { type: Boolean, default: false },
    capacity: { type: Number, required: true },
    RoomID: { type: String, required: true, unique: true },
    balcony: { type: Boolean, default: false },
    attachedBathroom: { type: Boolean, default: false },
    users: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] },
    floor: { type: Number, required: true },
    area: { type: Number, required: true }

});

// Prachurzo: From class diagram 
const roomModel = mongoose.models.room || mongoose.model('room', roomSchema);

export default roomModel;

