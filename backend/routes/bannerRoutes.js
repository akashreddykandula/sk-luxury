const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner, getAllBanners } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getBanners);
router.get('/all', protect, admin, getAllBanners);
router.post('/', protect, admin, createBanner);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;
