const Product = require ('../models/Product');

exports.getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    collectionType,
    search,
    sort,
    minPrice,
    maxPrice,
    sizes,
    colors,
    isFeatured,
    isNewArrival,
    isBestSeller,
  } = req.query;

  const query = {isActive: true};

  if (category) query.category = category;
  if (collectionType) query.collectionType = collectionType;
  if (isFeatured === 'true') query.isFeatured = true;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number (minPrice);
    if (maxPrice) query.price.$lte = Number (maxPrice);
  }
  if (sizes) query.sizes = {$in: sizes.split (',')};
  if (search) query.$text = {$search: search};

  let sortObj = {createdAt: -1};
  if (sort === 'price_asc') sortObj = {price: 1};
  else if (sort === 'price_desc') sortObj = {price: -1};
  else if (sort === 'popular') sortObj = {soldCount: -1};
  else if (sort === 'rating') sortObj = {rating: -1};

  const total = await Product.countDocuments (query);
  const products = await Product.find (query)
    .populate ('category', 'name slug')
    .sort (sortObj)
    .skip ((page - 1) * limit)
    .limit (Number (limit))
    .select ('-reviews');

  res.json ({
    success: true,
    products,
    pagination: {
      page: Number (page),
      limit: Number (limit),
      total,
      pages: Math.ceil (total / limit),
    },
  });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findOne ({
    $or: [
      {slug: req.params.id},
      {_id: req.params.id.match (/^[0-9a-fA-F]{24}$/) ? req.params.id : null},
    ],
    isActive: true,
  }).populate ('category', 'name slug');

  if (!product)
    return res
      .status (404)
      .json ({success: false, message: 'Product not found'});
  product.viewCount += 1;
  await product.save ({validateBeforeSave: false});
  res.json ({success: true, product});
};

exports.createProduct = async (req, res) => {
  const data = {...req.body};

  if (!data.category) {
    delete data.category;
  }

  const product = await Product.create (data);

  res.status (201).json ({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate (req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product)
    return res
      .status (404)
      .json ({success: false, message: 'Product not found'});
  res.json ({success: true, product});
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate (
    req.params.id,
    {isActive: false},
    {new: true}
  );
  if (!product)
    return res
      .status (404)
      .json ({success: false, message: 'Product not found'});
  res.json ({success: true, message: 'Product deleted'});
};

exports.addReview = async (req, res) => {
  const {rating, comment} = req.body;
  const product = await Product.findById (req.params.id);
  if (!product)
    return res
      .status (404)
      .json ({success: false, message: 'Product not found'});

  const alreadyReviewed = product.reviews.find (
    r => r.user.toString () === req.user._id.toString ()
  );
  if (alreadyReviewed)
    return res
      .status (400)
      .json ({success: false, message: 'Product already reviewed'});

  product.reviews.push ({
    user: req.user._id,
    name: req.user.name,
    rating: Number (rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce ((acc, r) => acc + r.rating, 0) /
    product.reviews.length;
  await product.save ();
  res.status (201).json ({success: true, message: 'Review added'});
};

exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find ({isFeatured: true, isActive: true})
    .populate ('category', 'name')
    .limit (8)
    .select ('-reviews');
  res.json ({success: true, products});
};

exports.getNewArrivals = async (req, res) => {
  const products = await Product.find ({isNewArrival: true, isActive: true})
    .populate ('category', 'name')
    .sort ({createdAt: -1})
    .limit (8)
    .select ('-reviews');
  res.json ({success: true, products});
};

exports.getBestSellers = async (req, res) => {
  const products = await Product.find ({isBestSeller: true, isActive: true})
    .populate ('category', 'name')
    .sort ({soldCount: -1})
    .limit (8)
    .select ('-reviews');
  res.json ({success: true, products});
};

exports.searchProducts = async (req, res) => {
  const {q} = req.query;
  if (!q) return res.json ({success: true, products: []});
  const products = await Product.find ({
    isActive: true,
    $or: [
      {name: {$regex: q, $options: 'i'}},
      {description: {$regex: q, $options: 'i'}},
      {tags: {$in: [new RegExp (q, 'i')]}},
    ],
  })
    .populate ('category', 'name')
    .limit (20)
    .select ('name images price salePrice isOnSale slug category');
  res.json ({success: true, products});
};
