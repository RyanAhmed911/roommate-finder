//Implemented by Nusayba
import userModel from '../models/userModel.js';
import roomModel from '../models/roomModel.js';
import { calculateCompatibility } from '../services/compatibilityService.js';

export const getCompatibilityScore = async (req, res) => {
    try {
        const { userId, roomId } = req.body;

        if (!userId || !roomId) {
            return res.json({ success: false, message: 'Missing IDs' });
        }

        const user = await userModel.findById(userId);
        const room = await roomModel.findById(roomId);

        if (!user || !room) {
            return res.json({ success: false, message: 'User or Room not found' });
        }

        const score = calculateCompatibility(user, room);

        res.json({
            success: true,
            compatibilityScore: score
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};