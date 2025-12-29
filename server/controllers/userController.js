//This part was implemented by Ryan
import userModel from '../models/userModel.js';
import roomModel from '../models/roomModel.js';

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
                image: user.image,
                age: user.age,
                gender: user.gender,
                location: user.location,
                institution: user.institution,
                personalityType: user.personalityType,
                hobbies: user.hobbies,
                medicalConditions: user.medicalConditions,
                smoker: user.smoker,
                visitors: user.visitors,
                phone: user.phone,
                status: user.status,
                nationality: user.nationality,
                languages: user.languages,
                petsAllowed: user.petsAllowed,
                drinking: user.drinking,
                cleanlinessLevel: user.cleanlinessLevel,
                sleepSchedule: user.sleepSchedule,
                noiseTolerance: user.noiseTolerance,
                foodHabits: user.foodHabits
            }  
        }); 
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        let userId = null;
        const { token } = req.cookies;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (error) {
            }
        }
        
        const { 
            name, 
            location, 
            institution, 
            gender, 
            smoker, 
            drinking, 
            petsAllowed, 
            foodHabits, 
            cleanlinessLevel, 
            sleepSchedule, 
            noiseTolerance, 
            visitors
        } = req.query;

        const allRooms = await roomModel.find({}, 'users');
        const usersWithRooms = allRooms.flatMap(room => room.users);

        let query = {
            _id: { $nin: usersWithRooms }
        };

        if (userId) {
            query._id.$ne = userId;
        }

        if (name) query.name = { $regex: name, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (institution) query.institution = { $regex: institution, $options: 'i' };

        if (gender) query.gender = gender;
        if (foodHabits) query.foodHabits = foodHabits;
        if (cleanlinessLevel) query.cleanlinessLevel = cleanlinessLevel;
        if (sleepSchedule) query.sleepSchedule = sleepSchedule;
        if (noiseTolerance) query.noiseTolerance = noiseTolerance;

        if (smoker) query.smoker = smoker === 'true';
        if (drinking) query.drinking = drinking === 'true';
        if (petsAllowed) query.petsAllowed = petsAllowed === 'true';
        if (visitors) query.visitors = visitors === 'true';

        const users = await userModel.find(query).select('-password -verifyOtp -resetOtp -email');
        
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params; 

        const user = await userModel.findById(id).select('-password -verifyOtp -resetOtp -email');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, userData: user });
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
            visitors,
            image,
            phone,
            status,
            nationality,
            languages,
            petsAllowed,
            drinking,
            cleanlinessLevel,
            sleepSchedule,
            noiseTolerance,
            foodHabits
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
            image,
            phone,
            status,
            nationality,
            languages,
            petsAllowed,
            drinking,
            cleanlinessLevel,
            sleepSchedule,
            noiseTolerance,
            foodHabits,
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
