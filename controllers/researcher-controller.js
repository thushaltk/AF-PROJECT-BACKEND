const HttpError = require("../models/http-error");

const stripe = require("stripe")("sk_test_51IpE6NGvyYYsIP6DHiFSSQg3bB7Fd44AGHItxN7QgIxT4Jmzk6JNw4dRJIGgr6B3Sp6a17ktp2Mb5uewbIBLke7n00B4DXFwNV");
const { v4: uuidv4 } = require('uuid');


const stripePayment = (req, res, next) => {
    console.log(req.body.token);
    const {token, amount} = req.body;
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token
    }).then(customer=>{
        stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, {idempotencyKey})
    }).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        throw new HttpError("Payment Unsuccessful..", 404);
    });
}

exports.stripePayment = stripePayment;