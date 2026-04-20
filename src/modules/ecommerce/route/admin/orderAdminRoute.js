const express = require('express');
const router = express.Router();
const orderAdminController = require('../../controller/admin/orderController');

 // /v1/admin/order
router.get('/list', orderAdminController.orderList);
router.get('/latest', orderAdminController.latestOrder);
router.post('/make-paid', orderAdminController.makeOrderPaid);
router.post('/update-status', orderAdminController.makeOrderPaid);
router.post('/send-courier', orderAdminController.makeCourierParcel);



module.exports = router;
