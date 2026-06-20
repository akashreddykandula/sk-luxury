const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { finalizeOrder } = require('./orderController');



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: 100, // paise
      currency: 'INR',
      receipt: `sk_${orderId || Date.now()}`,
      notes: { orderId: orderId?.toString() || '' }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
  console.error("========== RAZORPAY ERROR ==========");
  console.error(error);
  console.error("Message:", error?.message);
  console.error("Status:", error?.statusCode);
  console.error("Response:", error?.error);
  console.error("===================================");

  res.status(500).json({
    success: false,
    message: error?.message || "Failed to initiate payment"
  });
}
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification details' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.status': 'paid',
        'paymentInfo.razorpayOrderId': razorpay_order_id,
        'paymentInfo.razorpayPaymentId': razorpay_payment_id,
        'paymentInfo.razorpaySignature': razorpay_signature,
        'paymentInfo.paidAt': new Date(),
        orderStatus: 'confirmed',
        $push: { statusHistory: { status: 'confirmed', message: 'Payment received and order confirmed' } }
      });

      // Update stock + send confirmation email (non-blocking but awaited for stock accuracy)
      await finalizeOrder(orderId);
    }

    res.json({ success: true, message: 'Payment verified successfully', paymentId: razorpay_payment_id });
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ success: false, message: 'Payment verification failed. Please contact support with your order ID.' });
  }
};

exports.paymentFailed = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.status': 'failed',
        $push: { statusHistory: { status: 'pending', message: 'Payment failed' } }
      });
    }
    res.json({ success: true, message: 'Payment failure recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record payment failure' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const orders = await Order.find({ 'paymentInfo.status': { $ne: 'pending' } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .select('orderNumber pricing paymentInfo createdAt user guestInfo');
    res.json({ success: true, transactions: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load transactions' });
  }
};


exports.razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac ('sha256', webhookSecret)
      .update (req.body)
      .digest ('hex');

    if (signature !== expectedSignature) {
      return res.status (400).json ({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = JSON.parse (req.body.toString ());

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;

      const order = await Order.findOne ({
        'paymentInfo.razorpayOrderId': payment.order_id,
      });

      if (order) {
        await Order.findByIdAndUpdate (order._id, {
          'paymentInfo.status': 'paid',
          'paymentInfo.razorpayPaymentId': payment.id,
          orderStatus: 'confirmed',
        });

        await finalizeOrder (order._id);
      }
    }

    res.status (200).json ({success: true});
  } catch (error) {
    console.error ('Webhook Error:', error);
    res.status (500).json ({success: false});
  }
};
