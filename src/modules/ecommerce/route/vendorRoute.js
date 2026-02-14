const express = require('express');
const router = express.Router();
const vendorController = require('../controller/vendorController');

// v1/vendor/vendor-list   ... ? [GET]
router.get('/vendor-list', vendorController.vendorList);

module.exports = router;