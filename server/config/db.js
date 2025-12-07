import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGO_URI;

let dbConnection;

export const connectDB = async (cb) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    dbConnection = client.db(); 
    console.log("Successfully connected to MongoDB Atlas!");
    return cb();
  } catch (err) {
    console.error("Connection error:", err);
    return cb(err);
  }
};

export const getDb = () => {
  if (!dbConnection) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbConnection;
};