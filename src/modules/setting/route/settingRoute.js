const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');
const siteSettingController = require('../controller/siteSettingController');
const upload = require("@/middleware/siteLogoUpload");
const bannerUpload = require('@/middleware/bannerUpload');
const bannerR2Upload = require('@/middleware/bannerR2Upload');
const ShippingController = require('@/modules/setting/controller/ShippingController');
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
/*
router.post(
    '/banner',
    bannerUpload.fields([
        { name: 'banner', maxCount: 1 }
    ]),
    siteSettingController.handler
);
 */

router.post(
    '/banner',
    bannerR2Upload,
    siteSettingController.handler
);
/*
router.put('/banner/:id', bannerUpload.fields([{ name: 'banner', maxCount: 1 }]), siteSettingController.handler);
 */

router.put('/banner/:id', bannerR2Upload, siteSettingController.handler);

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

/*
{
  "location": "Dhaka",
  "price": 120,
  "isByLocation": true,
  "isFree": false,
  "extData": {
    "note": "Inside city"
  }
}
 */

// /admin/setting/shipping/cost
router.get('/shipping/cost', ShippingController.getShippingCost);
router.post('/shipping/cost', ShippingController.createShippingCost);
router.put('/shipping/cost/:id', ShippingController.updateShippingCost);
router.get('/shipping/cost/:id', ShippingController.shippingCostById);


module.exports = router;