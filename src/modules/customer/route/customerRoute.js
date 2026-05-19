const express = require('express');
const router = express.Router();
const customerOrderController = require('@/modules/customer/controller/customerOrderController');
const authenticateToken = require('@/middleware/authenticateToken');
const customerWishListController = require('@/modules/customer/controller/customerWishlistController');
const customerReviewController = require('@/modules/customer/controller/customerReviewController');

const customerSupportController = require('@/modules/support/controller/supportTicketController');
// api/customer/ ... ? [GET]

//  http://localhsot/v1/customer/order-submit (POST)
router.post('/order-submit',authenticateToken, customerOrderController.customerOrderSubmit);


router.post('/add-wishlist',authenticateToken, customerWishListController.addWishList);
router.get('/get-wishlist',authenticateToken, customerWishListController.getWishList);
router.get('/remove-wishlist/:id',authenticateToken, customerWishListController.removeWishList);
router.post('/review',authenticateToken, customerReviewController.customerReviewSubmit);

//  http://localhost/v1/customer/orderbyid/1 (GET)
router.get('/orderbyid/:id',authenticateToken, customerOrderController.customerOrderById);

// api/customer/support
router.post('/support',authenticateToken, customerSupportController.addSupportTicket);
router.get('/support', authenticateToken, customerSupportController.getSupportTicket);


module.exports = router;