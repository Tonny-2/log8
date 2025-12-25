import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router/auth.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();


connectDB(
    async () => {

        console.log('DB Connected');
    },
);

app.use(cors());
app.use(express.json());

app.use('/auth', router);

app.get('/', (req, res) => {
    res.send('Backend is running');
})

const PORT = process.env.PORT || 1947;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});