var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


//Product Models
var Product = require('../models/product');

//Order Models
var Order = require('../models/order');



//Get Order Index

router.get('/', function (req, res) {

    res.render('order_details', {
        title: "Order Details"
    });

});

// Get Order Details
router.get('/order/:id', function (req, res) {

    Order.find(req.query.id, function (err, order) {

        console.log(order);
        if (err) {
            console.log(err);
            res.redirect('/orders');

        }
        else {
            
            

            res.render('order_details', {
                errors: errors,
                order: order
            });
        }
    });

});



//exports

module.exports = router;