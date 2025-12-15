import mongoose from "mongoose";

// Prachurzo: From class diagram

const favoritesSchema = new mongoose.Schema({
    posts: { type: [mongoose.Schema.Types.ObjectId], ref: 'post', default: [] },
    favoritesID: { type: String, required: true, unique: true }
});

const favoritesModel = mongoose.models.favorites || mongoose.model('favorites', favoritesSchema);

export default favoritesModel;

