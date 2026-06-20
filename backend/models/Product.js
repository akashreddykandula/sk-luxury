const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: [true, 'Product description is required'] },
  shortDescription: { type: String, default: '' },
  sku: { type: String, unique: true, uppercase: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  collectionType: {
    type: String,
    enum: ['clothing', 'jewellery', 'bridal', 'custom', 'accessories'],
    required: true
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  salePrice: { type: Number, default: 0 },
  isOnSale: { type: Boolean, default: false },
  stock: { type: Number, required: true, default: 0, min: 0 },
  isInStock: { type: Boolean, default: true },

  // Clothing specific
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size', 'Custom'] }],
  colors: [{ name: String, hex: String, stock: Number }],
  fabric: { type: String, default: '' },
  careInstructions: { type: String, default: '' },

  // Jewellery specific
  weight: { type: String, default: '' },
  material: { type: String, default: '' },
  purity: { type: String, default: '' },
  stoneDetails: { type: String, default: '' },
  jewelleryType: { type: String, default: '' },

  // Common
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },

  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  soldCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (!this.sku) {
    this.sku = 'SK-' + Date.now().toString().slice(-6).toUpperCase();
  }
  if (this.reviews && this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  this.isInStock = this.stock > 0;
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, collectionType: 1, isActive: 1 });
productSchema.index({ price: 1, isFeatured: 1, isNewArrival: 1 });

module.exports = mongoose.model('Product', productSchema);
