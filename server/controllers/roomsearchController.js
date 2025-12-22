import roomModel from '../models/roomModel.js';
import userModel from '../models/userModel.js';

export const searchRooms = async (req, res) => {
    try {
        const { location, maximumRent, preferences } = req.query;
        const userId = req.userId;

        let filter = { status: true };

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (maximumRent) {
            filter.rent = { $lte: Number(maximumRent) };
        }

        let rooms = await roomModel.find(filter).populate('users', 'name email gender age smoker hobbies personalityType');

        if (preferences) {
            const prefArray = preferences.split(',');
            const user = await userModel.findById(userId).select('hobbies smoker personalityType gender');

            rooms = rooms.filter(room => {
                let matchScore = 0;

                room.users.forEach(roommate => {
                    if (prefArray.includes('hobbies')) {
                        const commonHobbies = user.hobbies.filter(hobby => 
                            roommate.hobbies.includes(hobby)
                        );
                        if (commonHobbies.length > 0) matchScore += 2;
                    }

                    if (prefArray.includes('smoker')) {
                        if (user.smoker === roommate.smoker) matchScore += 3;
                    }

                    if (prefArray.includes('personality')) {
                        if (user.personalityType === roommate.personalityType) matchScore += 2;
                    }

                    if (prefArray.includes('gender')) {
                        if (user.gender === roommate.gender) matchScore += 1;
                    }
                });

                return matchScore > 0;
            });

            rooms.sort((a, b) => {
                let scoreA = 0, scoreB = 0;

                a.users.forEach(roommate => {
                    const commonHobbiesA = user.hobbies.filter(hobby => 
                        roommate.hobbies.includes(hobby)
                    );
                    scoreA += commonHobbiesA.length;
                });

                b.users.forEach(roommate => {
                    const commonHobbiesB = user.hobbies.filter(hobby => 
                        roommate.hobbies.includes(hobby)
                    );
                    scoreB += commonHobbiesB.length;
                });

                return scoreB - scoreA;
            });
        }

        res.json({ 
            success: true, 
            rooms,
            count: rooms.length 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

