var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');
var chat_controller = require('../controllers/chatController');


router.get('/test', (req, res) => {
    res.render('login.html', {title: 'first website'});
}
);

router.get('/', (req, res) => {
    res.redirect('/dashboard');
});


router.get('/dashboard', user_controller.index);

router.get('/login', user_controller.login);

router.post('/login', user_controller.loginPOST);

router.get('/reg', user_controller.createUser);

router.post('/reg', user_controller.createUserPOST);

router.get('/change-password', user_controller.changePass);

router.post('/change-password', user_controller.changePassPOST);

router.post('/add-contact', user_controller.addContact);

router.get('/chat/:id', user_controller.chat)

module.exports = router;
