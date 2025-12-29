import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //Ryan: For User Authentication
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    verifyOtp : {type: String, default: ''},
    verifyOtpExpireAt : {type: Number, default: 0},
    isAccountVerified : {type: Boolean, default: false},
    resetOtp : {type: String, default: ''},
    resetOtpExpireAt: {type:Number, default: 0},
    //Ryan: For User Authentication
    //Nusayba: From Class Diagram 
    hobbies: { type: [String], default: [] },
    age: { type: Number },
    location: { type: String },
    smoker: { type: Boolean },
    personalityType: { type: String },
    medicalConditions: { type: [String], default: [] },
    institution: {type: String, default: '' },
    gender: { type: String},
    visitors: { type: Boolean },
    //Nusayba: From Class Diagram 
    isProfileCompleted : {type: Boolean, default: false}, //Ryan: To check if user has completed profile after signup
    image: { type: String, default: '' }, //Ryan: To store profile image 
    //Ryan: Added some more attributes for better matching
    phone: { type: String, default: '' },
    status: { type: String, default: '' }, 
    nationality: { type: String, default: '' },
    languages: { type: [String], default: [] },
    petsAllowed: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    cleanlinessLevel: { type: String, default: '' }, 
    sleepSchedule: { type: String, default: '' }, 
    noiseTolerance: { type: String, default: '' }, 
    foodHabits: { type: String, default: '' },
    //Ryan: Added some more attributes for better matching
})

const userModel= mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;