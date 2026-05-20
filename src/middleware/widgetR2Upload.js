const upload = require('./r2Upload');
const uploadToR2 = require('../utils/uploadToR2');

const widgetR2Upload = [
    upload.single('image'),
    async (req, res, next) => {
        try {
            if (!req.file) return next();

            const uploaded = await uploadToR2(req.file, 'images/widget');
            req.widgetImage = uploaded.url;
            next();
        } catch (error) {
            console.error('Widget R2 Upload Error:', error);
            res.status(500).json({ error: 'Banner upload failed' });
        }
    },
];

module.exports = widgetR2Upload;