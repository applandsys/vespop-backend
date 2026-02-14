const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;

        if (file.fieldname === 'image') {
            uploadPath = 'public/images/categories';
        } else if (file.fieldname === 'icon') {
            uploadPath = 'public/icons/categories/icons';
        } else {
            uploadPath = 'public/uploads/'; // fallback
        }

        // Ensure folder exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = upload;
