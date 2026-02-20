const express = require('express');
const router = express.Router();
const sitePostController = require('@/modules/site-post/controller/sitePostController');

// v1/site-post
router.get('/', sitePostController.getSitePost);

router.get('/id/:id', sitePostController.getSitePostById);
router.get('/slug/:slug', sitePostController.getSitePostBySlug);


module.exports = router;