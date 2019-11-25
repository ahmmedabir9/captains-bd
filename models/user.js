var mongoose = require('mongoose');

//User Schema
var UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    mobile: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', UserSchema);