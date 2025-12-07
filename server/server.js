import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/', (req, res) => {
    res.send('Roommate Finder Server is running successfully.');
});

connectDB((err) => {
    if (!err) {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } else {
        console.log('Failed to connect to MongoDB Atlas');
    }
});