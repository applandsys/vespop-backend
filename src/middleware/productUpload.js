const multer = require('multer');
const fs = require('fs');

// Dynamic storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/images/products';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const productUpload = multer({ storage });

module.exports = productUpload;
