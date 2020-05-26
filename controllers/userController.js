const bcrypt = require('bcryptjs');
const Usuario = require('./../models/usuario');
var jwt = require('../auth/local')
var md5 = require('md5')

function checkToken(req, res) {
    jwt.decodeToken(req.cookies["token"], function (msg, data) {
        if (msg) {
            console.log("maricon");
            return res.redirect("/login");
        }
        Usuario.findOne({email: data.sub}).then(function (user) {
            return user;
        });
    });
}

exports.index = function (req, res) {
    var listCont = [];
    var urlCont = [];
    var user = checkToken(req, res)
    if (user) {
        var contactos = user.contactos;
        for (var i = 0; i < contactos.length; i++) {
            listCont.push(contactos[i].split("///")[0]);
            if (contactos[i].split("///")[1] === '2') {
                urlCont.push(md5(user.email + user.contactos[i].split("///")[0]));
            } else {
                urlCont.push(md5(user.contactos[i].split("///")[0] + user.email))
            }
        }
        console.log(urlCont)
        console.log(listCont)
        return res.render('index', {User: user.email});
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
    var user = checkToken(req, res)
    if (user) {
        //save contact
        user.contactos.push(req.body.email + "///2")
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            Usuario.findOne({email: req.body.email}).then(function (user) {
                //save contact for the other contact
                user.contactos.push(data.sub + "///1")
                user.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/dashboard');
                });
            });

        });
    }
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

exports.chat = function (req, res, next) {
    var user = checkToken(req, res)
    if (user) {
        for (var i = 0; i < user.contactos.length; i++) {
            var idPos
            console.log(user.contactos[i].split("///"))
            if (user.contactos[i].split("///")[1] === '2') {
                idPos = md5(user.email + user.contactos[i].split("///")[0])
            } else {
                idPos = md5(user.contactos[i].split("///")[0] + user.email)
            }
            console.log("idPos: " + idPos + "///" + req.params.id)
            if (req.params.id === idPos) {
                console.log("maricon")
                return res.render('chat');
            }
        }
        return res.redirect('/dashboard');
    }
}
