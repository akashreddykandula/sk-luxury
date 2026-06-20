const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Guest order support
  guestInfo: {
    name: String,
    email: String,
    phone: String
  },
  
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    color: String,
    sku: String
  }],

  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  pricing: {
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },

  paymentInfo: {
    method: { type: String, enum: ['razorpay', 'cod', 'upi'], default: 'razorpay' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },

  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },

  statusHistory: [{
    status: String,
    message: String,
    updatedAt: { type: Date, default: Date.now }
  }],

  trackingNumber: String,
  courier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: { type: String, enum: ['customer', 'admin', null], default: null },
  notes: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'SK' + Date.now().toString().slice(-8).toUpperCase();
  }
  if (!this.estimatedDelivery && this.isNew) {
    // Default estimate: 7 business days from order creation
    const days = this.items?.length > 0 ? 7 : 7;
    this.estimatedDelivery = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
