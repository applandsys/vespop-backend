const express = require('express');
const router = express.Router();
const widgetController = require('./WidgetController');
const widgetR2Upload = require("@/middleware/widgetR2Upload");

// /widgets
// CREATE
router.post('/', widgetR2Upload, widgetController.createWidget);

// READ (all)
router.get('/', widgetController.getAllWidgets);


// READ (single)
router.get('/slug/:slug', widgetController.getWidgetBySlug);

// READ (single)
router.get('/:id', widgetController.getWidgetById);

// UPDATE
router.put('/:id', widgetController.updateWidget);

// DELETE
router.delete('/:id', widgetController.deleteWidget);

module.exports = router;

/*

{
  "name": "hero_banner",
  "title": "Welcome to Our Store",
  "subTitle": "Best Deals Everyday",
  "imageContent": "https://cdn.site/banner.png",
  "backgroundColor": "#ffffff",
  "borderColor": "#e5e7eb",
  "content": "<h1>Big Sale</h1>",
  "jsonContent": {
    "ctaText": "Shop Now",
    "ctaLink": "/shop"
  }
}

{
  "title": "Mega Sale",
  "backgroundColor": "#f8fafc"
}
 */