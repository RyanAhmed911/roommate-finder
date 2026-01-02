import mongoose from "mongoose";

// Prachurzo: From class diagram
const favoritesSchema = new mongoose.Schema({
    // NOTE: Despite the field name "posts", this collection is used to store the
    // logged-in user's favourite *rooms* in this project.
    posts: { type: [mongoose.Schema.Types.ObjectId], ref: 'room', default: [] },
    favoritesID: { type: String, required: true, unique: true }
});

const favoritesModel = mongoose.models.favorites || mongoose.model('favorites', favoritesSchema);

export default favoritesModel;
