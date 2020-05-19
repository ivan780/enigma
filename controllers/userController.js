const express = require('express');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');
const session = require('express-session');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.index = function (req, res, next) {
    console.log(req.session.email);
    res.render('index', {title: 'Hola'});
};

exports.login = function (req, res, next) {
    res.render('signIn');
};

exports.loginPOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.pass);
    var usuario = Usuario.findOne({email: req.body.email}, function (err, user) {
        console.log("pene")
        if (!user || !bcrypt.compareSync(req.body.pass, user.password)) {
            res.render('signIn', {email: req.body.email, errors: "Email o contraseña incorrecto"});
            return;
        }
            // Successful - redirect to new author record.
            res.redirect('/users');
        });
};


exports.createUser = function (req, res, next) {
    res.render('signUp');
};

exports.createUserPOST = function (req, res, next) {
    console.log(req.body.email + "//" + req.body.pass);

    var usuario = new Usuario(
        {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.pass, 10),
        });

    usuario.save(function (err) {
        if (err) {
            return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect('/users/login');
    });
}
