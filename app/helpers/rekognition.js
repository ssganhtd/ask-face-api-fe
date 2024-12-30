const fs = require('fs');
const { RekognitionClient, CreateCollectionCommand, SearchFacesByImageCommand, ListCollectionsCommand } = require('@aws-sdk/client-rekognition');

const rekognition = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function searchFacesLocalImage(imagePath, collectionId, threshold = 70) {
    try {
        const imageBytes = fs.readFileSync(imagePath);
        const params = {
            CollectionId: collectionId,
            Image: {
                Bytes: imageBytes
            },
            FaceMatchThreshold: threshold,
            MaxFaces: 10
        };

        const command = new SearchFacesByImageCommand(params);
        const data = await rekognition.send(command);
        if (data.FaceMatches && data.FaceMatches.length > 0) {
            const externalImageIds = data.FaceMatches.map(match => match.Face.ExternalImageId);
            return externalImageIds;
        } else {
            console.log("Không tìm thấy khuôn mặt tương đồng.");
            return [];
        }
    } catch (err) {
        console.error("Lỗi searchFaces (ảnh local):", err);
        throw err;
    }
}

async function createCollection(collectionId) {
    try {
        const listCommand = new ListCollectionsCommand({});
        const data = await rekognition.send(listCommand);
        if (data.CollectionIds.includes(collectionId)) {
            console.log(`Collection ${collectionId} đã tồn tại.`);
            return;
        }

        const params = {
            CollectionId: collectionId,
        };
        const command = new CreateCollectionCommand(params);
        const createData = await rekognition.send(command);
        console.log(`Đã tạo Collection ${collectionId}:`, createData);
    } catch (error) {
        console.error("Lỗi tạo Collection:", error);
        throw error;
    }
}

async function searchFaces(collectionId, imageBytes) {
    try {
        const params = {
            CollectionId: collectionId,
            Image: {
                Bytes: imageBytes,
            },
            FaceMatchThreshold: 70,
            MaxFaces: 10,
        };
        const command = new SearchFacesByImageCommand(params);
        const data = await rekognition.send(command);
        return data;
    } catch (error) {
        console.error("Lỗi tìm kiếm khuôn mặt:", error);
        throw error;
    }
}

module.exports = { createCollection, searchFaces, searchFacesLocalImage };