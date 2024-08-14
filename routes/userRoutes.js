const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ProfileImage = require('../models/ProfileImage');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploadMiddleware');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'librarymanagementsystem';

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

router.post('/createUserWithProfile', upload.single('profileImage'), async (req, res) => {
    const { name, email, password, educationalId, role, phoneNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(15);
        const hashpassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashpassword, educationalId, role, phoneNumber });

        // Save the user to get the userId
        await user.save();

        // Handle profile image upload if provided
        if (req.file) {
            const profileImage = new ProfileImage({
                data: req.file.buffer,
                contentType: req.file.mimetype,
                userId: user._id
            });

            await profileImage.save();

            // Link the profile image with the user
            user.profileImage = profileImage._id;
            await user.save();
        }

        // Generate JWT token
        const authToken = generateToken(user);

        // Send the response
        res.status(201).json({ 
            message: 'User created successfully', 
            success: true, 
            authToken 
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
