const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true},
    password: { type: String, required: true },
    educationalId: String,
    role: String,
    profileImage: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileImage' }, // Reference to ProfileImage
    date: {type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
