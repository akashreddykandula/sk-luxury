import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice'
import { formatPrice } from '../../utils/helpers'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items, subtotal, shipping, total } = useSelector(s => s.cart)

  return (
    <>
      <Helmet><title>Shopping Bag | SK Luxury</title></Helmet>
      <div className="bg-luxury-beige/40 py-4 border-b border-gray-100">
        <div className="page-container">
          <h1 className="font-display text-3xl text-luxury-dark">Shopping Bag</h1>
        </div>
      </div>

      <div className="page-container py-10 md:py-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiShoppingBag size={56} className="text-gray-200 mb-5" />
            <h2 className="font-display text-2xl text-luxury-dark mb-2">Your bag is empty</h2>
            <p className="font-sans text-sm text-luxury-muted mb-8">Discover our luxury collections and find your perfect piece</p>
            <Link to="/collections" className="btn-luxury">Explore Collections</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 mb-4">
                {['Product', '', 'Price', 'Quantity', 'Total'].map((h, i) => (
                  <p key={i} className={`font-sans text-xs tracking-widest uppercase text-luxury-muted ${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-3' : 'col-span-2'}`}>{h}</p>
                ))}
              </div>

              <div className="space-y-6">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item._id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-6 border-b border-gray-100"
                  >
                    <div className="md:col-span-2">
                      <div className="w-20 h-24 bg-luxury-beige overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <Link to={`/product/${item._id}`} className="font-sans text-sm font-medium text-luxury-dark hover:text-gold transition-colors">{item.name}</Link>
                      <div className="flex flex-wrap gap-x-3 mt-1">
                        {item.size && <span className="font-sans text-xs text-luxury-muted">Size: {item.size}</span>}
                        {item.color && <span className="font-sans text-xs text-luxury-muted">Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-sans text-sm text-luxury-dark">{formatPrice(item.price)}</span>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center border border-gray-200 w-fit">
                        <button onClick={() => dispatch(updateQuantity({ id: item._id, size: item.size, color: item.color, quantity: item.quantity - 1 }))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-luxury-beige transition-colors">
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ id: item._id, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-luxury-beige transition-colors">
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button onClick={() => dispatch(removeFromCart({ id: item._id, size: item.size, color: item.color }))}
                        className="p-2 text-luxury-muted hover:text-red-500 transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/collections" className="inline-flex items-center gap-2 mt-6 font-sans text-xs tracking-widest uppercase text-emerald-900 hover:text-gold transition-colors">
                <FiArrowLeft size={13} /> Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white shadow-card p-6 sticky top-24">
                <h2 className="font-display text-2xl text-luxury-dark mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between font-sans text-sm text-luxury-muted">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-luxury-dark">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-luxury-muted">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'text-luxury-dark'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-sans text-xs text-amber-600 bg-amber-50 p-2">Add {formatPrice(999 - subtotal)} more for free shipping!</p>
                  )}
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between font-sans font-semibold text-luxury-dark">
                    <span>Total</span>
                    <span className="text-emerald-900 text-xl font-display">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="btn-luxury w-full text-center block">
                  Proceed to Checkout <FiArrowRight size={14} className="inline ml-1" />
                </Link>
                <div className="flex items-center justify-center gap-3 mt-5">
                  {['Visa', 'Mastercard', 'UPI', 'RuPay'].map(m => (
                    <span key={m} className="font-sans text-[10px] text-luxury-muted border border-gray-200 px-2 py-1">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
