const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendOrderCancellationEmail } = require('../utils/email');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, pricing, paymentMethod, guestInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }
    if (!shippingAddress || !pricing) {
      return res.status(400).json({ success: false, message: 'Shipping address and pricing are required' });
    }

    const order = await Order.create({
      user: req.user ? req.user._id : null,
      guestInfo,
      items,
      shippingAddress,
      pricing,
      paymentInfo: { method: paymentMethod || 'razorpay' },
      statusHistory: [{ status: 'pending', message: 'Order placed' }]
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Failed to create order. Please try again.' });
  }
};

// Called after payment verification succeeds - updates stock and sends confirmation email
exports.finalizeOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    // Update stock and sold count (only once, on successful payment)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { soldCount: item.quantity, stock: -item.quantity } });
    }

    sendOrderConfirmationEmail(order).catch(err => console.error('Order confirmation email failed:', err.message));
  } catch (error) {
    console.error('Finalize order error:', error.message);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load orders' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user && req.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.json({ success: true, order });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to load order' });
  }
};

// Track order by order number + email (for guest tracking, no auth needed)
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber, email } = req.body;
    if (!orderNumber || !email) {
      return res.status(400).json({ success: false, message: 'Order number and email are required' });
    }
    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase().trim(),
      $or: [
        { 'shippingAddress.email': email.toLowerCase().trim() },
        { 'guestInfo.email': email.toLowerCase().trim() }
      ]
    }).populate('items.product', 'name images slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found with these details. Please check and try again.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
};

// Customer cancels their own order
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user && req.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['shipped', 'delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled as it is already ${order.orderStatus}` });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { soldCount: -item.quantity, stock: item.quantity } });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by customer';
    order.cancelledBy = 'customer';
    order.statusHistory.push({ status: 'cancelled', message: reason || 'Order cancelled by customer' });
    await order.save();

    sendOrderCancellationEmail(order).catch(err => console.error('Cancellation email failed:', err.message));

    res.json({ success: true, order, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load orders' });
  }
};

const ESTIMATED_DAYS_BY_STATUS = {
  confirmed: 7, processing: 5, shipped: 2, delivered: 0
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, message, trackingNumber, courier, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, message: message || `Status updated to ${status}` });
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courier) order.courier = courier;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancelledBy = 'admin';
      order.cancellationReason = message || 'Cancelled by admin';
    }

    await order.save();

    if (status === 'cancelled') {
      sendOrderCancellationEmail(order).catch(err => console.error('Cancellation email failed:', err.message));
    } else {
      sendOrderStatusUpdateEmail(order, status, message).catch(err => console.error('Status update email failed:', err.message));
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        ordersByStatus,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load dashboard stats' });
  }
};
