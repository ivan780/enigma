var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController')


router.get('/dashboard', user_controller.index);

router.get('/login', user_controller.login);

router.post('/login', user_controller.loginPOST);

router.get('/reg', user_controller.createUser);

router.post('/reg', user_controller.createUserPOST);

router.get('/change-password', user_controller.changePass);

router.post('/change-password', user_controller.changePassPOST);

module.exports = router;
