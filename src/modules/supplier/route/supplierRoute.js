const express = require('express');
const router = express.Router();
const supplierController = require('@/modules/supplier/controller/supplierController');

// v1/supplier
router.get('/', supplierController.getSupplier);

/*
{ "name": "Sumya & CO",
  "address" : "Dhaka" ,
  "phone" : "0158458788",
  "email": "sumya@gmail.com",
  "password" : "Dhaka@1230",
  "type" : "Stationary",
  "logo" : "hdood",
  "slug" : "sumya-co",
  "note": "Test and chec",
  "status" : "ACTIVE"
  }
 */
router.post('/', supplierController.addSupplier);

module.exports = router;