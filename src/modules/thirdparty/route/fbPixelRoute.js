const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const FbPixelController = require("@/modules/thirdparty/controller/FbPixelController");
const router = express.Router();

router.get('/fb-id',  FbPixelController.getFbId);
router.post('/update/fb-id',  FbPixelController.updateFbId);

module.exports = router;