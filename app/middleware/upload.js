const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage }); // Remove .single here

module.exports = upload;