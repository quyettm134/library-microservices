const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

require('./Customer');
const Customer = mongoose.model('Customer');

const CONNECTION_URL = 'mongodb+srv://quyettm134:13042001Q@customerservice.vr4e3gs.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URL, () => {
    console.log('Connected to Customers Service!');
});

app.get('/', (req, res) => {
    res.send('This is customers service');
});

app.get('/customers', (req, res) => {
    Customer.find()
        .then((customers) => {
            res.json(customers);
        })
        .catch((err) => {
            console.log('Error finding customers - ' + err.message);
        })
});

app.get('/customers/:id', (req, res) => {
    const customerID = req.params.id;

    Customer.findById(customerID)
        .then(customer => {
            if (customer) {
                res.json(customer);
            }
            else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            console.log('Error finding customer! - ' + err.message);
        })
});


app.post('/customers', (req, res) => {
    const customer = req.body;

    const newCustomer = new Customer(customer);

    newCustomer.save()
        .then(() => {
            console.log('New customer created!');
        })
        .catch((err) => {
            console.log('Error creating customer! - ' + err.message);
        })

    res.send('Customer created!');
});

app.delete('/customers/:id', (req, res) => {
    var customerID = req.params.id;

    Customer.findByIdAndDelete(customerID)
        .then(() => {
            console.log('customer deleted!');
        })
        .catch(err => {
            console.log('Error deleting customer! - ' + err.message);
        })

    res.send('Customer deleted!')
});

app.listen(8081, () => {
    console.log('Customers service listening on http://localhost:8081');
});