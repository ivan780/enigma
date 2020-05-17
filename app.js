var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Mongose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://enigmaUSER:*Q$%P7fC#cQWH63p@192.168.1.46:60425/EnigmaDB?authSource=admin';
mongoose.connect(mongoDB, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB conection error:"))

//Route required
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//Init app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
