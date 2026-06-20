const express = require ('express');

const router = express.Router ();

const paymentController = require ('../controllers/paymentController');

const {
  createRazorpayOrder,
  verifyPayment,
  paymentFailed,
  getAllTransactions,
} = require ('../controllers/paymentController');
const {protect, admin, optionalAuth} = require ('../middleware/auth');

router.post ('/create-order', optionalAuth, createRazorpayOrder);
router.post ('/verify', optionalAuth, verifyPayment);
router.post ('/failed', optionalAuth, paymentFailed);
router.get ('/transactions', protect, admin, getAllTransactions);
router.post (
  '/webhook',
  express.raw ({type: 'application/json'}),
  paymentController.razorpayWebhook
);

module.exports = router;
