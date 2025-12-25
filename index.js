import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router/auth.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();


connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', router);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});