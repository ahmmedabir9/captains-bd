var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;


//Product Models
var Product = require('../models/product');

//Category Models
var Category = require('../models/category');


//Order Models
var Order = require('../models/order');



// Get Order index

router.get('/', isAdmin, function (req, res) {

    Order.find(function (err, orders) {
        res.render('admin/orders', {
            orders: orders,
        });
    }).sort( { _id: -1 } );
});






// Get Order Details



router.get('/order-details/:id', isAdmin, function (req, res) {

    var errors;

    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    Order.findById(req.params.id, function (err, o) {
        if (err) {
            console.log(err);
            res.redirect('/admin/orders');

        }
        else {

            res.render('admin/order_details', {

                errors: errors,
                name: o.customer_name,
                amount: o.amount,
                shipping_cost: o.shipping_cost,
                cart: o.cart,
                status: o.status,
                email: o.email,
                mobile: o.mobile,
                payment_method: o.payment_method,
                address: o.address,
                district: o.district,
                note: o.note,
                username: o.user,
                id: o._id
            });
        }
    });

});





// Post Order Details



router.post('/order-details/:id', function (req, res) {

    var status = req.body.status;
    var id = req.params.id;


    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/orders/order-details/' + id);
    }

    else {

        Order.findById(id, function (err, o) {
            if (err) console.log(err);


            o.status = status;

            o.save(function (err) {
                if (err) console.log(err);

                req.flash('success', 'Order Status Updated!');
                res.redirect('/admin/orders/order-details/' + id);


            })

        })
    }

});


// Post Product Gallery

router.post('/product-gallery/:id', function (req, res) {

    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/productImages/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/productImages/' + id + '/gallery/thumbs/' + req.files.file.name;

    productImage.mv(path, function (err) {
        if (err) console.log(err);

        resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);

});


// Get Delete Product

router.get('/delete-product/:id', isAdmin, function (req, res) {
    var id = req.params.id;
    var path = 'public/productImages/' + id;

    fs.remove(path, function (err) {
        if (err) console.log(err);

        else {
            Product.findByIdAndRemove(id, function (err) {
                console.log(err);

            });

            req.flash('success', 'Product Deleted!');
            res.redirect('/admin/products');
        }

    });
});

// Get Delete Image

router.get('/delete-image/:image', isAdmin, function (req, res) {
    var originalImage = 'public/productImages/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/productImages/' + req.query.id + '/gallery/thumbs' + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            fs.remove(thumbImage, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    req.flash('success', 'Image Deleted!');
                    res.redirect('/admin/products/edit-product/' + req.query.id);
                }
            })
        }

    })
});



//exports

module.exports = router;