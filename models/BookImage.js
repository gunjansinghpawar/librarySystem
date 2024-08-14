const mongoose = require('mongoose');

const bookImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  }
});

const BookImage = mongoose.model('BookImage', bookImageSchema);

module.exports = BookImage;
