const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json({ success: true, categories });
};

exports.getCategory = async (req, res) => {
  const category = await Category.findOne({
    $or: [{ slug: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    isActive: true
  });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
};

exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Category deleted' });
};
