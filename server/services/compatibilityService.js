export const calculateCompatibility = (user, room) => {
    let score = 0;
    let total = 0;

    // Personality
    if (room.personalityType) {
        total++;
        if (user.personalityType === room.personalityType) score++;
    }

    // Food habits
    if (room.foodHabits) {
        total++;
        if (
            user.foodHabits === room.foodHabits ||
            room.foodHabits === 'Flexible'
        ) score++;
    }

    // Sleep schedule
    if (room.sleepSchedule) {
        total++;
        if (
            user.sleepSchedule === room.sleepSchedule ||
            room.sleepSchedule === 'Flexible'
        ) score++;
    }

    // Cleanliness
    if (room.cleanlinessLevel) {
        total++;
        if (user.cleanlinessLevel === room.cleanlinessLevel) score++;
    }

    // Noise tolerance
    if (room.noiseTolerance) {
        total++;
        if (user.noiseTolerance === room.noiseTolerance) score++;
    }

    // Other preferences
    ['smoker', 'drinking', 'visitors', 'petsAllowed'].forEach(field => {
        if (room[field] !== undefined) {
            total++;
            if (user[field] === room[field]) score++;
        }
    });

    // Hobbies
    if (room.hobbies?.length) {
        total++;
        if (user.hobbies?.some(h => room.hobbies.includes(h))) score++;
    }

    // Medical conflicts
    if (user.medicalConditions?.includes('Asthma') && room.smoker) {
        total++;
    }

    return total > 0 ? Math.round((score / total) * 100) : 0;
};

//Implemented by Nusayba