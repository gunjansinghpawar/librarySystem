const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Fixed import syntax
const fetchUser = require('../middleware/authMiddleware');
// Get all users
router.get('/users', async (req, res) => {  // Corrected route definition
   try {
       const users = await User.find();  // Fetch all users from the database
       
       if (!users || users.length === 0) {  // Check if no users are found
           return res.status(404).json({ message: 'No users found' });
       }
       
       res.json(users);  // Send the user data as a JSON response
   } catch (error) {
       console.error('Error fetching users:', error.message);  // Log the error for debugging
       res.status(500).json({ message: 'Internal Server Error' });  // Send a 500 error response if something goes wrong
   }
});
router.get('/profileimages', fetchUser, async (req, res) => {
    try {
        const { name } = req.query;

        // Fetch all users from the database
        let users;
        if (name) {
            // If name is provided, filter users by name (case-insensitive)
            const regex = new RegExp(name, 'i'); // 'i' makes it case-insensitive
            users = await User.find({ name: regex }).select('name profileImage');
        } else {
            // Otherwise, fetch all users
            users = await User.find().select('name profileImage');
        }

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users or images were found' });
        }

        // Prepare the profile images data to send in the response
        const imagesData = users.map(user => ({
            name: user.name,
            profileImage: user.profileImage ? {
                data: user.profileImage.data.toString('base64'), // Convert binary data to base64
                contentType: user.profileImage.contentType
            } : null
        }));

        res.status(200).json(imagesData);
    } catch (error) {
        console.error('Error fetching profile images:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
