var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

//Product Models
var Product = require('../models/product');

//Category Models
var Category = require('../models/category');


//Order Models
var Order = require('../models/order');


// Get Page index

router.get('/', function (req, res) {

    var waiting = 0;
    var cancelled = 0;
    var completed = 0;
    var total_products = 0;

    Order.count({ status: "0" }, function (err, c) {
        waiting = c;
    });

    Order.count({ status: "1" }, function (err, c) {
        cancelled = c;
    });

    Order.count({ status: "3" }, function (err, c) {
        completed = c;
    });

    Product.count(function (err, c) {
        total_products = c;
    });


    Order.find(function (err, orders) {
        res.render('admin/dashboard', {
            orders: orders,
            waiting: waiting,
            cancelled: cancelled,
            completed: completed,
            total_products: total_products
        });
    }).sort({ _id: -1 });
});



//exports

module.exports = router;