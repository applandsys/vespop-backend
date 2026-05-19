const upload = require('./productR2Upload');
const uploadToR2Multiple = require('../utils/uploadToR2Multiple');

const productImagesR2 = [
    upload.fields([{ name: 'image', maxCount: 5 }]),
    async (req, res, next) => {
        try {
            if (!req.files?.image?.length) return next();

            const uploads = [];

            for (const file of req.files.image) {
                const uploaded = await uploadToR2Multiple(file, 'images/products');
                uploads.push(uploaded);
            }

            // Attach CDN images to request
            req.r2Images = uploads;

            next();
        } catch (err) {
            console.error('Product R2 Upload Error:', err);
            return res.status(500).json({ error: 'Product image upload failed' });
        }
    },
];

module.exports = productImagesR2;