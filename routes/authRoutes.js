const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const fetchUser = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'librarymanagementsystem';

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

router.post('/loginUser', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const authToken = generateToken(user);
        res.status(200).json({ success: true, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/fetchUserDetails', fetchUser, async (req, res) => {
    try {
        // Fetch the user from the database using the ID from the JWT token
        const user = await User.findById(req.user.id).populate('profileImage');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare the user data to send in the response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            educationalId: user.educationalId,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage ? {
                data: user.profileImage.data.toString('base64'), // Convert binary data to base64
                contentType: user.profileImage.contentType
            } : null
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports = router;
