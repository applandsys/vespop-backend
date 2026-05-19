const router = require('express').Router();
const couponController = require('../controller/CouponController');

router.post('/', couponController.createCoupon);
router.get('/', couponController.getAllCoupons);
router.post('/apply', couponController.applyCoupon);

module.exports = router;


/*

{
  "code": "WELCOME500",
  "description": "First order discount",
  "discountType": "FLAT",
  "discountValue": 500,
  "minOrderAmount": 2000,
  "startDate": "2026-05-01",
  "endDate": "2026-06-01",
  "maxUses": 1000,
  "perUserLimit": 1,
  "applicableType": "CART"
}

{
  "code": "WELCOME500",
  "cartTotal": 2500,
  "userId": 12
}
 */

