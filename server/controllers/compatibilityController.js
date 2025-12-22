//Implemented by Nusayba

import userModel from '../models/userModel.js';
import preferencesModel from '../models/preferencesModel.js';
import { calculateCompatibility } from '../services/compatibilityService.js';

export const getCompatibilityScore = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user.id; 

       
        const preferences = await preferencesModel.findOne({ user: currentUserId });

        
        const targetUser = await userModel.findById(targetUserId);

        if (!preferences || !targetUser) {
            return res.json({ success: false, message: 'Data missing' });
        }

        
        const score = calculateCompatibility(targetUser, preferences);

        return res.json({
            success: true,
            compatibilityScore: score
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
