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
roomRouter.post('/search', userAuth, searchRooms); 
roomRouter.get('/search', searchRooms);
roomRouter.get('/my-rooms', userAuth, getUserRooms);
roomRouter.get('/:roomId', getRoomById);
roomRouter.put('/:roomId', userAuth, updateRoom);
roomRouter.delete('/:roomId', userAuth, deleteRoom);
roomRouter.post('/:roomId/join', userAuth, joinRoom);
roomRouter.post('/:roomId/leave', userAuth, leaveRoom);
roomRouter.post('/request/send', userAuth, sendRequest);
roomRouter.post('/request/approve', userAuth, approveRequest);
roomRouter.post('/request/reject', userAuth, rejectRequest);
roomRouter.post('/request/cancel', userAuth, cancelRequest);
roomRouter.get('/:roomId/requests', userAuth, getPendingRequests);

export default roomRouter;
// Prachurzo: From class diagram