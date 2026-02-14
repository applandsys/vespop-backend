const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const productReviewController = require("../controller/productReviewController");

// api/product/[categories]  ... ? [GET]

router.get('/all', productController.allProducts);
router.get('/categories', productController.productCategories);
router.get('/brands', productController.productBrands);
router.get('/featured', productController.featuredProducts);
router.get('/new', productController.newProducts);
router.get('/list/:slug', productController.productBySlug);
router.get('/detail/:slug', productController.productDetailBySlug);
router.get('/list/:catid', productController.productByCatId);
router.get('/attribute/all',productController.productAttributes);

router.get('/label/:labelSlug', productController.labelWiseProducts);

router.get('/reviews/:productId', productReviewController.getReviewsByProductId);

// router.get('/:[bannerId]', userController.userById);
// router.get('/tree/:[bannerId]', userController.userTree);
// router.get('/insert', userController.userInsert);

module.exports = router;