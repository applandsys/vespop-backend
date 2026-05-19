const express = require('express');
const router = express.Router();
const  {
    createOrderReturn,
    getOrderReturns,
    getOrderReturnById,
} = require("../controller/OrderReturnController.js");


// Create order return
router.post("/", createOrderReturn);

// Get all order returns
router.get("/", getOrderReturns);

// Get single order return
router.get("/:id", getOrderReturnById);


module.exports = router;