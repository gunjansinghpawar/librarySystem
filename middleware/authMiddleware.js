const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'librarymanagementsystem';

const fetchUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id }; // Attach the user ID to the request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token!' });
    }
};

module.exports = fetchUser;
