// server/server.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// connect to database
connectDB();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:4000', 'http://localhost:4001'],
    credentials: true,
  })
);


// test route
app.get('/', (req, res) => res.send('API is running...'));

// routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// start server
app.listen(port, () => console.log(`Server running on port ${port}`));
