var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config/database');
var session = require('express-session');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');


//Connection to DB
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});


//Init app

var app = express();

// View Engine Setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));


// Set Global Error Variables
app.locals.errors = null;

//Get Page Models
var Category = require('./models/category');

//Get Categories
Category.find(function (err, categories) {
  if (err)  console.log(err);

  else {
    app.locals.categories = categories;
  }
  
}); 


//Express File Upload Middleware
app.use(fileUpload());

// Body Parser MiddleWare
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//Express Session MiddleWare
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));


//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}));

//Express Message MiddleWare
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// set routes
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminDashboard = require('./routes/admin_dashboard.js');
var adminProducts = require('./routes/admin_products.js');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/', adminDashboard);
app.use('/admin/products', adminProducts);
app.use('/', pages);
app.use('/products', products);

//start the server
var port = 3000;
app.listen(port, function () {
  console.log('Server Started on Port ' + port);
}); 