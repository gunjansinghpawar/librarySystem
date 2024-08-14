const mongoose = require('mongoose');

const rentedSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    rentedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'RentedUser', required: true },
    rentedDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, default: 'rented' }, // e.g., 'rented', 'returned'
    totalRentedBooks: { type: Number, default: 0 } // Track the total number of rented books
});

// Middleware to update `totalRentedBooks` when a new document is added
rentedSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Logic to update the count, e.g., if tracking total across multiple documents
        // This is an example and might need adjustment based on your use case
        const Rented = mongoose.model('Rented');
        const rentedCount = await Rented.countDocuments({ bookId: this.bookId });
        this.totalRentedBooks = rentedCount;
    }
    next();
});

module.exports = mongoose.model('Rented', rentedSchema);
