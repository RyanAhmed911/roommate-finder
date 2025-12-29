import mongoose from "mongoose";

// Prachurzo: From class diagram
const choreSchema = new mongoose.Schema({
    cooking: { type: String, required: true },
    sashingDishes: { type: String, required: true },
    cleaningRooms: { type: String, required: true },
    sweeping: { type: String, required: true },
    dustingFurnitures: { type: String, required: true },
    shopping: { type:String,required: true }
});

const choreModel = mongoose.models.chore || mongoose.model('chore', choreSchema);

export default choreModel;