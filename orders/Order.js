const mongoose = require('mongoose');

mongoose.model('Order', {
    CustomerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    BookID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    BorrowDate: {
        type: Date,
        required: true
    },
    DueDate: {
        type: Date,
        required: true
    }
})