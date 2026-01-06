import mongoose from "mongoose";


const favoriteRoommatesSchema = new mongoose.Schema({
    roommates: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] },
    posts: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' }, 
    favoritesID: { type: String, required: true, unique: true }
});

const favoriteRoommatesModel =
    mongoose.models.favoriteRoommates ||
    mongoose.model('favoriteRoommates', favoriteRoommatesSchema);

export default favoriteRoommatesModel;
