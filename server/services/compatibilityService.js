//Implemented by Nusayba

export const calculateCompatibility = (userProfile, preferences) => {
    let score = 0;
    let maxScore = 0;

    // Smoking
    maxScore += 20;
    if (preferences.smoker === userProfile.smoker) {
        score += 20;
    }

    // Visitors
    maxScore += 10;
    if (preferences.visitors === userProfile.visitors) {
        score += 10;
    }

    // Personality
    maxScore += 15;
    if (
        preferences.personalityType &&
        userProfile.personalityType &&
        preferences.personalityType === userProfile.personalityType
    ) {
        score += 15;
    }

    // Hobbies overlap
    maxScore += 15;
    if (preferences.hobbies?.length && userProfile.hobbies?.length) {
        const common = preferences.hobbies.filter(h =>
            userProfile.hobbies.includes(h)
        );
        score += Math.min(15, common.length * 5);
    }

    //Medical conditions mismatch
    maxScore += 10;
    if (preferences.medicalConditions?.length && userProfile.medicalConditions?.length) {
        const conflict = preferences.medicalConditions.some(c =>
            userProfile.medicalConditions.includes(c)
        );
        if (!conflict) score += 10;
    }

    // Normalize to percentage
    return Math.round((score / maxScore) * 100);
};
