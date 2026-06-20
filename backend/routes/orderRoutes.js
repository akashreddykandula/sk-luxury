const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus,
  getDashboardStats, cancelOrder, trackOrder
} = require('../controllers/orderController');
const { protect, admin, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.post('/track', trackOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.get('/all', protect, admin, getAllOrders);
router.get('/:id', optionalAuth, getOrder);
router.put('/:id/cancel', optionalAuth, cancelOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
