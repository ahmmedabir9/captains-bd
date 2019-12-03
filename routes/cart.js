var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


//Product Models
var Product = require('../models/product');

//Order Models
var Order = require('../models/order');


//Add Product to Cart

router.get('/add/:product', function (req, res) {

    var slug = req.params.product;
    var size = req.body.size;



    Product.findOne({ slug: slug }, function (err, p) {
        if (err) console.log(err);

        if (p.discount_price && p.discount_price != "0") {
            var c_price = p.discount_price
        }
        else {
            var c_price = p.price
        }

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(c_price).toFixed(2),
                size: size,
                image: '/productImages/' + p._id + '/' + p.image
            });
        }
        else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug && cart[i].size == size) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    size: size,
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

    var shipping_cost = 100;
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');

    }
    else {
        res.render('checkout', {
            title: 'Checkout',
            shipping_cost: shipping_cost,
            cart: req.session.cart,
            user: res.locals.user
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


var c_name;
var c_email;
var c_mobile;
var c_address;
var c_amount;
var c_shipping;
var o_date;
var c_note;
var c_pay;
var o_id;
var item;

// Post Checkout Page

router.post('/checkout', function (req, res) {

    req.checkBody('name', 'Title must Have a value.').notEmpty();
    req.checkBody('address', 'Description must Have a value.').notEmpty();
    req.checkBody('mobile', 'Description must Have a value.').notEmpty();

    var customer_name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var cart = req.session.cart;
    var address = req.body.address;
    var amount = req.body.amount;
    var district = req.body.district;
    var shipping_cost;
    var payment_method = req.body.payment_method;
    var note = req.body.note;
    var user = null;
    
    o_id = null;

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (req.body.user) user = req.body.user;

    if (district == "dhaka") shipping_cost = 50;
    else shipping_cost = 100;



    c_name = customer_name;
    c_email = email;
    c_mobile = mobile;
    c_address = address;
    c_amount = amount;
    c_shipping = shipping_cost;
    o_date = date;
    c_note = note;
    c_pay = payment_method;
    item = req.session.cart;

    console.log(amount);


    var errors = req.validationErrors();

    if (errors) {
        res.render('/cart/checkout', {
            errors: errors,
            name: customer_name,
            email: email,
            cart: cart,
            mobile: mobile,
            address: address,
            amount: amount,
            district: district,
            payment_method: payment_method,
            shipping_cost: shipping_cost,
            note: note,
        });
    }
    else {

        var amount2 = parseFloat(amount).toFixed(2);

        var order = new Order({
            customer_name: customer_name,
            email: email,
            mobile: mobile,
            address: address,
            amount: amount2,
            district: district,
            shipping_cost: shipping_cost,
            payment_method: payment_method,
            note: note,
            cart: cart,
            user: user,
            date: date,
            status: 0
        });

        order.save(function (err) {
            if (err) return console.log(err);


            o_id = order._id;

            req.flash('success', 'Order Placed!');
            res.redirect('/cart/order-details');

        });
    }
});




//Get Order Confirmation Page


router.get('/order-details', function (req, res) {



    var am = parseInt(c_amount);
    var sh = parseInt(c_shipping);
    var bill = parseFloat(am + sh).toFixed(2);


    delete req.session.cart;


    if (o_id) {
        res.render('order_details', {

            title: 'Order Confirmation',
            id: o_id,
            cart: item,
            name: c_name,
            email: c_email,
            mobile: c_mobile,
            address: c_address,
            amount: c_amount,
            shipping_cost: c_shipping,
            bill: bill,
            date: o_date,
            note: c_note,
            payment: c_pay
        });
    }

    else {
        res.redirect('/');
    }



});



//exports

module.exports = router;