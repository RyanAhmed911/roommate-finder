import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    location: { type: String, required: true },
    rent: { type: Number, required: true },
    status: { type: Boolean, default: false },
    capacity: { type: Number, required: true },
    RoomID: { type: String, required: true, unique: true },
    balcony: { type: Boolean, default: false },
    attachedBathroom: { type: Boolean, default: false },
    users: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] },
    pendingRequests: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] },
    floor: { type: Number, required: true },
    area: { type: Number, required: true },

    // Added image field for room picture
    image: { type: String, default: '' },

    roomType: { type: String, default: 'Shared' }, 
    furnishingStatus: { type: String, default: 'Unfurnished' }, 
    wifi: { type: Boolean, default: false },
    refrigerator: { type: Boolean, default: false },
    kitchenAccess: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    generator: { type: Boolean, default: false },
    securityGuard: { type: Boolean, default: false },
    
    personalityType: { type: String, default: '' },
    hobbies: { type: [String], default: [] },
    foodHabits: { type: String, default: '' },
    sleepSchedule: { type: String, default: '' },
    cleanlinessLevel: { type: String, default: '' },
    noiseTolerance: { type: String, default: '' },
    medicalConditions: { type: [String], default: [] },
    smoker: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    visitors: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false }
});

const roomModel = mongoose.models.room || mongoose.model('room', roomSchema);

export default roomModel;