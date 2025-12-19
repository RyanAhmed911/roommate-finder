// Prachurzo: From class diagram
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { 
    createRoom, 
    getAllRooms, 
    getRoomById, 
    updateRoom, 
    deleteRoom,
    joinRoom,
    leaveRoom,
    searchRooms,
    getAvailableRooms,
    getUserRooms
} from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post('/create', userAuth, createRoom);

roomRouter.get('/all', getAllRooms);

roomRouter.get('/available', getAvailableRooms);

roomRouter.get('/search', searchRooms);

roomRouter.get('/my-rooms', userAuth, getUserRooms);

roomRouter.get('/:roomId', getRoomById);

roomRouter.put('/:roomId', userAuth, updateRoom);

roomRouter.delete('/:roomId', userAuth, deleteRoom);

roomRouter.post('/:roomId/join', userAuth, joinRoom);

roomRouter.post('/:roomId/leave', userAuth, leaveRoom);

export default roomRouter;
// Prachurzo: From class diagram