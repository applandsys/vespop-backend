const express = require('express');
const router = express.Router();
const stockController = require('@/modules/inventory/controller/stockController');

// v1/inventory/stock
router.get('/product-stock', stockController.productStock);
router.post('/product-stock/add', stockController.addProductStock);

module.exports = router;