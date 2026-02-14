const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const router = express.Router();

const supportTicketController = require("@/modules/ecommerce/controller/user/supportTicketController");

// v1/
router.post('/support',authenticateToken, supportTicketController.addSupportTicket);

module.exports = router;