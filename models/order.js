var mongoose = require('mongoose');

//Product Schema
var OrderSchema = mongoose.Schema({

    customer_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    shipping_cost: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    cart: {
        type: Object,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    user: {
        type: Object
    }
})

var Order = module.exports = mongoose.model('Order', OrderSchema);