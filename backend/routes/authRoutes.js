const express = require('express');
const router = express.Router();
const {
  register, login, getProfile, updateProfile, addAddress, deleteAddress,
  updatePassword, toggleWishlist, forgotPassword, resetPassword, verifyResetToken
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/reset-password/:token/verify', verifyResetToken);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
