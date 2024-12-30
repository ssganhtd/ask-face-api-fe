const express = require('express');
const path = require('path');
const router = express.Router();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { searchFacesLocalImage } = require('../helpers/rekognition');
const eventModel = require('../models/event.model');
const { listObjects } = require('../helpers/s3Helper');

// Route: Lấy danh sách collection
router.get("/collection", async (req, res) => {
    try {
        const rs = await getCollection('event', req.body);
        if (rs.code === 'success') {
            return res.json({ success: true, events: rs.data, total: rs.total });
        }
        res.status(400).json({ success: false, message: rs.message || "Lỗi khi lấy dữ liệu collection" });
    } catch (error) {
        console.error("Lỗi /collection:", error);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
});

// Route: Lấy thông tin sự kiện theo mã
router.get("/:code", async (req, res) => {
    try {
        const code = req.params.code;
        const data = await eventModel.findOne({ code });
        if (data) {
            return res.json({ success: true, data });
        }
        res.status(404).json({ success: false, message: "Không tìm thấy event" });
    } catch (error) {
        console.error("Lỗi /:code:", error);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
});

// Route: Lấy danh sách ảnh của sự kiện
router.get("/:code/photos", async (req, res) => {
    try {
        const { code: eventCode } = req.params;
        const { page = 1, filterFaces = 'false', faceImage } = req.query;
        const pageSize = 48;

        const bucketName = `anhsukien-${eventCode}`;
        const s3Objects = await listObjects(bucketName, 'thumb');

        // Lọc bỏ các object không phải file ảnh và chỉ lấy tên file
        let photos = s3Objects.Contents
            ? s3Objects.Contents
                .map(obj => path.basename(obj.Key)) // Chỉ lấy tên file
                .filter(name => /\.(jpg|jpeg|png|gif)$/i.test(name)) // Kiểm tra định dạng ảnh
            : [];

        if (filterFaces === 'true' && faceImage) {
            const filePath = path.join(__dirname, '../../storage', faceImage);
            try {
                photos = await searchFacesLocalImage(filePath, eventCode);
            } catch (error) {
                console.error("Lỗi khi tìm ảnh", error);
                return res.status(400).json({ success: false, message: 'Lỗi xử lý ảnh.' });
            }
        }

        const totalPages = Math.ceil(photos.length / pageSize);
        const paginatedPhotos = photos.slice((page - 1) * pageSize, page * pageSize);

        res.json({
            success: true,
            buckedUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
            photos: paginatedPhotos, // Chỉ trả về tên file ảnh
            totalPages,
            currentPage: parseInt(page, 10)
        });
    } catch (error) {
        console.error("Lỗi /:code/photos:", error);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
});


module.exports = router;
