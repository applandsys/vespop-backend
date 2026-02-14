const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const fraudCheckController = require("@/modules/thirdparty/controller/FraudCheckController");
const router = express.Router();

// third-party/fraud-check`

router.post('/fraud-check',  fraudCheckController.fraudCheckRequest);


module.exports = router;