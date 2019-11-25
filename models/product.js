var mongoose = require('mongoose');

//Product Schema
var ProductSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    featured: {
        type: Number
    },
    size: {
        type: Array
    }
})

var Product = module.exports = mongoose.model('Product', ProductSchema);