import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiShoppingBag, FiHeart, FiShare2, FiStar, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchProduct } from '../../store/slices/productSlice'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleWishlist } from '../../store/slices/authSlice'
import { openCart } from '../../store/slices/uiSlice'
import { addRecentlyViewed } from '../../store/slices/recentlyViewedSlice'
import { formatPrice, getDiscount, getImageUrl } from '../../utils/helpers'
import { productEnquiry, customOrderEnquiry } from '../../utils/whatsapp'
import RecentlyViewed from '../../components/product/RecentlyViewed'
import RelatedProducts from '../../components/product/RelatedProducts'
import toast from 'react-hot-toast'
import api from '../../utils/api';

export default function ProductDetailPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { currentProduct: product, loading } = useSelector(s => s.products)
  const { user } = useSelector(s => s.auth)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    dispatch(fetchProduct(slug))
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '')
      setSelectedColor(product.colors?.[0]?.name || '')
      setSelectedImage(0)
      dispatch(addRecentlyViewed({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        price: product.price,
        salePrice: product.salePrice,
        isOnSale: product.isOnSale,
        category: product.category,
        collectionType: product.collectionType,
      }))
    }
  }, [product])

  if (loading) return (
    <div className="page-container py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="skeleton aspect-[3/4] w-full rounded-lg" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className={`skeleton h-${i === 0 ? 8 : 4} rounded w-${i % 2 === 0 ? 'full' : '2/3'}`} />)}
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="font-display text-2xl text-luxury-dark mb-4">Product not found</p>
      <Link to="/collections" className="btn-luxury">Browse Collections</Link>
    </div>
  )

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/600x800?text=SK+Luxury' }]
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
  const discount = getDiscount(product.price, product.salePrice)
  const isWishlisted = user?.wishlist?.includes(product._id)

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) { toast.error('Please select a size'); return }
    dispatch(addToCart({
      _id: product._id, name: product.name, price: product.price,
      salePrice: product.salePrice, isOnSale: product.isOnSale,
      image: images[0]?.url, size: selectedSize, color: selectedColor, quantity
    }))
    dispatch(openCart())
    toast.success('Added to bag!')
  }

  const submitReview = async () => {
    if (!user) {
      toast.error('Please login to review')
      return
    }

    if (!reviewComment.trim()) {
      toast.error('Please enter a review')
      return
    }

    try {
      setReviewLoading(true)
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      })
      toast.success('Review submitted successfully')
      setReviewComment('')
      setReviewRating(5)
      dispatch(fetchProduct(slug))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details & Care' },
    { id: 'reviews', label: `Reviews (${product.numReviews || 0})` },
  ]

  return (
    <>
      <Helmet>
        <title>{product.name} | SK Luxury</title>
        <meta name="description" content={product.shortDescription || product.description?.slice(0, 160)} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-luxury-beige/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="page-container py-3 px-4 whitespace-nowrap">
          <nav className="flex items-center gap-2 font-sans text-xs text-luxury-muted">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <FiChevronRight size={12} className="flex-shrink-0" />
            <Link to="/collections" className="hover:text-gold transition-colors">Collections</Link>
            <FiChevronRight size={12} className="flex-shrink-0" />
            <Link to={`/collections/${product.collectionType}`} className="hover:text-gold transition-colors capitalize">{product.collectionType}</Link>
            <FiChevronRight size={12} className="flex-shrink-0" />
            <span className="text-luxury-dark truncate max-w-[150px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="page-container py-6 md:py-16 px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Images Section */}
          <div className="flex flex-col gap-3">
            {/* Main Image View */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-luxury-beige aspect-[3/4] w-full rounded-lg md:cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-100"
                style={
                  zoom
                    ? {
                        transform: 'scale(2)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : {}
                }
              />

              {product.isOnSale && discount > 0 && (
                <span className="absolute top-3 left-3 luxury-badge badge-sale text-xs px-2 py-0.5">
                  -{discount}%
                </span>
              )}

              {product.isNewArrival && (
                <span className="absolute top-3 right-3 luxury-badge badge-new text-xs px-2 py-0.5">
                  New
                </span>
              )}
            </motion.div>

            {/* Thumbnails Below with horizontal scrolling on touch screens */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden border-2 transition-all snap-start rounded ${
                    i === selectedImage
                      ? 'border-gold'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Specifications Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col justify-center">
            <p className="font-sans text-[10px] sm:text-xs text-luxury-muted tracking-widest uppercase mb-1.5">
              {product.category?.name} · SKU: {product.sku}
            </p>
            <h1 className="font-display text-xl sm:text-2xl md:text-4xl text-luxury-dark leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating Row */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={12} className={i < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="font-sans text-xs text-luxury-muted">({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price Tags */}
            <div className="flex flex-wrap items-baseline gap-2 mb-5">
              <span className="font-display text-2xl sm:text-3xl text-emerald-900">{formatPrice(displayPrice)}</span>
              {product.isOnSale && product.salePrice && (
                <span className="font-sans text-sm sm:text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {discount > 0 && (
                <span className="font-sans text-xs sm:text-sm text-red-500 font-medium">{discount}% Off</span>
              )}
            </div>

            <div className="w-full h-px bg-gray-100 mb-5" />

            {/* Colors Picker */}
            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="luxury-label text-xs">Color: <span className="text-luxury-dark normal-case tracking-normal font-normal">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.colors.map(c => (
                    <button key={c.name} title={c.name} onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-105 ${selectedColor === c.name ? 'border-emerald-900 scale-105' : 'border-gray-200'}`}
                      style={{ backgroundColor: c.hex || '#ccc' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="luxury-label text-xs">Size: <span className="text-luxury-dark normal-case tracking-normal font-normal">{selectedSize}</span></p>
                  <button className="font-sans text-xs text-gold underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 border font-sans text-xs transition-all duration-200 rounded ${selectedSize === s ? 'border-emerald-900 bg-emerald-900 text-white' : 'border-gray-200 text-luxury-dark hover:border-emerald-900'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-5">
              <p className="luxury-label text-xs">Quantity</p>
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-fit mt-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-luxury-beige transition-colors">
                  <FiMinus size={12} />
                </button>
                <span className="w-10 text-center font-sans text-sm">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-luxury-beige transition-colors">
                  <FiPlus size={12} />
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="font-sans text-[11px] text-amber-600 mt-1.5">Only {product.stock} left in stock!</p>
              )}
            </div>

            {/* Action buttons (Bag, Wishlist, Share) */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.isInStock}
                className={`flex-1 h-11 text-xs btn-luxury justify-center rounded gap-2 ${
                  !product.isInStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiShoppingBag size={14} />
                {product.isInStock ? 'Add to Bag' : 'Out of Stock'}
              </button>

              <button
                onClick={() => {
                  user ? dispatch(toggleWishlist(product._id)) : toast.error('Please login')
                }}
                className={`h-11 w-11 border flex items-center justify-center transition-all rounded ${
                  isWishlisted
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-gray-200 text-luxury-dark hover:border-gold hover:text-gold'
                }`}
              >
                <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() =>
                  navigator.share?.({
                    title: product.name,
                    url: window.location.href,
                  }).catch(() => {})
                }
                className="h-11 w-11 border border-gray-200 flex items-center justify-center text-luxury-dark hover:border-gold hover:text-gold transition-all rounded"
              >
                <FiShare2 size={16} />
              </button>
            </div>

            {/* Chat Action Links */}
            <div className="flex flex-col gap-2 mb-5">
              <button onClick={() => productEnquiry(product)}
                className="flex-1 flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] py-2.5 rounded font-sans text-[11px] tracking-widest uppercase hover:bg-[#25D366] hover:text-white transition-all duration-300">
                <FaWhatsapp size={14} /> Enquire on WhatsApp
              </button>
              <button onClick={() => customOrderEnquiry(product)}
                className="flex-1 flex items-center justify-center gap-2 border border-emerald-900 text-emerald-900 py-2.5 rounded font-sans text-[11px] tracking-widest uppercase hover:bg-emerald-900 hover:text-white transition-all duration-300">
                Custom Order
              </button>
            </div>

            {/* Highlights Bar */}
            <div className="grid grid-cols-3 gap-1 py-4 border-y border-gray-100 text-center">
              {[
                { icon: '🔒', label: 'Secure Payment' },
                { icon: '📦', label: 'Fast Shipping' },
                { icon: '↩️', label: '7-Day Returns' },
              ].map(g => (
                <div key={g.label}>
                  <p className="text-base mb-0.5">{g.icon}</p>
                  <p className="font-sans text-[10px] sm:text-xs text-luxury-muted scale-95">{g.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabbed Navigation Layout */}
        <div className="mt-12">
          <div className="grid grid-cols-3 border-b border-gray-200 mb-5">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 text-center font-sans text-[11px] sm:text-xs tracking-wide uppercase transition-all ${activeTab === tab.id ? 'border-b-2 border-gold text-gold font-medium' : 'text-luxury-muted hover:text-luxury-dark'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none px-1">
              <p className="font-sans text-xs sm:text-sm md:text-base text-luxury-muted leading-7 whitespace-pre-line break-words">{product.description}</p>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-luxury-dark mb-3">Product Details</h3>
                  <table className="w-full text-xs sm:text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ['SKU', product.sku],
                        ['Category', product.category?.name],
                        ['Collection', product.collectionType],
                        ...(product.collectionType === 'clothing' ? [
                          ['Fabric', product.fabric],
                          ['Available Sizes', product.sizes?.join(', ')],
                        ] : [
                          ['Material', product.material],
                          ['Weight', product.weight],
                          ['Purity', product.purity],
                          ['Stone Details', product.stoneDetails],
                        ]),
                      ].filter(([, v]) => v).map(([k, v]) => (
                        <tr key={k}>
                          <td className="py-2 font-sans text-[10px] sm:text-xs text-luxury-muted tracking-widest uppercase w-28 sm:w-36">{k}</td>
                          <td className="py-2 font-sans text-luxury-dark">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(product.careInstructions || product.jewelleryType) && (
                  <div>
                    <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-luxury-dark mb-3">Care Instructions</h3>
                    <p className="font-sans text-xs sm:text-sm text-luxury-muted leading-relaxed">{product.careInstructions}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1 space-y-6">
              {product.reviews?.length === 0 ? (
                <p className="font-sans text-xs sm:text-sm text-luxury-muted text-center py-6">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {product.reviews?.map((r, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-8 h-8 rounded bg-emerald-900 flex items-center justify-center flex-shrink-0">
                          <span className="font-sans text-white text-xs font-bold">{r.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-sans text-xs sm:text-sm font-semibold text-luxury-dark">{r.name}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, j) => <FiStar key={j} size={9} className={j < r.rating ? 'text-gold fill-gold' : 'text-gray-200'} fill={j < r.rating ? 'currentColor' : 'none'} />)}
                          </div>
                        </div>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-luxury-muted leading-relaxed pl-1">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Review Creator Form inside the active context */}
              <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-lg mt-6">
                <h3 className="font-display text-lg sm:text-xl text-luxury-dark mb-3">
                  Write a Review
                </h3>

                <div className="mb-3">
                  <label className="luxury-label text-xs">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="luxury-input text-xs sm:text-sm h-10 mt-1"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="luxury-label text-xs">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="luxury-input text-xs sm:text-sm h-24 mt-1 resize-none"
                    placeholder="Share your experience..."
                  />
                </div>

                <button
                  onClick={submitReview}
                  disabled={reviewLoading}
                  className="btn-luxury w-full sm:w-auto h-11 text-xs px-6 rounded justify-center"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <RelatedProducts categoryId={product.category?._id} collectionType={product.collectionType} excludeId={product._id} />
      <RecentlyViewed excludeId={product._id} />
    </>
  )
}