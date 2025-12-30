import choreModel from '../models/choreModel.js';
import roomModel from '../models/roomModel.js';
import userModel from '../models/userModel.js';


export const addChore = async (req, res) => {
    try {
        const { title, assignedTo, date } = req.body;
        const userId = req.userId; 

        const room = await roomModel.findOne({ users: userId });
        if (!room) {
            return res.json({ success: false, message: 'You are not in a room!' });
        }


        if (!room.users.includes(assignedTo)) {
            return res.json({ success: false, message: 'Assigned user is not in your room' });
        }

        const newChore = new choreModel({
            room: room._id,
            assignedTo,
            title,
            date: date || Date.now()
        });

        await newChore.save();
        await newChore.populate('assignedTo', 'name image');

        res.json({ success: true, message: 'Chore assigned successfully', chore: newChore });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const getRoomChores = async (req, res) => {
    try {
        const userId = req.userId;
        const room = await roomModel.findOne({ users: userId });

        if (!room) {
            return res.json({ success: true, chores: [] });
        }

        const chores = await choreModel.find({ room: room._id })
            .populate('assignedTo', 'name image')
            .sort({ date: 1 });

        res.json({ success: true, chores });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const updateChoreStatus = async (req, res) => {
    try {
        const { choreId, status } = req.body;
        const userId = req.userId; 

        const chore = await choreModel.findById(choreId);

        if (!chore) {
            return res.json({ success: false, message: 'Chore not found' });
        }

        
        if (chore.assignedTo.toString() !== userId) {
            return res.json({ success: false, message: 'Only the assigned person can update this task' });
        }

        chore.status = status;
        
        await chore.save();
        await chore.populate('assignedTo', 'name image');

        res.json({ success: true, message: 'Status updated', chore });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const deleteChore = async (req, res) => {
    try {
        const { choreId } = req.body;
        await choreModel.findByIdAndDelete(choreId);
        res.json({ success: true, message: 'Chore deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};