const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');
const siteSettingController = require('../controller/admin/siteSettingController');
const upload = require("@/middleware/siteLogoUpload");
const bannerUpload = require('@/middleware/bannerUpload');
const productAdminController = require("@/modules/ecommerce/controller/admin/productController");
const {handler} = require("@/modules/ecommerce/controller/admin/siteSettingController");

// BASE LOCATION: // /v1/admin/setting

// v1/setting/location/ ... ? [GET, POST]
router.get('/location/all-primary', locationController.allPrimaryLocation);
router.get('/location/all', locationController.allLocations);
router.get('/location/type/:level', locationController.allLocations);
router.get('/location/parents/:parentId', locationController.allLocations);
router.post('/location/add', locationController.addLocation);

router.post(
    '/site-setting',
    upload.fields([
        { name: 'logo', maxCount: 1 }
    ]),
    siteSettingController.siteSetting
);

router.get(
    '/site-setting',
    siteSettingController.getSiteSetting
);

router.post(
    '/banner',
    bannerUpload.fields([
        { name: 'banner', maxCount: 1 }
    ]),
    siteSettingController.handler
);

router.put('/banner/:id', bannerUpload.fields([{ name: 'banner', maxCount: 1 }]), siteSettingController.handler);

// Route for POST (create a new banner)
router.get('/banner',
    siteSettingController.handler
);

// Route for POST (create a new banner)
router.get('/banner/:slug',
    siteSettingController.bannerBySlug
);

// Route for POST (create a new banner)
router.get('/banner/byid/:id',
    siteSettingController.bannerById
);


// Route for PUT (update an existing banner)
router.put('/banner/:id', upload.fields([{ name: 'banner', maxCount: 1 }]), siteSettingController.handler);
// Backend - DELETE Banner
router.delete('/banner/:id', siteSettingController.deleteBanner);


module.exports = router;