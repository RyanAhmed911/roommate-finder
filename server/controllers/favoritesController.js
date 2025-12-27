import favoritesModel from '../models/favouritesModel.js';
import roomModel from '../models/roomModel.js';
import mongoose from 'mongoose';

export const addToFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const { roomID } = req.body;

        if (!roomID) {
            return res.json({ success: false, message: 'Room ID is required' });
        }

        const room = await roomModel.findOne({ RoomID: roomID });
        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        let favorites = await favoritesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            favorites = new favoritesModel({
                favoritesID: userId,
                posts: [room._id]
            });
            await favorites.save();
            return res.json({ 
                success: true, 
                message: 'Room added to favorites', 
                favorites 
            });
        }

        if (favorites.posts.includes(room._id)) {
            return res.json({ 
                success: false, 
                message: 'Room already in favorites' 
            });
        }

        favorites.posts.push(room._id);
        await favorites.save();

        res.json({ 
            success: true, 
            message: 'Room added to favorites', 
            favorites 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const { roomID } = req.body;

        if (!roomID) {
            return res.json({ success: false, message: 'Room ID is required' });
        }

        const room = await roomModel.findOne({ RoomID: roomID });
        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        const favorites = await favoritesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            return res.json({ 
                success: false, 
                message: 'No favorites list found' 
            });
        }

        if (!favorites.posts.includes(room._id)) {
            return res.json({ 
                success: false, 
                message: 'Room not in favorites' 
            });
        }

        favorites.posts = favorites.posts.filter(
            postId => postId.toString() !== room._id.toString()
        );
        await favorites.save();

        res.json({ 
            success: true, 
            message: 'Room removed from favorites', 
            favorites 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const userId = req.userId;

        const favorites = await favoritesModel
            .findOne({ favoritesID: userId })
            .populate({
                path: 'posts',
                populate: {
                    path: 'users',
                    select: 'name email gender'
                }
            });

        if (!favorites) {
            return res.json({ 
                success: true, 
                message: 'No favorites yet', 
                rooms: [] 
            });
        }

        res.json({ 
            success: true, 
            rooms: favorites.posts,
            count: favorites.posts.length
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const isFavorite = async (req, res) => {
    try {
        const userId = req.userId;
        const { roomID } = req.params;

        const room = await roomModel.findOne({ RoomID: roomID });
        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }

        const favorites = await favoritesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            return res.json({ success: true, isFavorite: false });
        }

        const isFavorite = favorites.posts.includes(room._id);
        res.json({ success: true, isFavorite });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const clearFavorites = async (req, res) => {
    try {
        const userId = req.userId;

        const favorites = await favoritesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            return res.json({ 
                success: false, 
                message: 'No favorites list found' 
            });
        }

        favorites.posts = [];
        await favorites.save();

        res.json({ 
            success: true, 
            message: 'All favorites cleared' 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getFavoritesCount = async (req, res) => {
    try {
        const userId = req.userId;

        const favorites = await favoritesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            return res.json({ success: true, count: 0 });
        }

        res.json({ 
            success: true, 
            count: favorites.posts.length 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};