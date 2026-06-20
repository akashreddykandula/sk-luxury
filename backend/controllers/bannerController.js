const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
  const { position } = req.query;
  const query = { isActive: true };
  if (position) query.position = position;
  const banners = await Banner.find(query).sort({ sortOrder: 1 });
  res.json({ success: true, banners });
};

exports.createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
};

exports.updateBanner = async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
  res.json({ success: true, banner });
};

exports.deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Banner deleted' });
};

exports.getAllBanners = async (req, res) => {
  const banners = await Banner.find().sort({ sortOrder: 1 });
  res.json({ success: true, banners });
};
