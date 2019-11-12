var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


//Product Models
var Product = require('../models/product');

//Category Models
var Category = require('../models/category');


//Add Product to Cart

router.get('/add/:product', function (req, res) {

    var slug = req.params.product;

    Product.findOne({ slug: slug }, function (err, p) {
        if (err) console.log(err);

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/productImages/' + p._id + '/' + p.image
            });
        }
        else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/productImages/' + p._id + '/' + p.image
                });
            }
        }

        req.flash('success', 'Product Added to Cart');
        res.redirect('back');

    });
});


//Get Checkout Page

router.get('/checkout', function (req, res) {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');

    }
    else {
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }


});

//Get Update Product

router.get('/update/:product', function (req, res) {

    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;

                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1) cart.splice(i, 1);
                    break;

                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;

                default:
                    console.log('Update Problem');

                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart Updated');
    res.redirect('/cart/checkout');

});



//Get Clear Cart

router.get('/clear', function (req, res) {

    delete req.session.cart;


    req.flash('success', 'Cart Cleared!');
    res.redirect('/cart/checkout');

});



//exports

module.exports = router;