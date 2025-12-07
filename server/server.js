import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/', (req, res) => {
    res.send('Roommate Finder Server is running successfully.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));