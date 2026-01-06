import favoriteRoommatesModel from '../models/favoriteRoommatesModel.js';
import userModel from '../models/userModel.js';

const ensureRoommatesArray = (doc) => {
    if (!doc) return doc;

    const hasRoommates = Array.isArray(doc.roommates);
    const hasOldPosts = Array.isArray(doc.posts) && doc.posts.length > 0;

    if (!hasRoommates) doc.roommates = [];

    if (doc.roommates.length === 0 && hasOldPosts) {
        doc.roommates = doc.posts;
        doc.posts = [];
    }

    if (!Array.isArray(doc.roommates)) doc.roommates = [];
    return doc;
};

export const addFavoriteRoommate = async (req, res) => {
    try {
        const userId = req.userId;
        const { roommateID } = req.body;

        if (!roommateID) {
            return res.json({ success: false, message: 'Roommate ID is required' });
        }

        if (roommateID.toString() === userId.toString()) {
            return res.json({ success: false, message: "You can't favorite yourself" });
        }

        const roommate = await userModel.findById(roommateID);
        if (!roommate) {
            return res.json({ success: false, message: 'User not found' });
        }

        let favorites = await favoriteRoommatesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            favorites = new favoriteRoommatesModel({
                favoritesID: userId,
                roommates: [roommate._id]
            });
            await favorites.save();
            return res.json({
                success: true,
                message: 'Roommate added to favorites',
                favorites
            });
        }

        ensureRoommatesArray(favorites);

        const alreadyInFavorites = favorites.roommates.some(
            (id) => id.toString() === roommate._id.toString()
        );

        if (alreadyInFavorites) {
            return res.json({
                success: false,
                message: 'Roommate already in favorites'
            });
        }

        favorites.roommates.push(roommate._id);
        await favorites.save();

        return res.json({
            success: true,
            message: 'Roommate added to favorites',
            favorites
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const removeFavoriteRoommate = async (req, res) => {
    try {
        const userId = req.userId;
        const { roommateID } = req.body;

        if (!roommateID) {
            return res.json({ success: false, message: 'Roommate ID is required' });
        }

        const roommate = await userModel.findById(roommateID);
        if (!roommate) {
            return res.json({ success: false, message: 'User not found' });
        }

        const favorites = await favoriteRoommatesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            return res.json({ success: false, message: 'No favorites list found' });
        }

        ensureRoommatesArray(favorites);

        const existsInFavorites = favorites.roommates.some(
            (id) => id.toString() === roommate._id.toString()
        );

        if (!existsInFavorites) {
            return res.json({
                success: false,
                message: 'Roommate not in favorites'
            });
        }

        favorites.roommates = favorites.roommates.filter(
            (id) => id.toString() !== roommate._id.toString()
        );

        await favorites.save();

        return res.json({
            success: true,
            message: 'Roommate removed from favorites',
            favorites
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const getFavoriteRoommates = async (req, res) => {
    try {
        const userId = req.userId;

        let favorites = await favoriteRoommatesModel.findOne({ favoritesID: userId });

        if (!favorites) {
            return res.json({
                success: true,
                message: 'No favorite roommates yet',
                roommates: [],
                count: 0
            });
        }

        ensureRoommatesArray(favorites);

        await favorites.save();

        favorites = await favoriteRoommatesModel
            .findOne({ favoritesID: userId })
            .populate({
                path: 'roommates',
                select: '-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt'
            });

        return res.json({
            success: true,
            roommates: favorites.roommates || [],
            count: (favorites.roommates || []).length
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
