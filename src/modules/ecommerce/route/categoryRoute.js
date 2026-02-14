const express = require('express');
const router = express.Router();
const categoryController = require('@/modules/ecommerce/controller/categoryController');

// v1/category/1
router.get('/:id', categoryController.categoryDetail);

// v1/category/products/category-slug
router.get('/products/:slug', categoryController.categoryProductDetail);

router.get('/detail/:slug', categoryController.categoryDetailBySlug);

module.exports = router;