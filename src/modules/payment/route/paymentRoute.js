const express = require('express');
const router = express.Router();
const paymentController = require('@/modules/payment/controller/PaymentController');
const paymentIpnController = require('@/modules/payment/controller/PaymentIpnController');

// v1/payment
router.post('/', paymentController.createPayment);
router.post('/ssl-success', paymentController.sslSuccess);


router.post("/ssl/ipn", paymentIpnController.sslIpn);
router.post("/bkash/ipn", paymentIpnController.bkashIpn);
router.post("/nagad/ipn", paymentIpnController.nagadIpn);


module.exports = router;