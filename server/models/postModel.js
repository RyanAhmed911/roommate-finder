import mongoose from "mongoose";

// Prachurzo: From class diagram

const postSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },
    postID: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    status: { type: Boolean, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

const postModel = mongoose.models.post || mongoose.model('post', postSchema);

export default postModel;

