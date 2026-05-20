const { PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const r2Client = require('../config/r2Client');

const uploadToR2 = async (file, folder = 'uploads') => {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await r2Client.send(command);

    return {
        key,
        url: `${process.env.R2_PUBLIC_URL}/${key}`,
    };
};

module.exports = uploadToR2;