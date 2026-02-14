const express = require('express');
const router = express.Router();
const userController = require('../../auth/controller/userController');

// api/user/list ... ? [GET]
router.get('/list', userController.userList);

module.exports = router;