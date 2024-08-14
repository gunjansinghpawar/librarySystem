const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// CORS Middleware
app.use(cors());
app.use(express.json());

app.use('/api/bookRoutes', require('./routes/bookRoutes'));
app.use('/api/userRoutes', require('./routes/userRoutes'));
app.use('/api/authRoutes', require('./routes/authRoutes'));
app.use('/api/adminRoutes', require('./routes/adminRoutes'));
app.use('/api/rentedRoutes', require('./routes/rentedRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
