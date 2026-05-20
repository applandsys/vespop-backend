const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

module.exports = async function deleteFromR2(fileUrl) {
    if (!fileUrl) return;

    // Extract key from CDN URL
    // https://cdn.domain.com/images/products/abc.jpg → images/products/abc.jpg
    const key = fileUrl.replace(`${process.env.R2_PUBLIC_URL}/`, '');

    await s3.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        })
    );
};