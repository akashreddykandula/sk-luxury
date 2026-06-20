const express = require('express');
const router = express.Router();
const { uploadImages, uploadSingleImage, deleteImage, uploadMiddleware, singleUploadMiddleware } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

router.post('/images', protect, admin, uploadMiddleware, uploadImages);
router.post('/image', protect, admin, singleUploadMiddleware, uploadSingleImage);
router.delete('/image', protect, admin, deleteImage);

module.exports = router;
