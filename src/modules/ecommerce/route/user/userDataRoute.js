const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const router = express.Router();

const userOrderController = require("../../controller/user/orderController");

// v1/user/data
router.get('/orders',authenticateToken, userOrderController.getAllOrderByUser);



module.exports = router;