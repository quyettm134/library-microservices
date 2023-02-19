const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

require('./Order');
const Order = mongoose.model('Order');

const CONNECTION_URL = 'mongodb+srv://quyettm134:13042001Q@orderservice.c5nzefl.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URL, () => {
    console.log('Connected to Order Service!');
});

app.get('/orders', (req, res) => {
    Order.find()
        .then((orders) => {
            res.json(orders);
        })
        .catch((err) => {
            console.log('Error finding orders! - ' + err.message);
        })
});

app.get('/orders/:id', (req, res) => {
    const orderID = req.params.id;

    Order.findById(orderID)
        .then((order) => {
            if (order) {
                axios.get(`http://localhost:8081/customers/${order.CustomerID}`)
                    .then((response) => {
                        var orderObject = {
                            customerName: response.data.name,
                            borrowDate: order.BorrowDate,
                            dueDate: order.DueDate
                        }
                        axios.get(`http://localhost:8080/books/${order.BookID}`)
                            .then((response) => {
                                orderObject = {
                                    ...orderObject,
                                    bookTitle: response.data.title
                                }
                                res.json(orderObject);
                            })
                    })
            }
            else {
                res.sendStatus(404);
            }
        })
});

app.post('/orders', (req, res) => {
    const order = {
        ...req.body,
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID)
    };

    const newOrder = new Order(order);

    newOrder.save()
        .then(() => {
            console.log('New order created!');
        })
        .catch(err => {
            console.log('Error creating order! - ' + err.message);
        })
    
    res.send('Order created!');
});

app.listen(8082, () => {
    console.log('Orders service listening on http://localhost:8082');
});