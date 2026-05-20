const express = require('express');
const router = express.Router();
const userController = require('../../user/controller/userController');

// api/customer/auth/login ... ? [GET]

router.post('/login', userController.userLogin);
router.post('/signup', userController.userSignup);

module.exports = router;