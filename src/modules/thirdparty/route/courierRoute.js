const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const courierController = require("@/modules/thirdparty/controller/CourierController");
const router = express.Router();

// third-party/courier`

router.get('/',  courierController.getCourierList);
router.post('/',  courierController.addCourier);


module.exports = router;