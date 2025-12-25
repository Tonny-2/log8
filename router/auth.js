import express from 'express';
import dotenv from 'dotenv';
import User from './module/User.js';


dotenv.config();
const router = express.Router();


router.post('/SignUp', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/Login', async (req, res) => {

    console.log(req.body);
    res.json({ message: "Login attempt received" });
});

router.post('/ForgotPassword', (req, res) => {
    console.log("Forgot password for:", req.body.email);
    res.json({ message: "If that email exists, a reset link has been sent." });
});

router.post('/ResetPassword', (req, res) => {
    const { token, password } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {

        console.log("Resetting password with token:", token);
        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        return res.status(400).json({ message: 'Token is invalid or expired' });
    }
});

export default router;