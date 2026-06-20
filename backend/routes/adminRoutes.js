const express = require('express');
const router = express.Router();
const { getDashboard, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboard);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/toggle', protect, admin, toggleUserStatus);

module.exports = router;
