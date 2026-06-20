const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

exports.getDashboard = async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, totalCategories] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Category.countDocuments({ isActive: true })
  ]);

  const revenueData = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'paid' } },
    { $group: { _id: null, total: { $sum: '$pricing.total' } } }
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email').sort({ createdAt: -1 }).limit(10);

  const topProducts = await Product.find({ isActive: true })
    .sort({ soldCount: -1 }).limit(5).select('name images price soldCount');

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    dashboard: {
      totalProducts, totalOrders, totalUsers, totalCategories,
      totalRevenue: revenueData[0]?.total || 0,
      recentOrders, topProducts, ordersByStatus
    }
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
  res.json({ success: true, users });
};

exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, user });
};
