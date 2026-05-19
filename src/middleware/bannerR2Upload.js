const upload = require('./r2Upload');
const uploadToR2 = require('../utils/uploadToR2');

const bannerR2Upload = [
    upload.single('banner'), // ✅ FIXED
    async (req, res, next) => {
        try {
            if (!req.file) return next();

            const uploaded = await uploadToR2(req.file, 'images/banners');
            req.bannerImage = uploaded.url; // CDN URL
            next();
        } catch (error) {
            console.error('Banner R2 Upload Error:', error);
            res.status(500).json({ error: 'Banner upload failed' });
        }
    },
];

module.exports = bannerR2Upload;