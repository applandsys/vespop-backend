const express = require('express');
const router = express.Router();
const ReviewController = require('../../controller/admin/ReviewController');

// /v1/admin/review
router.get('/pending', ReviewController.pending);
router.get('/approved', ReviewController.approved);
router.patch('/update', ReviewController.update);

module.exports = router;
