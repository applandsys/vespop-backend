const express = require('express');
const router = express.Router();
const customerOrderController = require('@/modules/ecommerce/controller/customerOrderController');
const authenticateToken = require('@/middleware/authenticateToken');
const customerWishListController = require('@/modules/ecommerce/controller/customerWishlistController');
const customerReviewController = require('@/modules/ecommerce/controller/customerReviewController');

const customerSupportController = require('@/modules/ecommerce/controller/user/supportTicketController');
// api/customer/ ... ? [GET]

router.post('/order-submit',authenticateToken, customerOrderController.customerOrderSubmit);
router.post('/add-wishlist',authenticateToken, customerWishListController.addWishList);
router.post('/review',authenticateToken, customerReviewController.customerReviewSubmit);

router.get('/orderbyid/:id',authenticateToken, customerOrderController.customerOrderById);

// api/customer/support
router.post('/support',authenticateToken, customerSupportController.addSupportTicket);
router.get('/support', authenticateToken, customerSupportController.getSupportTicket);


module.exports = router;