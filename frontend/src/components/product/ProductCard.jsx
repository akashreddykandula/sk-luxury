import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleWishlist } from '../../store/slices/authSlice'
import { openCart } from '../../store/slices/uiSlice'
import { formatPrice, getDiscount, getImageUrl } from '../../utils/helpers'
import { productEnquiry } from '../../utils/whatsapp'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)

  const primaryImage = getImageUrl(product.images)
  const secondaryImage = product.images?.[1]?.url || primaryImage
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
  const discount = getDiscount(product.price, product.salePrice)
  const isWishlisted = user?.wishlist?.includes(product._id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      isOnSale: product.isOnSale,
      image: primaryImage,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0]?.name || '',
      quantity: 1
    }))
    dispatch(openCart())
    toast.success('Added to bag!')
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to save items'); return }
    dispatch(toggleWishlist(product._id))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  const productUrl = `/product/${product.slug || product._id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="product-card"
    >
      <Link to={productUrl}>
        {/* Image Container */}
        <div className="product-card-image">
          <img src={primaryImage} alt={product.name} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            onMouseEnter={e => e.currentTarget.src = secondaryImage}
            onMouseLeave={e => e.currentTarget.src = primaryImage}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && <span className="luxury-badge badge-new">New</span>}
            {product.isBestSeller && <span className="luxury-badge badge-trending">Best Seller</span>}
            {product.isOnSale && discount > 0 && <span className="luxury-badge badge-sale">-{discount}%</span>}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button onClick={handleWishlist}
              className={`w-9 h-9 bg-white flex items-center justify-center shadow-md hover:bg-gold hover:text-white transition-all duration-200 ${isWishlisted ? 'text-red-500' : 'text-luxury-dark'}`}>
              <FiHeart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button onClick={e => { e.preventDefault(); productEnquiry(product) }}
              className="w-9 h-9 bg-white flex items-center justify-center shadow-md hover:bg-[#25D366] hover:text-white transition-all duration-200 text-luxury-dark">
              <FaWhatsapp size={15} />
            </button>
          </div>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-900 text-luxury-cream py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 w-full font-sans text-xs tracking-widest uppercase">
              <FiShoppingBag size={13} /> Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-sans text-xs text-luxury-muted tracking-widest uppercase mb-1">
            {product.category?.name || product.collectionType}
          </p>
          <h3 className="font-sans text-sm text-luxury-dark font-medium line-clamp-2 leading-snug mb-2 group-hover:text-emerald-900 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-sans text-base font-semibold text-emerald-900">{formatPrice(displayPrice)}</span>
            {product.isOnSale && product.salePrice && (
              <span className="font-sans text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.colors.slice(0, 5).map(c => (
                <span key={c.name} title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200 cursor-pointer hover:scale-125 transition-transform"
                  style={{ backgroundColor: c.hex || '#ccc' }} />
              ))}
              {product.colors.length > 5 && <span className="font-sans text-xs text-luxury-muted">+{product.colors.length - 5}</span>}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
