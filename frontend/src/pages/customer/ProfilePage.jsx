import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUser, FiPackage, FiLogOut, FiLock, FiChevronDown, FiChevronUp,
  FiEye, FiEyeOff, FiMapPin
} from 'react-icons/fi'
import { logout, updateProfile, updatePassword, clearError } from '../../store/slices/authSlice'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import { formatPrice, formatDate, statusColor, getDeliveryEstimateText } from '../../utils/helpers'
import OrderStatusTracker from '../../components/common/OrderStatusTracker'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector(s => s.auth)
  const { orders } = useSelector(s => s.orders)
const [tab, setTab] = useState (
  localStorage.getItem ('profileTab') || 'orders'
);

  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => { dispatch(fetchMyOrders()) }, [])
  useEffect (
  () => {
    localStorage.setItem ('profileTab', tab);
  },
  [tab]
);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleLogout = () => { dispatch(logout()); 
    toast.success('Logged out successfully');
    navigate('/') }

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
  ]

  return (
    <>
      <Helmet><title>My Account | SK Luxury</title></Helmet>
      <div className="bg-luxury-beige/50 border-b border-gray-100 py-8">
        <div className="page-container">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-900 flex items-center justify-center">
              <span className="font-display text-2xl text-gold">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-display text-2xl text-luxury-dark">{user?.name}</h1>
              <p className="font-sans text-sm text-luxury-muted">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white shadow-card overflow-hidden">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 font-sans text-sm transition-all border-b border-gray-50 last:border-0 ${tab === id ? 'bg-emerald-900 text-white' : 'text-luxury-dark hover:bg-luxury-beige'}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
              <Link to="/track-order" className="w-full flex items-center gap-3 px-5 py-4 font-sans text-sm text-luxury-dark hover:bg-luxury-beige transition-colors border-b border-gray-50">
                <FiMapPin size={16} /> Track an Order
              </Link>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 font-sans text-sm text-red-500 hover:bg-red-50 transition-colors">
                <FiLogOut size={16} /> Sign Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'orders' && (
              <OrdersTab orders={orders} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} />
            )}
            {tab === 'profile' && <ProfileTab user={user} dispatch={dispatch} />}
            {tab === 'security' && <SecurityTab dispatch={dispatch} loading={loading} />}
          </div>
        </div>
      </div>
    </>
  )
}

function OrdersTab({ orders, expandedOrder, setExpandedOrder }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-luxury-dark mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white shadow-card">
          <FiPackage size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-display text-xl text-luxury-dark">No orders yet</p>
          <p className="font-sans text-sm text-luxury-muted mt-1">Your order history will appear here</p>
          <Link to="/collections" className="btn-luxury inline-block mt-6">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expandedOrder === order._id
            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <p className="font-sans text-xs text-luxury-muted tracking-widest uppercase">Order</p>
                      <p className="font-sans text-sm font-semibold text-luxury-dark">#{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 font-sans text-xs rounded-full ${statusColor(order.orderStatus)}`}>
                        {order.orderStatus?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-luxury-muted">Date</p>
                      <p className="font-sans text-sm text-luxury-dark">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-luxury-muted">Total</p>
                      <p className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(order.pricing?.total)}</p>
                    </div>
                  </div>

                  {/* Estimated delivery line */}
                  <div className="mb-4">
                    <p className="font-sans text-xs text-gold font-medium">
                      {getDeliveryEstimateText(order.estimatedDelivery, order.orderStatus)}
                    </p>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-14 h-16 bg-luxury-beige overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-14 h-16 bg-luxury-beige flex items-center justify-center shrink-0">
                        <span className="font-sans text-xs text-luxury-muted">+{order.items.length - 4}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                      className="flex items-center gap-1.5 font-sans text-xs text-emerald-900 hover:text-gold transition-colors"
                    >
                      {isExpanded ? 'Hide Tracking' : 'Track Order'}
                      {isExpanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                    </button>
                    <Link to={`/order-confirmation/${order._id}`} className="font-sans text-xs text-luxury-muted hover:text-gold transition-colors">
                      View Full Details
                    </Link>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 overflow-hidden"
                    >
                      <div className="p-6 bg-luxury-beige/30">
                        <OrderStatusTracker order={order} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProfileTab({ user, dispatch }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await dispatch(updateProfile(form)).unwrap()
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white shadow-card p-8">
      <h2 className="font-display text-2xl text-luxury-dark mb-6">Profile Information</h2>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="luxury-label">Full Name</label>
          <input className="luxury-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="luxury-label">Email Address</label>
          <input className="luxury-input bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
          <p className="font-sans text-xs text-luxury-muted mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="luxury-label">Phone Number</label>
          <input className="luxury-input" placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="border-b border-gray-100 pb-4">
          <p className="luxury-label">Member Since</p>
          <p className="font-sans text-sm text-luxury-dark">{user?.createdAt ? formatDate(user.createdAt) : '-'}</p>
        </div>
        <button type="submit" disabled={saving} className={`btn-luxury ${saving ? 'opacity-70' : ''}`}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

function SecurityTab({ dispatch, loading }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [show, setShow] = useState({ current: false, next: false, confirm: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    try {
      await dispatch(updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })).unwrap()
      toast.success('Password updated successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err || 'Failed to update password')
    }
  }

  return (
    <div className="bg-white shadow-card p-8">
      <h2 className="font-display text-2xl text-luxury-dark mb-2">Change Password</h2>
      <p className="font-sans text-sm text-luxury-muted mb-6">Keep your account secure with a strong password</p>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="luxury-label">Current Password</label>
          <div className="relative">
            <input
              type={show.current ? 'text' : 'password'} className="luxury-input pr-12" required
              value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, current: !s.current }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold transition-colors">
              {show.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="luxury-label">New Password</label>
          <div className="relative">
            <input
              type={show.next ? 'text' : 'password'} className="luxury-input pr-12" placeholder="Min 6 characters" required
              value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, next: !s.next }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold transition-colors">
              {show.next ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="luxury-label">Confirm New Password</label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'} className="luxury-input pr-12" required
              value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold transition-colors">
              {show.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className={`btn-luxury ${loading ? 'opacity-70' : ''}`}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
