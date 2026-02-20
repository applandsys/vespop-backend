const express = require('express');
const router = express.Router();
const sitePostController = require('@/modules/site-post/controller/sitePostController');

// v1/site-post
router.get('/', sitePostController.getSitePost);

router.get('/post/:id', sitePostController.getSitePostById);


module.exports = router;