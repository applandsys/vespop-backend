const upload = require('./r2Upload');
const uploadToR2 = require('../utils/uploadToR2');

const categoryR2Upload = [
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'icon', maxCount: 1 },
    ]),
    async (req, res, next) => {
        try {
            req.uploadedFiles = {};

            if (req.files?.image) {
                const image = await uploadToR2(req.files.image[0], 'categories/images');
                req.uploadedFiles.image = image.url;
            }

            if (req.files?.icon) {
                const icon = await uploadToR2(req.files.icon[0], 'categories/icons');
                req.uploadedFiles.icon = icon.url;
            }

            next();
        } catch (err) {
            console.error('R2 Upload Error:', err);
            res.status(500).json({ error: 'File upload failed' });
        }
    },
];

module.exports = categoryR2Upload;