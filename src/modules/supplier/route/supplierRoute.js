const express = require('express');
const router = express.Router();
const SupplierController = require('@/modules/supplier/controller/SupplierController');

// v1/supplier
router.get('/', SupplierController.getSupplier);
router.get('/:id', SupplierController.getSupplierById);

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
router.post('/', SupplierController.addSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/', SupplierController.deleteSupplierById);

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

router.post('/payment', SupplierController.addSupplierPayment);

// v1/supplier

router.get('/payment/due', SupplierController.supplierPaymentDue);
router.get('/payment/paid', SupplierController.supplierPaymentPaid);


module.exports = router;