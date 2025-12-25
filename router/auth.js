import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import user from "../Module/User.js";


dotenv.config();

const router = express.Router();


router.post('/SignUp', async (req, res) => {
    try {
        const { firstName, middleName, lastName, Email, confirmEmail, dateOfBirth, phoneNumber, address, zipCode, gender, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (Email !== confirmEmail) {
            return res.status(400).json({ message: "Emails do not match" });
        }

        const newUser = new user({
            firstName, middleName, lastName, Email, confirmEmail,
            dateOfBirth, phoneNumber, address, zipCode, gender,
            password, confirmPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/Login', async (req, res) => {
    try {
        const { Email, password } = req.body;
        const foundUser = await user.findOne({ Email });

        if (!foundUser || !(await foundUser.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: foundUser._id }, process.env.JWT, { expiresIn: '1h' });
        res.json({ token, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }

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