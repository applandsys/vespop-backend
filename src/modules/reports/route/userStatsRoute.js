const express = require('express');
const router = express.Router();
const userStatsController = require("../controller/userStatsController");

// v1/user/stats/order/1
router.get('/order/:id', userStatsController.userOrderStats);

module.exports = router;