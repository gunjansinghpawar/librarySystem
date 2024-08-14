const express = require('express');
const router = express.Router();
const Rented = require('../models/Rented');
const Book = require('../models/Book');
const RentedUser = require('../models/RentedUser');

// Fetch all rented books
// Rent a book
router.post('/rent', async (req, res) => {
    const { bookId, name, enrollmentno } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const rentedUser = new RentedUser({ name, enrollmentno });
        await rentedUser.save();

        const rented = new Rented({
            bookId: book._id,
            rentedUserId: rentedUser._id,
            rentedDate: new Date(),
        });
        await rented.save();
        res.status(201).json(rented);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/rentedbooks', async (req, res) => {
    try {
        const rentedBooks = await Rented.find()
            .populate('bookId') // Populate bookId field
            .populate('rentedUserId') // Populate;
        console.log('Fetched rented books:', rentedBooks); // Log the output
        res.json(rentedBooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Return a book
router.delete('/return/:id', async (req, res) => {
    try {
        const result = await Rented.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Rented book not found' });

        res.json({ message: 'Book returned successfully', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
