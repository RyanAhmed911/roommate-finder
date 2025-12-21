import roomModel from '../models/roomModel.js';

export const sendRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { roomId } = req.body;

        if (!roomId) {
            return res.json({ success: false, message: 'Room ID is required' });
        }

        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.status) {
            return res.json({ success: false, message: 'Room is not available' });
        }

        if (room.users.includes(userId)) {
            return res.json({ success: false, message: 'You are already in this room' });
        }

        if (room.pendingRequests.includes(userId)) {
            return res.json({ success: false, message: 'Request already sent' });
        }

        if (room.users.length >= room.capacity) {
            return res.json({ success: false, message: 'Room is full' });
        }

        room.pendingRequests.push(userId);
        await room.save();

        res.json({ 
            success: true, 
            message: 'Join request sent successfully. Waiting for approval.'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const approveRequest = async (req, res) => {
    try {
        const { roomId, requestUserId } = req.body;
        const roomOwnerId = req.userId;

        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.users.includes(roomOwnerId)) {
            return res.json({ success: false, message: 'Only room members can approve requests' });
        }

        if (!room.pendingRequests.includes(requestUserId)) {
            return res.json({ success: false, message: 'No pending request from this user' });
        }

        if (room.users.length >= room.capacity) {
            return res.json({ success: false, message: 'Room is full' });
        }

        room.pendingRequests = room.pendingRequests.filter(
            id => id.toString() !== requestUserId
        );
        room.users.push(requestUserId);

        if (room.users.length >= room.capacity) {
            room.status = false;
            room.pendingRequests = [];
        }

        await room.save();

        const populatedRoom = await roomModel.findById(roomId).populate('users', 'name email');

        res.json({ 
            success: true, 
            message: 'Request approved successfully',
            room: populatedRoom
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const rejectRequest = async (req, res) => {
    try {
        const { roomId, requestUserId } = req.body;
        const roomOwnerId = req.userId;

        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.users.includes(roomOwnerId)) {
            return res.json({ success: false, message: 'Only room members can reject requests' });
        }

        if (!room.pendingRequests.includes(requestUserId)) {
            return res.json({ success: false, message: 'No pending request from this user' });
        }

        room.pendingRequests = room.pendingRequests.filter(
            id => id.toString() !== requestUserId
        );

        await room.save();

        res.json({ 
            success: true, 
            message: 'Request rejected successfully'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await roomModel.findById(roomId).populate('pendingRequests', 'name email gender age hobbies');

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.users.includes(userId)) {
            return res.json({ success: false, message: 'Only room members can view requests' });
        }

        res.json({ 
            success: true, 
            pendingRequests: room.pendingRequests,
            count: room.pendingRequests.length
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const cancelRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { roomId } = req.body;

        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.pendingRequests.includes(userId)) {
            return res.json({ success: false, message: 'No pending request found' });
        }

        room.pendingRequests = room.pendingRequests.filter(
            id => id.toString() !== userId
        );

        await room.save();

        res.json({ 
            success: true, 
            message: 'Request cancelled successfully'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};