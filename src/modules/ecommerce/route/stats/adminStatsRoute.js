const express =  require('express');
const userStatsController = require("@/modules/ecommerce/controller/stats/adminStatsController");
const router = express.Router();

router.get('/', userStatsController.adminStats);

module.exports = router;