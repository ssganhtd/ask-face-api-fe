const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Cấu hình multer
const storage = multer.diskStorage({
    destination: './storage',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File không phải là ảnh!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
}).single('faceImage');

// Route upload
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File quá lớn (tối đa 5MB)!' });
            }
            if (err.message === 'File không phải là ảnh!') {
                return res.status(400).json({ success: false, message: 'File không phải là ảnh!' });
            }
            return res.status(500).json({ success: false, message: 'Lỗi server!' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn file!' });
        }

        // Xử lý logic khi upload thành công
        const tempImageUrl = `${req.file.filename}`; // Đường dẫn tạm thời
        res.status(200).json({ success: true, tempImageUrl, message: 'Upload thành công!' });
    });
});

// Middleware xử lý lỗi chung
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Lỗi server!' });
});

module.exports = router;