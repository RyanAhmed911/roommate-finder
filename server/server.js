import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import  connectDB  from './config/db.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Roommate Finder Server is running successfully.');
 });