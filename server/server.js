import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import  connectDB  from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import favoritesRouter from './routes/favoritesRoutes.js';
import expenseRouter from './routes/expenseRoutes.js';
import requestRouter from './routes/requestRoutes.js';
import compatibilityRouter from './routes/compatibilityRoutes.js';
import favoriteRoommatesRouter from './routes/favoriteRoommatesRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/room', roomRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/compatibility', compatibilityRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/request', requestRouter);
app.use('/api/favorite-roommates', favoriteRoommatesRouter);
app.listen(port, () => console.log(`Server running on port ${port}`));