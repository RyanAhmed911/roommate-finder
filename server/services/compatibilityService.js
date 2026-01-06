export const calculateCompatibility = (user, room) => {
    let score = 0;
    let total = 0;

    if (room.personalityType) {
        total++;
        if (user.personalityType === room.personalityType) score++;
    }

    if (room.foodHabits) {
        total++;
        if (
            user.foodHabits === room.foodHabits ||
            room.foodHabits === 'Flexible'
        ) score++;
    }

    if (room.sleepSchedule) {
        total++;
        if (
            user.sleepSchedule === room.sleepSchedule ||
            room.sleepSchedule === 'Flexible'
        ) score++;
    }

    if (room.cleanlinessLevel) {
        total++;
        if (user.cleanlinessLevel === room.cleanlinessLevel) score++;
    }

    if (room.noiseTolerance) {
        total++;
        if (user.noiseTolerance === room.noiseTolerance) score++;
    }

    ['smoker', 'drinking', 'visitors', 'petsAllowed'].forEach(field => {
        if (room[field] !== undefined) {
            total++;
            if (user[field] === room[field]) score++;
        }
    });

    if (room.hobbies?.length) {
        total++;
        if (user.hobbies?.some(h => room.hobbies.includes(h))) score++;
    }

    if (user.medicalConditions?.includes('Asthma') && room.smoker) {
        total++;
    }

    return total > 0 ? Math.round((score / total) * 100) : 0;
};

//Implemented by Nusayba