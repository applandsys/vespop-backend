const express = require('express');
const router = express.Router();
const userController = require('../../ecommerce/controller/userController');

// api/customer/auth/login ... ? [GET]

router.post('/login', userController.userLogin);
router.post('/signup', userController.userSignup);

module.exports = router;