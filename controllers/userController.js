const express = require('express');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');
const session = require('express-session');
var jwt = require('../auth/local')

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.index = function (req, res, next) {
    if (req.cookies["token"]){
        jwt.decodeToken(req.cookies["token"], function (msg, data) {
            if (msg){
                res.redirect("/login");
                return
            }
            Usuario.findOne({ email: data.sub }).then(function (user) {
                res.render('index', {email: user.email});

            });

        })
    }
    res.redirect("/login");
};


exports.login = function (req, res, next) {
    res.render('user/signIn');
};

exports.loginPOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.pass);
    Usuario.findOne({ email: req.body.email }).then(function (user) {
        if (!user) {
            console.log("crack")
            res.redirect('/login');
        } else if (!bcrypt.compareSync(req.body.pass, user.password)) {
            res.redirect('/login');
        } else {

            // Set cookie
            res.cookie('token',jwt.encodeToken(user.email), { maxAge: 604800000 })
            res.redirect('/dashboard');
        }
    });
};


exports.createUser = function (req, res, next) {
    res.render('user/signUp');
};

exports.createUserPOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.pass);

    var usuario = new Usuario(
        {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.pass, 10),
            session: req.sessionID,
        });

    usuario.save(function (err) {
        if (err) {
            return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect('/users/login');
    });
}


exports.changePass = function (req, res, next) {
    res.render('user/update');
};

exports.changePassPOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.oldPass);
    var usuario = Usuario.findOne({email: req.body.email}, function (err, user) {
        if (!user || !bcrypt.compareSync(req.body.oldPass, user.password)) {
            //res.render('user/update', {email: req.body.email, errors: "Email o contraseña incorrecto"});
            res.redirect('/users/update');
            return;
        }

        console.log(req.body.newPass);
        user.password = bcrypt.hashSync(req.body.newPass, 10);
        user.session = req.sessionID;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            // Successful - redirect to new author record.
            res.redirect('/users/login');
            return;
        });

    });
};

exports.changeSession = function (userID, sessionID) {
    var usuario = Usuario.findOne({_id: userID}, function (err, user) {
        if (!user) {
            return false;
        }
        user.session = sessionID;
        user.save(function (err) {
            if (err) {
                return false;
            }
            return true;
        })
    })
}

exports.delete = function (req, res, next) {
    res.render('user/signIn');
};

exports.deletePOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.oldPass);
    var usuario = Usuario.findOne({email: req.body.email}, function (err, user) {
        if (!user || !bcrypt.compareSync(req.body.oldPass, user.password)) {
            res.render('signIn', {email: req.body.email, errors: "Email o contraseña incorrecto"});
            return;
        }
        if (req.body.newPass) {
            user.password = req.body.newPass;
            user.save;
        }
        // Successful - redirect to new author record.
        res.redirect('/users/login');
    });
};
