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

router.post('/ForgotPassword', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `Click the link to reset your password: http://localhost:5173/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({message: "Error sending email"});
            }
            res.status(200).json({message: "Reset link sent to your email"});
        });
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

router.post('/ResetPassword', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const foundUser = await User.findById(decoded.id);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const salt = await bcrypt.genSalt(10);
        foundUser.password = await bcrypt.hash(password, salt);


        if (foundUser.confirmPassword) {
            foundUser.confirmPassword = foundUser.password;
        }

        await foundUser.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error("Reset error:", error);
        return res.status(400).json({ message: 'Token is invalid or expired' });
    }
});


export default router;