const express = require('express');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');
const session = require('express-session');
var jwt = require('../auth/local')

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.index = function (req, res, next) {
    if (req.cookies["token"]) {
        jwt.decodeToken(req.cookies["token"], function (msg, data) {
                if (msg) {
                    return res.redirect("/login");
                }
                Usuario.findOne({email: data.sub}).then(function (user) {
                    return res.render('index', {User: user.email});
                })
            }
        );
    } else {
        return res.redirect("/login");
    }
}


exports.login = function (req, res, next) {
    return res.render('user/signIn');
};

exports.loginPOST = function (req, res, next) {
    Usuario.findOne({email: req.body.email}).then(function (user) {
        if (user && bcrypt.compareSync(req.body.pass, user.password)) {
            // Set cookie
            return res.clearCookie('token')
                .cookie('token', jwt.encodeToken(user.email), {maxAge: 604800000})
                .redirect('/dashboard');
        } else {
            return res.redirect('/login');
        }
    });
};


exports.createUser = function (req, res, next) {
    return res.render('user/signUp');
};

exports.createUserPOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.pass);

    var usuario = new Usuario(
        {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.pass, 10),
            username: req.body.username,
        });

    usuario.save(function (err) {
        if (err) {
            return next(err);
        }
        // Successful - redirect to new author record.
        return res.redirect('/login');
    });
}

exports.addContact = function (req, res, next) {
}


exports.changePass = function (req, res, next) {
    return res.render('user/update');
};

exports.changePassPOST = function (req, res, next) {
    var usuario = Usuario.findOne({email: req.body.email}, function (err, user) {
        if (!user || !bcrypt.compareSync(req.body.oldPass, user.password)) {
            return res.redirect("/login");
        }
        user.password = bcrypt.hashSync(req.body.newPass, 10);
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            // Successful - redirect to new author record.
            return res.redirect('/login');
        });

    });
};

/**
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
 **/
