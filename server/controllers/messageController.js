import roomModel from "../models/roomModel.js";
import messageModel from "../models/messageModel.js";

export const getRoomMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const room = await roomModel.findOne({ users: userId });

    if (!room) {
      return res.json({
        success: false,
        message: "You are not part of any room"
      });
    }

    const messages = await messageModel
      .find({ room: room._id })
      .populate("sender", "name image")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendRoomMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.json({
        success: false,
        message: "Message cannot be empty"
      });
    }

    const room = await roomModel.findOne({ users: userId });

    if (!room) {
      return res.json({
        success: false,
        message: "You are not part of any room"
      });
    }

    const newMessage = new messageModel({
      room: room._id,
      sender: userId,
      text
    });

    await newMessage.save();

    const populatedMessage = await newMessage.populate(
      "sender",
      "name image"
    );

    res.json({ success: true, message: populatedMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
