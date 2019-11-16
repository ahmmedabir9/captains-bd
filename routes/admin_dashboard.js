var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;


//Category Models

//var Category = require('../models/category');



// Get Page index

router.get('/', isAdmin, function (req, res) {
    res.render('admin/dashboard', {
        title: 'Captain\'s Shop BD | Home'
    }
    );
});



//exports

module.exports = router;