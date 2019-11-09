var express = require('express');
var router = express.Router();



//Category Models

var Category = require('../models/category');



// Get Category index

router.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if (err) return console.log(err);

        res.render('admin/categories', {
            categories: categories
        });
    });
});






// Get Add Category



router.get('/add-category', function (req, res) {

    var title = "";

    res.render('admin/add_category', {
        title: title
    });

});




// Post Add Category



router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must Have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title
        });
    }
    else {
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category exists, choise another');
                res.render('admin/add_category', {
                    title: title
                });
            }
            else {
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function (err) {
                    if (err) return console.log(err);

                    req.flash('success', 'New Category Added!');
                    res.redirect('/admin/categories');

                });
            }
        });
    }



});






// Get Edit Category



router.get('/edit-category/:id', function (req, res) {

    Category.findById(req.params.id, function (err, category) {
        if (err) return console.log(err);

        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    });



});



// Post Edit Category



router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must Have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {

        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    }
    else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category exists, choise another');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            }
            else {

                Category.findById(id, function (err, category) {
                    if (err) return console.log(err);

                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err) return console.log(err);

                        req.flash('success', 'Category Edited Successfully!');
                        res.redirect('/admin/categories/edit-category/' + id);

                    });
                });



            }
        });
    }



});


// Get Delete Category

router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) return console.log(err);

        req.flash('success', 'Category Deleted Successfully!');
        res.redirect('/admin/categories/');

    });
});


//exports

module.exports = router;