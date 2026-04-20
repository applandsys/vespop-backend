const express = require('express');
const router = express.Router();
const purchaseController = require('../../controller/admin/purchaseController');

// /v1/admin/purchase
/*
        {
            "productId": 1,
            "quantity": 10,
            "buyPrice": 100,
            "paidAmount" : 150,
            "dueAmount": 253,
            "supplierId": 1
        }
 */
router.post('/', purchaseController.createPurchase);
router.get('/', purchaseController.getPurchase);

module.exports = router;
