import reportModel from '../models/reportModel.js';
import userModel from '../models/userModel.js';


export const createReport = async (req, res) => {
    try {
        const { targetId, reason } = req.body;
        const senderId = req.userId;

        if (targetId === senderId) {
            return res.json({ success: false, message: "You cannot report yourself." });
        }

        const targetUser = await userModel.findById(targetId);
        if (!targetUser) {
            return res.json({ success: false, message: "User not found." });
        }

        const newReport = new reportModel({
            sender: senderId,
            target: targetId,
            reason
        });

        await newReport.save();

        res.json({ success: true, message: 'User reported successfully. Admin will review.' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const getUserReports = async (req, res) => {
    try {
        const { userId } = req.params;
        
        
        const reports = await reportModel.find({ target: userId })
            .populate('sender', 'name') 
            .sort({ date: -1 });

        res.json({ success: true, reports });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};