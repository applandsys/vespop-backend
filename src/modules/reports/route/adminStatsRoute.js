const express =  require('express');
const userStatsController = require("@/modules/reports/controller/adminStatsController");
const router = express.Router();

router.get('/', userStatsController.adminStats);

module.exports = router;