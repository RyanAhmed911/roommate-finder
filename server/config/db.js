import mongoose from "mongoose";

const connectDB= async ()=>{

  mongoose.connection.on('connected', ()=>console.log("Successfully connected to Database uwu"));

  await mongoose.connect(`${process.env.MONGODB_URI}/roommate-finder`);
};

export default connectDB;