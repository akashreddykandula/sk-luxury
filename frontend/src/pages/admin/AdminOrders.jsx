import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiEye, FiX } from 'react-icons/fi'
import api from '../../utils/api'
import { formatPrice, formatDate, statusColor, getDeliveryEstimateText } from '../../utils/helpers'
import OrderStatusTracker from '../../components/common/OrderStatusTracker'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

const toDateInputValue = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [courier, setCourier] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 15 })
      if (statusFilter) params.append('status', statusFilter)
      const r = await api.get(`/orders/all?${params}`)
      setOrders(r.data.orders)
      setTotal(r.data.total)
      setPages(r.data.pages)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.orderStatus)
    setTrackingNumber(order.trackingNumber || '')
    setCourier(order.courier || '')
    setEstimatedDelivery(toDateInputValue(order.estimatedDelivery))
    setStatusMessage('')
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) return
    setUpdatingStatus(true)
    try {
      const payload = { status: newStatus, trackingNumber, courier, message: statusMessage }
      if (estimatedDelivery) payload.estimatedDelivery = estimatedDelivery
      const res = await api.put(`/orders/${selectedOrder._id}/status`, payload)
      toast.success('Order status updated! Customer has been notified by email.')
      setSelectedOrder(res.data.order)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
    finally { setUpdatingStatus(false) }
  }

  return (
    <>
      <Helmet><title>Orders | SK Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-gray-800">Orders</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">{total} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          <FiFilter size={14} className="text-gray-400" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="border border-gray-200 px-4 py-2.5 font-sans text-sm bg-white focus:outline-none focus:border-gold">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order #', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.map((order, i) => (
                <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-sans text-xs font-semibold text-emerald-700">#{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-sans text-xs text-gray-700 font-medium">{order.user?.name || order.guestInfo?.name || 'Guest'}</p>
                    <p className="font-sans text-[10px] text-gray-400">{order.user?.email || order.guestInfo?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-600">{order.items?.length} item(s)</td>
                  <td className="px-4 py-3 font-sans text-sm font-semibold text-gray-800">{formatPrice(order.pricing?.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] px-2 py-0.5 rounded font-medium ${order.paymentInfo?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.paymentInfo?.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] px-2 py-0.5 rounded font-medium ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openOrderModal(order)}
                      className="p-2 text-gray-400 hover:text-emerald-700 transition-colors">
                      <FiEye size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-gray-400">No orders found.</p>
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 font-sans text-sm border transition-all ${page === i + 1 ? 'bg-emerald-900 text-white border-emerald-900' : 'border-gray-200 text-gray-500 hover:border-gold hover:text-gold'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-display text-xl text-gray-800">Order #{selectedOrder.orderNumber}</h2>
                  <p className="font-sans text-xs text-gray-400">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Tracker preview */}
                <div className="bg-gray-50 p-5">
                  <OrderStatusTracker order={selectedOrder} />
                </div>

                {/* Customer */}
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-3">Customer</h3>
                  <p className="font-sans text-sm text-gray-700">{selectedOrder.user?.name || selectedOrder.guestInfo?.name || 'Guest'}</p>
                  <p className="font-sans text-xs text-gray-500">{selectedOrder.user?.email || selectedOrder.guestInfo?.email}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-12 h-14 bg-luxury-beige overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-sans text-sm text-gray-700">{item.name}</p>
                          <p className="font-sans text-xs text-gray-400">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                        </div>
                        <p className="font-sans text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-3">Shipping Address</h3>
                  <p className="font-sans text-sm text-gray-700">{selectedOrder.shippingAddress?.name}</p>
                  <p className="font-sans text-sm text-gray-600">{selectedOrder.shippingAddress?.addressLine}</p>
                  <p className="font-sans text-sm text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} – {selectedOrder.shippingAddress?.pincode}</p>
                  <p className="font-sans text-sm text-gray-600">{selectedOrder.shippingAddress?.phone}</p>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-sans text-sm text-gray-600"><span>Subtotal</span><span>{formatPrice(selectedOrder.pricing?.subtotal)}</span></div>
                    <div className="flex justify-between font-sans text-sm text-gray-600"><span>Shipping</span><span>{selectedOrder.pricing?.shippingCost === 0 ? 'FREE' : formatPrice(selectedOrder.pricing?.shippingCost)}</span></div>
                    <div className="flex justify-between font-sans font-bold text-gray-800 border-t border-gray-200 pt-2"><span>Total</span><span>{formatPrice(selectedOrder.pricing?.total)}</span></div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="border border-gray-200 p-5">
                  <h3 className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-4">Update Order Status</h3>
                  <p className="font-sans text-[11px] text-gray-400 mb-4">Customer will automatically receive an email notification when you save changes.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="luxury-label">New Status</label>
                      <select className="luxury-input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="luxury-label">Tracking Number</label>
                        <input className="luxury-input" placeholder="Optional" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
                      </div>
                      <div>
                        <label className="luxury-label">Courier</label>
                        <input className="luxury-input" placeholder="e.g., BlueDart, DTDC" value={courier} onChange={e => setCourier(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="luxury-label">Estimated Delivery Date</label>
                      <input type="date" className="luxury-input" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} />
                      {selectedOrder.estimatedDelivery && (
                        <p className="font-sans text-xs text-gold mt-1">{getDeliveryEstimateText(selectedOrder.estimatedDelivery, selectedOrder.orderStatus)}</p>
                      )}
                    </div>
                    <div>
                      <label className="luxury-label">Note to Customer (optional)</label>
                      <textarea className="luxury-input resize-none h-20" placeholder="This message will be included in the email" value={statusMessage} onChange={e => setStatusMessage(e.target.value)} />
                    </div>
                    <button onClick={handleUpdateStatus} disabled={updatingStatus}
                      className={`btn-luxury w-full justify-center ${updatingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {updatingStatus ? 'Updating...' : 'Update Status & Notify Customer'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
