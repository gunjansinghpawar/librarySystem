const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BookImage = require('../models/BookImage');
const upload = require('../middleware/uploadMiddleware');

// Fetch all books
router.get('/fetchallbooks', async (req, res) => {
    try {
        const books = await Book.find({}).populate('bookImage');

        const booksWithImages = books.map(book => {
            let bookImage = null;

            if (book.bookImage && book.bookImage.data) {
                bookImage = `data:${book.bookImage.contentType};base64,${book.bookImage.data.toString('base64')}`;
            }

            return {
                ...book.toObject(),
                bookImage,
            };
        });

        res.json(booksWithImages);
    } catch (error) {
        console.error('Error fetching books with images:', error.message);
        res.status(500).send('Server Error');
    }
});

// Fetch a book by ID
router.get('/fetchbook/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('bookImage');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        let bookImage = null;

        if (book.bookImage && book.bookImage.data) {
            bookImage = `data:${book.bookImage.contentType};base64,${book.bookImage.data.toString('base64')}`;
        }

        const bookWithImage = {
            ...book.toObject(),
            bookImage,
        };

        res.json(bookWithImage);
    } catch (error) {
        console.error('Error fetching book by ID:', error.message);
        res.status(500).send('Server Error');
    }
});

// Add a book with an image
router.post('/addBookWithImage', upload.single('bookImage'), async (req, res) => {
    try {
        const { bookId, title, author, tag, dateofpublication, noofcopies, description } = req.body;

        let book = await Book.findOne({ _id: bookId });
        if (book) return res.status(400).json({ message: 'Book with that ID already exists' });

        book = new Book({ _id: bookId, title, author, tag, dateofpublication, noofcopies, description });

        if (req.file) {
            const bookImage = new BookImage({
                data: req.file.buffer,
                contentType: req.file.mimetype,
                bookId: book._id,
            });

            await bookImage.save();
            book.bookImage = bookImage._id;
        }

        await book.save();

        res.status(200).json({
            message: 'Book saved successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error adding book with image:', error.message);
        res.status(500).send('Server Error');
    }
});

// Update a book
router.put('/updatebook/:id', async (req, res) => {
    const { title, description, author, noofcopies } = req.body;

    try {
        const newBook = {};
        if (title) newBook.title = title;
        if (description) newBook.description = description;
        if (author) newBook.author = author;
        if (noofcopies) newBook.noofcopies = noofcopies;

        let book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        book = await Book.findByIdAndUpdate(req.params.id, { $set: newBook }, { new: true });
        res.json(book);
    } catch (error) {
        console.error('Error updating book:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a book
router.delete('/deletebook/:id', async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send("Book not found");
        }

        await Book.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Book successfully deleted", Book: book });
    } catch (error) {
        console.error('Error deleting book:', error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
