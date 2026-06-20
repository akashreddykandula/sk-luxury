import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiPackage, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { trackOrderByDetails, clearTrackedOrder } from '../../store/slices/orderSlice'
import { formatPrice, formatDate } from '../../utils/helpers'
import { orderSupport } from '../../utils/whatsapp'
import OrderStatusTracker from '../../components/common/OrderStatusTracker'

export default function OrderTrackingPage() {
  const dispatch = useDispatch()
  const { trackedOrder, trackingLoading, trackingError } = useSelector(s => s.orders)
  const [form, setForm] = useState({ orderNumber: '', email: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.orderNumber.trim() || !form.email.trim()) return
    dispatch(trackOrderByDetails({ orderNumber: form.orderNumber.trim(), email: form.email.trim() }))
  }

  const handleReset = () => {
    dispatch(clearTrackedOrder())
    setForm({ orderNumber: '', email: '' })
  }

  return (
    <>
      <Helmet><title>Track Your Order | SK Luxury</title></Helmet>

      <div className="bg-emerald-950 py-14 text-center">
        <FiPackage size={32} className="text-gold mx-auto mb-3" />
        <h1 className="font-display text-4xl text-white">Track Your Order</h1>
        <p className="font-sans text-sm text-white/60 mt-2">Enter your order number and email to check status</p>
      </div>

      <div className="page-container py-12 max-w-2xl mx-auto">
        {!trackedOrder && (
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white shadow-card p-8 space-y-5"
          >
            <div>
              <label className="luxury-label">Order Number</label>
              <input
                className="luxury-input" placeholder="e.g., SK12345678" required
                value={form.orderNumber}
                onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))}
              />
            </div>
            <div>
              <label className="luxury-label">Email Address</label>
              <input
                type="email" className="luxury-input" placeholder="The email used for your order" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            {trackingError && (
              <p className="font-sans text-sm text-red-500 bg-red-50 p-3">{trackingError}</p>
            )}
            <button type="submit" disabled={trackingLoading} className={`btn-luxury w-full justify-center ${trackingLoading ? 'opacity-70' : ''}`}>
              {trackingLoading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Searching...</span>
              ) : (
                <span className="flex items-center gap-2"><FiSearch size={15} /> Track Order</span>
              )}
            </button>
            <p className="font-sans text-xs text-luxury-muted text-center">
              Have an account? <Link to="/login" className="text-gold hover:text-gold-600">Sign in</Link> to see all your orders.
            </p>
          </motion.form>
        )}

        <AnimatePresence>
          {trackedOrder && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="font-sans text-xs text-luxury-muted tracking-widest uppercase">Order</p>
                  <p className="font-display text-2xl text-luxury-dark">#{trackedOrder.orderNumber}</p>
                  <p className="font-sans text-xs text-luxury-muted mt-1">Placed on {formatDate(trackedOrder.createdAt)}</p>
                </div>
                <button onClick={handleReset} className="font-sans text-xs text-gold hover:text-gold-600 transition-colors">
                  Track Another Order
                </button>
              </div>

              <div className="mb-8">
                <OrderStatusTracker order={trackedOrder} />
              </div>

              <div className="mb-6">
                <p className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-4">Items</p>
                <div className="space-y-3">
                  {trackedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-14 h-16 bg-luxury-beige overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-sans text-sm text-luxury-dark font-medium">{item.name}</p>
                        <p className="font-sans text-xs text-luxury-muted">Qty: {item.quantity} {item.size && `· Size: ${item.size}`}</p>
                      </div>
                      <p className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between font-sans font-bold text-luxury-dark border-t border-gray-100 pt-4 mb-6">
                <span>Total</span><span className="text-emerald-900 text-lg font-display">{formatPrice(trackedOrder.pricing?.total)}</span>
              </div>

              <button onClick={() => orderSupport(trackedOrder.orderNumber)}
                className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-[#25D366] hover:text-white transition-all">
                <FaWhatsapp size={16} /> Get Help via WhatsApp
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
