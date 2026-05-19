const upload = require('./r2Upload');
const uploadToR2 = require('../utils/uploadToR2');
const fs = require('fs');
const path = require('path');

const brandR2LogoUpload = [
    upload.single('image'), // ✅ FIX: use correct field name
    async (req, res, next) => {
        try {
            if (!req.file) return next();

            let uploaded;

            try {
                // ✅ Upload to R2
                uploaded = await uploadToR2(req.file, 'images/brands');
                req.brandLogo = uploaded.url;
            } catch (r2Error) {
                console.error('R2 failed, using fallback local upload:', r2Error);

                // 🔁 LOCAL FALLBACK
                const fallbackPath = path.join(
                    'public/images/brands',
                    `${Date.now()}-${req.file.originalname}`
                );

                fs.mkdirSync('public/images/brands', { recursive: true });

                fs.writeFileSync(fallbackPath, req.file.buffer);

                req.brandLogo = `${process.env.BASE_URL}/images/brands/${path.basename(fallbackPath)}`;
            }

            next();
        } catch (error) {
            console.error('Brand Upload Error:', error);

            return res.status(500).json({
                success: false,
                message: 'Brand upload failed',
            });
        }
    },
];

module.exports = brandR2LogoUpload;