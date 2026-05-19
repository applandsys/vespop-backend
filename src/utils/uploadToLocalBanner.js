const fs = require('fs');
const path = require('path');

const sanitizeFileName = (originalName) => {
    return (
        Date.now() +
        '-' +
        originalName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9.-]/g, '')
    );
};

const uploadToLocalBanner = async (file) => {
    const uploadDir = path.join(process.cwd(), 'public/images/banners');
    fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = sanitizeFileName(file.originalname);
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return {
        fileName,
        url: `/public/images/banners/${fileName}`,
    };
};

module.exports = uploadToLocalBanner;