const express = require('express');
const router = express.Router();
const sitePostController = require('@/modules/site-post/controller/sitePostController');
const sitePost = require("@/middleware/sitePost");

// v1/site-post
router.get('/', sitePostController.getSitePost);
router.post(
    '/',
    sitePost.fields([
        { name: 'featuredImage', maxCount: 1 }
    ]),
    sitePostController.addSitePost
);

router.get('/post/:id', sitePostController.getSitePostById);


module.exports = router;