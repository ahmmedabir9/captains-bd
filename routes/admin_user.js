var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;


//User Models
var User = require('../models/user');


//Order Models
var Order = require('../models/order');



// Get User index

router.get('/', function (req, res) {

    User.find(function (err, users) {
        res.render('admin/users', {
            users: users
        });
    }).sort({ _id: -1 });
});




// Get Add Page



router.get('/add-page', function (req, res) {

    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });

});




// Post Add Page



router.post('/add-page', function (req, res) {

    req.checkBody('title', 'Title must Have a value.').notEmpty();
    req.checkBody('content', 'Content must Have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors');

        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }
    else {
        Page.findOne({ slug: slug }, function (err, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choise another');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            }
            else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                page.save(function (err) {
                    if (err) return console.log(err);

                    req.flash('success', 'Page Added!');
                    res.redirect('/admin/pages');

                });
            }
        });
    }



});


// Post Reorder Pages

router.post('/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err) return console.log(err);
                });
            });
        })(count);
    }
});




// Get Edit User



router.get('/edit-user/:id', function (req, res) {

    User.findById(req.params.id, function (err, user) {
        if (err) return console.log(err);

        res.render('admin/edit_user', {
            title: user.name,
            user: user
        });
    });





});



// Post Edit User



router.post('/edit-user/:id', function (req, res) {


    var admin = req.body.admin;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors');

        res.render('admin/edit_user', {
            errors: errors,
            title: user.name,
            user: user
        });
    }
    else {
        User.findById(id, function (err, user) {
            if (err) return console.log(err);

            user.admin = admin;

            user.save(function (err) {
                if (err) return console.log(err);

                req.flash('success', 'User Status Updated Successfully!');
                res.redirect('/admin/users/edit-user/' + id);
            });
        });



    }
});



// Get Delete user

router.get('/delete-user/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) return console.log(err);

        req.flash('success', 'User Deleted Successfully!');
        res.redirect('/admin/users/');

    });
});


//exports

module.exports = router;