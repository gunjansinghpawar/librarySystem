const mongoose = require('mongoose');

const rentedUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enrollmentno: { type: String, required: true }
});

module.exports = mongoose.model('RentedUser', rentedUserSchema);
