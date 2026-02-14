const express = require('express');
const router = express.Router();
const productAdminController = require('@/modules/ecommerce/controller/admin/productController');
const upload = require("@/middleware/upload");
const productUpload = require("@/middleware/productUpload");
const brandLogo = require("@/middleware/brandLogo");

// v1/admin/product
router.get('/category/:id', productAdminController.categoryById);
router.get('/categories', productAdminController.allCategories); // v1/admin/product/categories

// v1/admin/product/add-product-category
router.post(
    '/add-product-category',
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'icon', maxCount: 1 }
    ]),
    productAdminController.addProductCategory
);

router.put(
    '/edit-product-category/:id',  // Use :[bannerId] for category identification
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'icon', maxCount: 1 }
    ]),
    productAdminController.editProductCategory
);

router.post(
    '/add-product',
    productUpload.fields([
        { name: 'image', maxCount: 5 }
    ]),
    productAdminController.addProduct
);

router.put(
    '/edit-product/:id',
    productUpload.fields([
        { name: 'image', maxCount: 5 }
    ]),
    productAdminController.addProduct
);

router.post('/add-attribute', productAdminController.addProductAttribute);
// http://localhost:4000/v1/admin/product/detail/1
router.get('/detail/:productId', productAdminController.getProductById);

// /v1/admin/product/attribute-values
router.get('/attribute-values', productAdminController.getAllAttributes);
router.get('/product-labels', productAdminController.getAllProductLabels);

router.post(
    '/add-product-brand',
    brandLogo.fields([
        { name: 'image', maxCount: 1 }
    ]),
    productAdminController.addProductBrand
);


module.exports = router;
