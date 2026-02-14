const express = require('express');
const router = express.Router();
const orderAdminController = require('../controller/admin/orderController');

 // /v1/admin/order
router.get('/list', orderAdminController.orderList);
router.post('/make-paid', orderAdminController.makeOrderPaid);



module.exports = router;
