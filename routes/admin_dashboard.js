var express = require('express');
var router = express.Router();



//Category Models

//var Category = require('../models/category');



// Get Page index

router.get('/', function (req, res) {
    res.render('admin/dashboard', {
        title: 'Captain\'s Shop BD | Home'
    }
    );
});



//exports

module.exports = router;