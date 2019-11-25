var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var auth = require('../config/auth');
var isUser = auth.isUser;

// Get User Model
var User = require('../models/user');

//Order Models
var Order = require('../models/order');


//Get Register
router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register'
    });
});

//Post Register
router.post('/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var address = "";
    var mobile = "";

    req.checkBody('name', 'Name is Required!').notEmpty();
    req.checkBody('email', 'Please Enter a valid Email').isEmail();
    req.checkBody('username', 'Username is Required!').notEmpty();
    req.checkBody('password', 'Password is Required!').notEmpty();
    req.checkBody('password2', 'Password Do not Match!').equals(password);


    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            title: 'Register',
            user: null
        });

    }

    else {
        User.findOne({ username: username }, function (err, user) {

            if (err) console.log(err);

            if (user) {
                req.flash('danger', 'Username Already Exists, Choose another!');
                res.redirect('/users/register');
            }

            else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    address: address,
                    mobile: mobile,
                    admin: 0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) console.log(err);

                            else {
                                req.flash('success', 'You are now Registered!');
                                res.redirect('/users/login');
                            }

                        });

                    });
                });
            }
        });
    }
});

//Get Login
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');

    res.render('login', {
        title: 'Log in'
    });
});

//Post Login
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Get Logout
router.get('/logout', function (req, res, next) {

    req.logout();

    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');
});

//Get User Profile
router.get('/profile/:id', isUser, function (req, res) {

    if (res.locals.user) {
        Order.find({ user: res.locals.user.username }, function (err, orders) {
            res.render('profile', {
                title: 'Profile',
                user: res.locals.user,
                orders: orders
            });
        });
    }
});



// Post User Profile



router.post('/profile/:id', function (req, res) {

    req.checkBody('name', 'Name must Have a value.').notEmpty();
    req.checkBody('email', 'Email must Have a value.').notEmpty();

    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var address = req.body.address;
    var id = req.params.id;

    var errors = req.validationErrors();


    if (errors) {
        req.session.errors = errors;
        res.redirect('/users/profile/' + id);
    }

    else {
        User.findOne({ email: email, _id: { '$ne': id } }, function (err, u) {
            if (err) {
                console.log(err);

            }

            if (u) {
                req.flash('danger', 'Email ID Exists, Choose Another');
                res.redirect('/users/profile/' + id);
            }

            else {
                User.findById(id, function (err, u) {
                    if (err) console.log(err);


                    u.name = name;
                    u.email = email;
                    u.mobile = mobile;
                    u.address = address;


                    u.save(function (err) {
                        if (err) console.log(err);


                        req.flash('success', 'Profile Updated!');
                        res.redirect('/users/profile/' + id);

                    })

                })
            }

        });
    }


});


//exports

module.exports = router;