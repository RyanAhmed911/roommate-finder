import roomModel from '../models/roomModel.js';
import mongoose from 'mongoose';

export const createRoom = async (req, res) => {
    try {
        const { 
            location, rent, capacity, balcony, attachedBathroom, floor, area, status,
            roomType, furnishingStatus, wifi, refrigerator, kitchenAccess, parking, elevator, generator, securityGuard,
            personalityType, hobbies, foodHabits, sleepSchedule, cleanlinessLevel, noiseTolerance, medicalConditions,
            smoker, drinking, visitors, petsAllowed
        } = req.body;
        
        const userId = req.userId; 

        const RoomID = `ROOM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newRoom = new roomModel({
            location, rent, capacity, RoomID, floor, area,
            balcony: balcony || false,
            attachedBathroom: attachedBathroom || false,
            users: [userId],
            status: status !== undefined ? status : true,
            
            roomType: roomType || 'Shared',
            furnishingStatus: furnishingStatus || 'Unfurnished',
            wifi: wifi || false,
            refrigerator: refrigerator || false,
            kitchenAccess: kitchenAccess || false,
            parking: parking || false,
            elevator: elevator || false,
            generator: generator || false,
            securityGuard: securityGuard || false,

            personalityType: personalityType || '',
            hobbies: hobbies || [],
            foodHabits: foodHabits || '',
            sleepSchedule: sleepSchedule || '',
            cleanlinessLevel: cleanlinessLevel || '',
            noiseTolerance: noiseTolerance || '',
            medicalConditions: medicalConditions || [],
            smoker: smoker || false,
            drinking: drinking || false,
            visitors: visitors || false,
            petsAllowed: petsAllowed || false
        });

        await newRoom.save();
        res.json({ success: true, message: 'Room created successfully', room: newRoom });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAvailableRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({ status: true }).populate('users', 'name email');
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find().populate('users', 'name email gender age image');
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const { roomId } = req.params

        const room = await roomModel.findById(roomId).populate(
            'users',
            'name email gender age institution image'
        )

        if (!room) return res.json({ success: false, message: 'Room not found' })

        res.json({ success: true, room })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const searchRooms = async (req, res) => {
    try {
        const { location, minRent, maxRent, balcony, attachedBathroom, minArea } = req.query;

        let filter = { status: true }; 

        if (location) filter.location = { $regex: location, $options: 'i' };
        if (minRent) filter.rent = { ...filter.rent, $gte: Number(minRent) };
        if (maxRent) filter.rent = { ...filter.rent, $lte: Number(maxRent) };
        if (balcony) filter.balcony = balcony === 'true';
        if (attachedBathroom) filter.attachedBathroom = attachedBathroom === 'true';
        if (minArea) filter.area = { $gte: Number(minArea) };

        const rooms = await roomModel.find(filter).populate('users', 'name email image');
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;
        const updates = req.body;

        const room = await roomModel.findById(roomId);
        
        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.users.includes(userId)) {
            return res.json({ success: false, message: 'Unauthorized to update this room' });
        }

        const updatedRoom = await roomModel.findByIdAndUpdate(roomId, updates, { new: true });
        res.json({ success: true, message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await roomModel.findById(roomId);
        
        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (room.users[0].toString() !== userId) {
            return res.json({ success: false, message: 'Only room creator can delete' });
        }

        await roomModel.findByIdAndDelete(roomId);
        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.status) {
            return res.json({ success: false, message: 'Room is not available' });
        }

        if (room.users.includes(userId)) {
            return res.json({ success: false, message: 'Already joined this room' });
        }

        if (room.users.length >= room.capacity) {
            return res.json({ success: false, message: 'Room is full' });
        }

        room.users.push(userId);
        
        if (room.users.length >= room.capacity) {
            room.status = false;
        }

        await room.save();
        res.json({ success: true, message: 'Joined room successfully', room });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        if (!room.users.includes(userId)) {
            return res.json({ success: false, message: 'Not a member of this room' });
        }

        room.users = room.users.filter(user => user.toString() !== userId);
        
        if (room.users.length < room.capacity) {
            room.status = true;
        }

        await room.save();
        res.json({ success: true, message: 'Left room successfully', room });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserRooms = async (req, res) => {
    try {
        const userId = req.userId;
        
        const rooms = await roomModel.find({ users: userId }).populate('users', 'name email image');
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};