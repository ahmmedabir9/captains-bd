var express = require('express');
var router = express.Router();

var fs = require('fs-extra');


//Product Models
var Product = require('../models/product');

//Category Models
var Category = require('../models/category');


var latest;
Product.find(function (err, n) {
    if (err) console.log(err);

    latest = n;


}).sort({ _id: -1 }).limit(12);

router.get('/', function (req, res) {


    Product.find(function (err, products) {
        if (err) console.log(err);

        res.render('index', {
            title: "Captain\'s Shop BD | Home",
            products: products,
            latest: latest

        });
    }).sort({ _id: -1 });
});



//exports

module.exports = router;