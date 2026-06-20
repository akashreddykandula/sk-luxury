import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { closeCart } from '../../store/slices/uiSlice'
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice'
import { formatPrice } from '../../utils/helpers'

export default function CartSidebar() {
  const dispatch = useDispatch()
  const { cartOpen } = useSelector(s => s.ui)
  const { items, subtotal, shipping, total, count } = useSelector(s => s.cart)

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => dispatch(closeCart())}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-luxury-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiShoppingBag size={20} className="text-emerald-900" />
                <h2 className="font-display text-xl text-luxury-dark">Your Bag</h2>
                <span className="w-6 h-6 bg-emerald-900 text-white font-sans text-xs rounded-full flex items-center justify-center">{count}</span>
              </div>
              <button onClick={() => dispatch(closeCart())} className="p-2 hover:bg-luxury-beige transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <FiShoppingBag size={48} className="text-gray-200" />
                  <div>
                    <p className="font-display text-xl text-luxury-dark">Your bag is empty</p>
                    <p className="font-sans text-sm text-luxury-muted mt-1">Discover our luxury collections</p>
                  </div>
                  <Link to="/collections" onClick={() => dispatch(closeCart())} className="btn-luxury mt-2">Explore Collections</Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item._id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 pb-5 border-b border-gray-100 last:border-0"
                    >
                      <Link to={`/product/${item._id}`} onClick={() => dispatch(closeCart())}
                        className="w-20 h-24 bg-luxury-beige shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item._id}`} onClick={() => dispatch(closeCart())}
                          className="font-sans text-sm font-medium text-luxury-dark hover:text-gold transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          {item.size && <span className="font-sans text-xs text-luxury-muted">Size: {item.size}</span>}
                          {item.color && <span className="font-sans text-xs text-luxury-muted">Color: {item.color}</span>}
                        </div>
                        <p className="font-sans text-sm text-emerald-900 font-semibold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item._id, size: item.size, color: item.color, quantity: item.quantity - 1 }))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-luxury-beige transition-colors text-luxury-dark"
                            ><FiMinus size={12} /></button>
                            <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item._id, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-luxury-beige transition-colors text-luxury-dark"
                            ><FiPlus size={12} /></button>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart({ id: item._id, size: item.size, color: item.color }))}
                            className="p-2 text-luxury-muted hover:text-red-500 transition-colors"
                          ><FiTrash2 size={15} /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 bg-luxury-beige/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-sans text-sm text-luxury-muted">
                    <span>Subtotal</span><span className="text-luxury-dark">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-luxury-muted">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'text-luxury-dark'}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-sans text-xs text-luxury-muted">Add {formatPrice(999 - subtotal)} more for free shipping</p>
                  )}
                  <div className="flex justify-between font-sans font-semibold text-luxury-dark border-t border-gray-200 pt-2">
                    <span>Total</span><span className="text-emerald-900 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())} className="btn-luxury w-full text-center block">
                  Proceed to Checkout
                </Link>
                <Link to="/cart" onClick={() => dispatch(closeCart())} className="btn-outline w-full text-center block mt-2">
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
