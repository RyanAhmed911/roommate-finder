import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true   
    },

    smoker: Boolean,
    personalityType: String,
    age: Number,
    medicalConditions: { type: [String], default: [] },
    institution: { type: [String], default: [] },
    gender: String,
    visitors: Boolean,
    hobbies: { type: [String], default: [] },

    
    foodHabits: String,
    sleepSchedule: String,
    cleanlinessLevel: String,
    noiseTolerance: String,
    petsAllowed: Boolean,
    drinking: Boolean
});

const preferencesModel =
    mongoose.models.preferences || mongoose.model('preferences', preferencesSchema);

export default preferencesModel;

//Fully updated by Nusayba