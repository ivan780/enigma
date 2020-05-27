var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

var token = function(req, res, next){
    if (req.cookies["token"]){
        next();
    }else {
         return res.redirect('/login')
    }
}

router.get('/test', (req, res) => {
    res.render('login.html', {title: 'first website'});
});

router.get('/', (req, res) => {
   return res.redirect('/dashboard');
});


router.get('/dashboard', token,user_controller.index);

router.get('/login', user_controller.login);

router.post('/login', user_controller.loginPOST);

router.get('/signup', user_controller.createUser);

router.post('/signup', user_controller.createUserPOST);

router.get('/logout', user_controller.logout)

router.get('/change-password', user_controller.changePass);

router.post('/change-password', user_controller.changePassPOST);

router.post('/add-contact',token, user_controller.addContact);

router.get('/chat/:id', token, user_controller.chat);

module.exports = router;
