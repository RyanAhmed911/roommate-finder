import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;

//Fully Updated by Nusayba