const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  addReview, getFeaturedProducts, getNewArrivals, getBestSellers, searchProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Protected
router.post('/:id/reviews', protect, addReview);

// Admin
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
