var express = require('express');
var router = express.Router();

var fs = require('fs-extra');


//Product Models
var Product = require('../models/product');

//Category Models
var Category = require('../models/category');


router.get('/', function (req, res) {
    Product.find(function (err, products) {
        if (err) console.log(err);

        res.render('index', {
            title: "Captain\'s Shop BD | Home",
            products: products
        });
    }).sort( { _id: -1 } );
});


//Get Featured Products

// router.get('/', function (req, res) {

//     Product.find({featured: 1 }, function (err, products) {
//         if (err) console.log(err);

//         res.render('index', {
//             title: "Captain\'s Shop BD | Home",
//             products: products
//         });
//     });
// });





//exports

module.exports = router;