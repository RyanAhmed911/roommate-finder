import requestModel from '../models/requestModel.js';
import roomModel from '../models/roomModel.js';
import userModel from '../models/userModel.js';

// 1. Send an Invite (Room Owner -> Potential Roommate)
export const sendInvite = async (req, res) => {
    try {
        const { receiverId } = req.body; 
        const senderId = req.userId;     

        const room = await roomModel.findOne({ users: senderId });
        
        if (!room) {
            return res.json({ success: false, message: "You must have a room to send invites." });
        }

        if (room.users.length >= room.capacity) {
            return res.json({ success: false, message: "Your room is already full." });
        }

        const receiver = await userModel.findById(receiverId);
        if (!receiver) {
            return res.json({ success: false, message: "User not found." });
        }

        // Check if receiver is already in a room
        const receiverRoom = await roomModel.findOne({ users: receiverId });
        if (receiverRoom) {
            return res.json({ success: false, message: "This user is already in a room." });
        }

        const existingRequest = await requestModel.findOne({
            senderId,
            receiverId,
            roomId: room._id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.json({ success: false, message: "Invite already sent." });
        }

        const newRequest = new requestModel({
            senderId,
            receiverId,
            roomId: room._id,
            status: 'pending'
        });

        await newRequest.save();
        res.json({ success: true, message: "Invite sent successfully!" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 2. Request to Join (User -> Room Owner)
export const requestToJoin = async (req, res) => {
    try {
        const { roomId } = req.body; 
        const senderId = req.userId; 

        const room = await roomModel.findById(roomId);
        if (!room) {
            return res.json({ success: false, message: "Room not found." });
        }

        if (room.users.length >= room.capacity) {
            return res.json({ success: false, message: "This room is already full." });
        }

        // Identify Receiver (The Room Owner)
        const ownerId = room.users[0]; 
        
        if (room.users.includes(senderId)) {
            return res.json({ success: false, message: "You are already in this room." });
        }

        // Check if user is already in another room
        const userExistingRoom = await roomModel.findOne({ users: senderId });
        if (userExistingRoom) {
             return res.json({ success: false, message: "You are already in a room. Leave it first." });
        }

        const existingRequest = await requestModel.findOne({
            senderId,
            receiverId: ownerId,
            roomId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.json({ success: false, message: "Request already sent." });
        }

        const newRequest = new requestModel({
            senderId,
            receiverId: ownerId,
            roomId,
            status: 'pending'
        });

        await newRequest.save();
        res.json({ success: true, message: "Request sent to room owner!" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. Get My Received Invites/Requests
export const getMyRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await requestModel.find({ receiverId: userId, status: 'pending' })
            .populate('senderId', 'name email image') 
            .populate('roomId', 'location rent');     

        res.json({ success: true, requests });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 4. Respond to Request (Accept/Reject)
export const respondToRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; 
        const userId = req.userId; // The person clicking Accept/Reject

        const request = await requestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found." });
        }

        if (request.receiverId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized." });
        }

        if (action === 'rejected') {
            request.status = 'rejected';
            await request.save();
            return res.json({ success: true, message: "Request rejected." });
        }

        if (action === 'accepted') {
            const room = await roomModel.findById(request.roomId);
            if (!room) {
                return res.json({ success: false, message: "Room no longer exists." });
            }

            if (room.users.length >= room.capacity) {
                return res.json({ success: false, message: "Room is now full." });
            }

            // --- FIXED LOGIC HERE ---
            // If the person accepting (userId) is already in the room (e.g., Owner accepting a join request),
            // then we add the SENDER.
            // If the person accepting is NOT in the room (e.g., User accepting an invite),
            // then we add the RECEIVER (userId).
            
            const userToAdd = room.users.includes(userId) ? request.senderId : userId;

            // Double check to avoid duplicates
            if (!room.users.includes(userToAdd)) {
                room.users.push(userToAdd);
            }
            
            if (room.users.length >= room.capacity) {
                room.status = false; 
            }
            await room.save();

            request.status = 'accepted';
            await request.save();

            // Clear other pending requests for the new member
            await requestModel.updateMany(
                { 
                    $or: [
                        { receiverId: userToAdd, status: 'pending' }, // Invites sent TO them
                        { senderId: userToAdd, status: 'pending' }    // Requests sent BY them
                    ]
                },
                { status: 'rejected' }
            );

            return res.json({ success: true, message: "Request accepted! Member added." });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};