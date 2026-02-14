const express = require('express');
const router = express.Router();
const customerController = require('../../ecommerce/controller/customerController');

// api/customer/auth/login ... ? [GET]

router.post('/login', customerController.customerLogin);
router.post('/signup', customerController.customerSignup);

module.exports = router;