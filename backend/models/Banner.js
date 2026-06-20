const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  buttonText: String,
  buttonLink: String,
  image: { type: String, required: true },
  publicId: String,
  position: { type: String, enum: ['hero', 'featured', 'promo'], default: 'hero' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
