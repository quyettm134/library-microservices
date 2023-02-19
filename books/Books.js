const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

require('./Book');
const Book = mongoose.model('Book');

const CONNECTION_URL = 'mongodb+srv://quyettm134:13042001Q@bookservice.1urnpnf.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URL, () => {
    console.log('Connected to Books Service!');
});

app.get('/', (req, res) => {
    res.send('This is books service');
});

app.get('/books', (req, res) => {
    Book.find()
        .then(books => {
            res.json(books);
        })
        .catch(err => {
            console.log('Error finding books! - ' + err.message);
        })
});

app.get('/books/:id', (req, res) => {
    const bookID = req.params.id;

    Book.findById(bookID)
        .then(book => {
            if (book) {
                res.json(book);
            }
            else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            console.log('Error finding book! - ' + err.message);
        })
});

app.post('/books', (req, res) => {
    const book = req.body;

    const newBook = new Book(book);

    newBook.save()
        .then(() => {
            console.log('New book created!');
        })
        .catch(err => {
            console.log('Error creating book! - ' + err.message);
        })

    res.send('Book created!');
});

app.delete('/books/:id', (req, res) => {
    var bookID = req.params.id;

    Book.findByIdAndDelete(bookID)
        .then(() => {
            console.log('Book deleted!');
        })
        .catch(err => {
            console.log('Error deleting book! - ' + err.message);
        })

    res.send('Book deleted!')
});

app.listen(8080, () => {
    console.log('Books service listening on http://localhost:8080');
});