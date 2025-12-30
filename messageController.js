import messageModel from '../models/messageModel.js';
import roomModel from '../models/roomModel.js';


export const sendMessage = async (req, res) => {
    try {
        const { messageContent, attachment, attachmentType } = req.body;
        const userId = req.userId;

        const room = await roomModel.findOne({ users: userId });

        if (!room) {
            return res.json({ success: false, message: 'You are not in a room!' });
        }

        const newMessage = new messageModel({
            room: room._id,
            sender: userId,
            messageContent: messageContent || "Sent an attachment",
            attachment: attachment || "",
            attachmentType: attachmentType || ""
        });

        await newMessage.save();
        await newMessage.populate('sender', 'name image');

        res.json({ success: true, message: 'Message sent', data: newMessage });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const getRoomMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const room = await roomModel.findOne({ users: userId });

        if (!room) {
            return res.json({ success: true, messages: [] });
        }

        const messages = await messageModel.find({ room: room._id })
            .populate('sender', 'name image')
            .sort({ sendingTime: 1 });

        res.json({ success: true, messages });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const updateMessage = async (req, res) => {
    try {
        const { messageId, newContent } = req.body;
        const userId = req.userId;

        const message = await messageModel.findById(messageId);
        if (!message) return res.json({ success: false, message: "Message not found" });

        
        if (message.sender.toString() !== userId) {
            return res.json({ success: false, message: "You can only edit your own messages" });
        }
        if (message.isDeleted) {
            return res.json({ success: false, message: "Cannot edit a deleted message" });
        }

        message.messageContent = newContent;
        message.isEdited = true;
        await message.save();

        res.json({ success: true, message: "Message updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;
        const userId = req.userId;

        const message = await messageModel.findById(messageId);
        if (!message) return res.json({ success: false, message: "Message not found" });

        
        if (message.sender.toString() !== userId) {
            return res.json({ success: false, message: "You can only delete your own messages" });
        }

        
        message.isDeleted = true;
        message.messageContent = "This message was deleted";
        message.attachment = ""; 
        message.attachmentType = ""; 
        
        await message.save();

        res.json({ success: true, message: "Message deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};