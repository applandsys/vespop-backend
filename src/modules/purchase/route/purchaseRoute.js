const express = require('express');
const router = express.Router();
const supplierController = require('@/modules/supplier/controller/supplierController');

// v1/inventory/stock
router.get('/', supplierController.getSupplier);
router.post('/', supplierController.addSupplier);

module.exports = router;