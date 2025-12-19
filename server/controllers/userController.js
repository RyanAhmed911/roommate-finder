//This part was implemented by Ryan
import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ 
            success: true, 
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                isProfileCompleted: user.isProfileCompleted,
            }  
        }); 
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const {
            userId,
            hobbies,
            age,
            location,
            smoker,
            personalityType,
            medicalConditions,
            institution,
            gender,
            visitors
        } = req.body;

        if (!userId) {
            return res.json({ success: false, message: 'User ID is missing' });
        }

        const user = await userModel.findByIdAndUpdate(userId, {
            hobbies,
            age,
            location,
            smoker,
            personalityType,
            medicalConditions,
            institution,
            gender,
            visitors,
            isProfileCompleted: true
        });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
//This part was implemented by Ryan
