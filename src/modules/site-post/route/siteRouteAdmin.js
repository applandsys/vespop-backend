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

router.put(
    '/',
    sitePost.fields([
        { name: 'featuredImage', maxCount: 1 }
    ]),
    sitePostController.updateSitePost
);

router.get('/single/:postId', sitePostController.getSitePostById);


module.exports = router;