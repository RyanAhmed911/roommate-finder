import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import  connectDB  from './config/db.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.listen(port, ()=> console.log(`Server Started on PORT:${port}`));

app.get('/', (req, res) => {
    res.send('Roommate Finder Server is running successfully.');
 });