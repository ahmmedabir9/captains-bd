var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', {
        title: 'Captain\'s Shop BD | Home'
    }
    );
});

//exports

module.exports = router;