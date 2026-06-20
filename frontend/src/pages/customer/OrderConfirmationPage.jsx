import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiCheckCircle, FiArrowRight, FiDownload, FiXCircle, FiPrinter } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchOrder, cancelOrder, clearOrderError } from '../../store/slices/orderSlice'
import { formatPrice, formatDate, getDeliveryEstimateText } from '../../utils/helpers'
import { orderSupport } from '../../utils/whatsapp'
import OrderStatusTracker from '../../components/common/OrderStatusTracker'
import toast from 'react-hot-toast'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const { currentOrder: order, loading } = useSelector(s => s.orders)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    dispatch(fetchOrder(orderId))
    window.scrollTo(0, 0)
  }, [orderId])

  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await dispatch(cancelOrder({ id: orderId, reason: cancelReason })).unwrap()
      toast.success('Order cancelled successfully')
      setShowCancelModal(false)
    } catch (err) {
      toast.error(err || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const handlePrint = () => window.print()

  const canCancel = order && !['shipped', 'delivered', 'cancelled', 'returned'].includes(order.orderStatus)

  if (loading && !order) {
    return (
      <div className="page-container py-20">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="skeleton h-32 rounded" />
          <div className="skeleton h-48 rounded" />
          <div className="skeleton h-64 rounded" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="font-display text-2xl text-luxury-dark mb-4">Order not found</p>
        <Link to="/collections" className="btn-luxury">Browse Collections</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Order #{order.orderNumber} | SK Luxury</title></Helmet>

    <div className="bg-luxury-cream py-10 md:py-16 print:bg-white">
      <div className="max-w-4xl mx-auto px-6">
          {/* Success header - only on first view / pending-confirmed states show celebration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-luxury-lg mb-6 print:shadow-none"
          >
            <div className="bg-emerald-950 px-8 py-10 text-center print:bg-white print:py-4">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 print:hidden"
              >
                <FiCheckCircle size={32} className="text-gold" />
              </motion.div>
              <h1 className="font-display text-3xl text-white print:text-luxury-dark mb-1">Order Confirmed!</h1>
              <p className="font-sans text-white/70 print:text-luxury-muted text-sm">Thank you for shopping with SK Luxury.</p>
              <p className="font-sans text-gold print:text-emerald-900 text-sm mt-2 font-medium">Order #{order.orderNumber}</p>
              <p className="font-sans text-white/70 print:text-luxury-muted text-sm">Check your email for order details.</p>
            </div>

            <div className="p-6 md:p-8">
              <div className="hidden print:block mb-8">
  <h1 className="text-3xl font-bold">SK LUXURY</h1>
  <p>Luxury Fashion & Jewellery</p>

  <hr className="my-4" />

  <h2 className="text-xl font-bold">INVOICE</h2>

  <p><strong>Order:</strong> {order.orderNumber}</p>
  <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
  <p><strong>Status:</strong> {order.paymentInfo?.status}</p>
</div>
              {/* Status tracker */}
             <div className="mb-4 print:hidden">
  <OrderStatusTracker order={order} />
</div>


              {/* Address + Payment grid */}
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                <div className="bg-luxury-beige p-5">
                  <p className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-3">Delivery Address</p>
                  <p className="font-sans text-sm text-luxury-dark font-medium">{order.shippingAddress?.name}</p>
                  <p className="font-sans text-sm text-luxury-muted">{order.shippingAddress?.addressLine}</p>
                  <p className="font-sans text-sm text-luxury-muted">{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
                  <p className="font-sans text-sm text-luxury-muted">{order.shippingAddress?.phone}</p>
                </div>
                <div className="bg-luxury-beige p-5">
                  <p className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-3">Payment Info</p>
                  <div className="flex justify-between font-sans text-sm mb-1">
                    <span className="text-luxury-muted">Status</span>
                    <span className={`font-medium ${order.paymentInfo?.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.paymentInfo?.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between font-sans text-sm mb-1">
                    <span className="text-luxury-muted">Method</span>
                    <span className="text-luxury-dark capitalize">{order.paymentInfo?.method || 'Razorpay'}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm mb-1">
                    <span className="text-luxury-muted">Total</span>
                    <span className="font-semibold text-emerald-900">{formatPrice(order.pricing?.total)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-luxury-muted">Date</span>
                    <span className="text-luxury-dark">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-4">Items Ordered ({order.items?.length})</p>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-14 h-16 bg-luxury-beige overflow-hidden shrink-0 print:hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-sans text-sm text-luxury-dark font-medium">{item.name}</p>
                        <p className="font-sans text-xs text-luxury-muted">Qty: {item.quantity} {item.size && `· Size: ${item.size}`} {item.color && `· ${item.color}`}</p>
                      </div>
                      <p className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                {/* Pricing summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 max-w-xs ml-auto">
                  <div className="flex justify-between font-sans text-sm text-luxury-muted">
                    <span>Subtotal</span><span className="text-luxury-dark">{formatPrice(order.pricing?.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-luxury-muted">
                    <span>Shipping</span><span className="text-luxury-dark">{order.pricing?.shippingCost === 0 ? 'FREE' : formatPrice(order.pricing?.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-sans font-bold text-luxury-dark border-t border-gray-100 pt-1.5">
                    <span>Total</span><span className="text-emerald-900">{formatPrice(order.pricing?.total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <Link to="/collections" className="btn-luxury flex-1 text-center justify-center">
                  Continue Shopping <FiArrowRight size={14} className="inline ml-1" />
                </Link>
                <button onClick={() => orderSupport(order.orderNumber)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-[#25D366] hover:text-white transition-all">
                  <FaWhatsapp size={16} /> WhatsApp Support
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-3 print:hidden">
                <button onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-luxury-dark py-3 font-sans text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-all">
                  <FiPrinter size={15} /> Print Invoice
                </button>
                {canCancel && (
                  <button onClick={() => setShowCancelModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 font-sans text-xs tracking-widest uppercase hover:bg-red-50 transition-all">
                    <FiXCircle size={15} /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cancel order modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowCancelModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full p-6 shadow-luxury-lg">
            <h3 className="font-display text-xl text-luxury-dark mb-2">Cancel Order?</h3>
            <p className="font-sans text-sm text-luxury-muted mb-4">This action cannot be undone. Please let us know why you're cancelling.</p>
            <textarea
              className="luxury-input resize-none h-24 mb-4"
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="btn-outline flex-1 justify-center">Keep Order</button>
              <button onClick={handleCancelOrder} disabled={cancelling}
                className={`flex-1 bg-red-500 text-white py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-red-600 transition-colors ${cancelling ? 'opacity-70' : ''}`}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
