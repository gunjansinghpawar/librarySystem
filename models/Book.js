const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tag: String,
    dateofpublication: Date,
    noofcopies: Number,
    description: String,
    bookImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookImage'
    }
});

module.exports = mongoose.model('Book', BookSchema);
