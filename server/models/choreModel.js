import mongoose from "mongoose";

const choreSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },

  assignments: {
    cooking: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    washingDishes: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cleaningRooms: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sweeping: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dustingFurniture: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shopping: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },

  completed: {
    cooking: Boolean,
    washingDishes: Boolean,
    cleaningRooms: Boolean,
    sweeping: Boolean,
    dustingFurniture: Boolean,
    shopping: Boolean
  },

  lastRotation: {
    type: Date,
    default: new Date(0)
  }
});

export default mongoose.model("Chore", choreSchema);
