import mongoose from "mongoose";
// Neshat: From class diagram
const compatibilityScoreSchema = new mongoose.Schema({
    scoreID: { type: String, required: true },
    score: { type: Number, required: true }
});
// Neshat: From class diagram
const compatibilityScoreModel = mongoose.models.compatibilityScore || mongoose.model('compatibilityScore', compatibilityScoreSchema);
export default compatibilityScoreModel;