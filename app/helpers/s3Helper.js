const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * List objects in an S3 bucket with a specific prefix.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} prefix - The prefix to filter objects.
 * @returns {Promise<Object>} - The list of objects.
 */
const listObjects = async (bucketName, prefix) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
        });
        const data = await s3Client.send(command);
        return data;
    } catch (error) {
        console.error("Lỗi khi list object:", error);
        throw error;
    }
};

module.exports = { listObjects };
