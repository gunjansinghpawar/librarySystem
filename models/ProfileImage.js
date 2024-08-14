const mongoose = require('mongoose');

const profileImageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model('ProfileImage', profileImageSchema);
