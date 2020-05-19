var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController')

router.get('/', function (req, res) {
    res.render('index');
})
router.get('/login', user_controller.login);

router.post('/login', user_controller.loginPOST);

router.get('/reg', user_controller.createUser);

router.post('/reg', user_controller.createUserPOST);

module.exports = router;
