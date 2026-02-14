const express = require('express');
const router = express.Router();
const productDeleteController = require("../controller/productDeleteController");

router.get('/:id', productDeleteController.deleteProduct);

module.exports = router;
