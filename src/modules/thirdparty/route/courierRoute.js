const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const courierController = require("@/modules/thirdparty/controller/CourierController");
const router = express.Router();

// third-party/courier`

router.get('/',  courierController.getCourierList);
router.get('/active',  courierController.getActiveCourierList);
router.post('/',  courierController.addCourier);


module.exports = router;