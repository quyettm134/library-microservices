const mongoose = require('mongoose');

mongoose.model('Book', {
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    numberOfPages: {
        type: Number,
        required: false
    },
    publisher: {
        type: String,
        required: false
    }
});