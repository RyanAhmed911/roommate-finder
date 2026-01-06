import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
    addFavoriteRoommate,
    removeFavoriteRoommate,
    getFavoriteRoommates
} from '../controllers/favoriteRoommatesController.js';

const favoriteRoommatesRouter = express.Router();
favoriteRoommatesRouter.use(userAuth);

favoriteRoommatesRouter.get('/', getFavoriteRoommates);
favoriteRoommatesRouter.post('/add', addFavoriteRoommate);
favoriteRoommatesRouter.post('/remove', removeFavoriteRoommate);

export default favoriteRoommatesRouter;

