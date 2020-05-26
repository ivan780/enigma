#!/usr/bin/env node
//Configuracion
require('./config/config');
//Dependecias
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var debug = require('debug')('enigma:server');
var favicon = require('serve-favicon');


//Route required
var indexRouter = require('./routes/index');




//Init server
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);



//Mongose connection
mongoose.connect(process.env.URLDB, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB conection error:"))

var Usuario = require('./models/usuario');

//socketIo
io.sockets.on('connection', function (socket) {
    console.log('Connected client');

    socket.on('create', function(room) {
        socket.join(room);
        console.log(room)
    });

    socket.on('send', function (data) {
        console.log(data);
        socket.to(data.Room).emit('receive', data.Message);
    })

    socket.on('leave', function (data) {
        console.log("leave: " + data);
        socket.leave(data);
    })



    //event to check if username exist
    socket.on('checkUsername', function (data, callback) {
        console.log('Socket (server-side): received message:', data);
        Usuario.findOne({username: data.payload}, function (err, data) {
            console.log(err)
            if (!data){
                callback(true);
            }else {
                callback(false)
            }
        })
    });


    socket.on('checkEmail', function (data, callback) {
        console.log('Socket (server-side): received message:', data);
        Usuario.findOne({email: data.payload}, function (err, data) {
            console.log(err)
            if (!data){
                callback(false);
            }else {
                callback(true)
            }
        })
    });

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.secretKey));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', indexRouter);


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

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
