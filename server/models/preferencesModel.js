import mongoose from "mongoose";


// Prachurzo: From class diagram
const preferencesSchema = new mongoose.Schema({
    smoker: { type: Boolean },
    personalityType: { type: String },
    age: { type: Number },
    medicalConditions: { type: [String], default: [] },
    institution: { type: [String], default: [] },
    gender: { type: String },
    visitors: { type: Boolean },
    hobbies: { type: [String], default: [] }
});

const preferencesModel = mongoose.models.preferences || mongoose.model('preferences', preferencesSchema);

// Prachurzo: From class diagram
export default preferencesModel;