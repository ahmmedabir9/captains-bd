var express = require('express');
var router = express.Router();

// Get Page index

router.get('/', function (req, res) {
    Page.find({}).exec(function (err, pages) {
        res.render('admin/pages', {
            pages: pages
        });
    });
});




//Page Models

var Page = require('../models/page');



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




// Get Edit Page



router.get('/edit-page/:id', function (req, res) {

    Page.findById(req.params.id, function (err, page) {
        if (err) return console.log(err);

        res.render('admin/edit_page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });



});



// Post Edit Page



router.post('/edit-page/:id', function (req, res) {

    req.checkBody('title', 'Title must Have a value.').notEmpty();
    req.checkBody('content', 'Content must Have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        console.log('errors');

        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    }
    else {
        Page.findOne({ slug: slug, _id: { '$ne': id } }, function (err, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choise another');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            }
            else {

                Page.findById(id, function (err, page) {
                    if (err) return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;

                    page.save(function (err) {
                        if (err) return console.log(err);

                        req.flash('success', 'Page Edited Successfully!');
                        res.redirect('/admin/pages/edit-page/' + id);

                    });
                });



            }
        });
    }



});


// Get Delete index

router.get('/delete-page/:id', function (req, res) {
    Page.findByIdAndRemove(req.params.id, function (err) {
        if (err) return console.log(err);

        req.flash('success', 'Page Deleted Successfully!');
        res.redirect('/admin/pages/');

    });
});


//exports

module.exports = router;