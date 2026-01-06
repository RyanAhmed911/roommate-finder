import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getRoomMessages,
  sendRoomMessage
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/", userAuth, getRoomMessages);
messageRouter.post("/", userAuth, sendRoomMessage);

export default messageRouter;