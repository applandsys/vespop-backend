const multer = require('multer');
const uploadToR2 = require('../utils/uploadToR2');
const uploadToLocalBanner = require('../utils/uploadToLocalBanner');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

const bannerUploadWithFallback = [
    upload.single('image'),
    async (req, res, next) => {
        try {
            if (!req.file) return next();

            // Try Cloudflare R2 first
            try {
                const uploaded = await uploadToR2(req.file, 'images/banners');
                req.bannerImage = uploaded.url;
                req.uploadSource = 'r2';
                return next();
            } catch (r2Error) {
                console.error('R2 failed, falling back to local:', r2Error);
            }

            // Fallback to local upload
            const local = await uploadToLocalBanner(req.file);
            req.bannerImage = local.url;
            req.uploadSource = 'local';

            next();
        } catch (error) {
            console.error('Banner Upload Error:', error);
            res.status(500).json({ error: 'Banner upload failed completely' });
        }
    },
];

module.exports = bannerUploadWithFallback;