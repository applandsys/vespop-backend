const router = require('express').Router();
const dealController = require('../controller/DealController');

router.post('/', dealController.createDeal);
router.get('/active', dealController.getActiveDeals);


module.exports = router;

/*

    {
      "title": "EID FLASH SALE",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "dealType": "CATEGORY",
      "targetId": 5,
      "startDate": "2026-05-05",
      "endDate": "2026-05-07",
      "priority": 5
    }

 */