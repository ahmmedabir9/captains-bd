var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


//Product Models
var Product = require('../models/product');

//Category Models
var Category = require('../models/category');


//Get All Products

router.get('/', function (req, res) {

    Product.find(function (err, products) {
        if (err) console.log(err);

        res.render('products', {
            title: "Captain's Products",
            products: products,
            category: null
        });
    }).sort({ _id: -1 });
});


//Get Products by Categories

router.get('/:category', function (req, res) {


    var categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug }, function (err, c) {

        Product.find({ category: categorySlug }, function (err, products) {
            if (err) console.log(err);

            res.render('products', {
                title: c.title + "Captain's Products",
                products: products,
                category: categorySlug
            });
        }).sort({ _id: -1 });
    });
});



//Get Products Details

router.get('/:category/:product', function (req, res) {

    var galleryImages = null;
    var suggestion;
    var categorySlug = req.params.category;
    var productSlug = req.params.product;


    Product.find({ category: categorySlug, slug: { '$ne': productSlug } }, function (err, s) {
        if (err) console.log(err);

        suggestion = s;


    }).sort({ _id: -1 }).limit(4);


    Product.findOne({ slug: req.params.product }, function (err, product) {
        if (err) console.log(err);

        else {
            var galleryDir = 'public/productImages/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) console.log(err);

                else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        suggestion: suggestion
                    });
                }

            });
        }

    });

});





//exports

module.exports = router;