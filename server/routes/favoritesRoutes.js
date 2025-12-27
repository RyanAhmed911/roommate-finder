// Prachurzo: From class diagram
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { 
    addToFavorites, 
    removeFromFavorites, 
    getFavorites,
    isFavorite,
    clearFavorites,
    getFavoritesCount
} from '../controllers/favoritesController.js';

const favoritesRouter = express.Router();
favoritesRouter.use(userAuth);
favoritesRouter.get('/', getFavorites);
favoritesRouter.get('/count', getFavoritesCount);
favoritesRouter.get('/check/:roomID', isFavorite);
favoritesRouter.post('/add', addToFavorites);
favoritesRouter.post('/remove', removeFromFavorites);
favoritesRouter.delete('/clear', clearFavorites);
export default favoritesRouter;
// Prachurzo: From class diagram