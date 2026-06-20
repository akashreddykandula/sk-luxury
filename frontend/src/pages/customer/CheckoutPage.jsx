import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiLock, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { createOrder } from '../../store/slices/orderSlice'
import { clearCart } from '../../store/slices/cartSlice'
import { formatPrice } from '../../utils/helpers'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const INDIA_STATES = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Other']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, subtotal, shipping, total } = useSelector(s => s.cart)
  const { user } = useSelector(s => s.auth)
  const { loading } = useSelector(s => s.orders)

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    addressLine: '', city: '', state: 'Andhra Pradesh', pincode: ''
  })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  // useEffect(() => {
  //   if (items.length === 0) navigate('/cart')
  // }, [items])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Valid email required'
    if (!form.phone.match(/^[6-9]\d{9}$/)) errs.phone = 'Valid 10-digit phone required'
    if (!form.addressLine.trim()) errs.addressLine = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.pincode.match(/^\d{6}$/)) errs.pincode = 'Valid 6-digit pincode required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }


  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const handlePayment = async () => {
    if (!validate()) return
    setProcessing(true)

    try {
      // Create order in DB first
      const orderData = {
        items: items.map(i => ({
          product: i._id, name: i.name, image: i.image,
          price: i.price, quantity: i.quantity, size: i.size, color: i.color
        })),
        shippingAddress: form,
        pricing: { subtotal, shippingCost: shipping, total },
        paymentMethod: 'razorpay',
        guestInfo: !user ? { name: form.name, email: form.email, phone: form.phone } : undefined
      }

      const orderResult = await dispatch(createOrder(orderData)).unwrap()
      const dbOrderId = orderResult._id

      // Create Razorpay order
      const { data } = await api.post('/payments/create-order', { amount: total, orderId: dbOrderId })
      console.log ('Key:', data.keyId);
console.log ('Order ID:', data.orderId);
console.log ('Amount:', data.amount);

      console.log ('Razorpay Response:', data);


      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Payment gateway failed to load'); setProcessing(false); return }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'SK Luxury',
        description: 'Luxury Fashion & Jewellery',
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0d3b2e' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: dbOrderId
            })
            dispatch(clearCart())
            navigate(`/order-confirmation/${dbOrderId}`)
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        modal: {
          ondismiss: async () => {
            await api.post('/payments/failed', { orderId: dbOrderId })
            toast.error('Payment cancelled')
            setProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
      setProcessing(false)
    }
  }

  const inputClass = (field) => `luxury-input ${errors[field] ? 'border-red-400' : ''}`

  return (
    <>
      <Helmet><title>Checkout | SK Luxury</title></Helmet>
      <div className="bg-luxury-beige/40 py-4 border-b border-gray-100">
        <div className="page-container flex items-center gap-2">
          <FiLock size={14} className="text-gold" />
          <h1 className="font-display text-2xl text-luxury-dark">Secure Checkout</h1>
        </div>
      </div>

      <div className="page-container py-10 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-card p-6">
              <h2 className="font-display text-2xl text-luxury-dark mb-6">Delivery Information</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="luxury-label"><FiUser size={11} className="inline mr-1" />Full Name</label>
                  <input className={inputClass('name')} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
                  {errors.name && <p className="font-sans text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="luxury-label"><FiPhone size={11} className="inline mr-1" />Phone Number</label>
                  <input className={inputClass('phone')} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number" />
                  {errors.phone && <p className="font-sans text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="luxury-label"><FiMail size={11} className="inline mr-1" />Email Address</label>
                  <input className={inputClass('email')} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                  {errors.email && <p className="font-sans text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="luxury-label"><FiMapPin size={11} className="inline mr-1" />Address</label>
                  <input className={inputClass('addressLine')} value={form.addressLine} onChange={e => setForm(f => ({ ...f, addressLine: e.target.value }))} placeholder="House/Flat number, Street, Area" />
                  {errors.addressLine && <p className="font-sans text-xs text-red-500 mt-1">{errors.addressLine}</p>}
                </div>
                <div>
                  <label className="luxury-label">City</label>
                  <input className={inputClass('city')} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                  {errors.city && <p className="font-sans text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="luxury-label">Pincode</label>
                  <input className={inputClass('pincode')} value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} placeholder="6-digit pincode" maxLength={6} />
                  {errors.pincode && <p className="font-sans text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="luxury-label">State</label>
                  <select className="luxury-input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Payment info */}
            <div className="bg-emerald-950/5 border border-emerald-900/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <FiLock size={16} className="text-emerald-900" />
                <p className="font-sans text-sm font-medium text-luxury-dark">Secure Payment via Razorpay</p>
              </div>
              <p className="font-sans text-xs text-luxury-muted">Pay securely using UPI, Google Pay, PhonePe, Paytm, Debit/Credit Cards, or Net Banking. All transactions are 256-bit SSL encrypted.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['UPI', 'G Pay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'Net Banking'].map(m => (
                  <span key={m} className="font-sans text-[10px] border border-emerald-900/20 px-2 py-1 text-luxury-muted">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white shadow-card p-6 sticky top-24">
              <h2 className="font-display text-xl text-luxury-dark mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-3">
                    <div className="w-14 h-16 bg-luxury-beige overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-xs text-luxury-dark line-clamp-2">{item.name}</p>
                      <p className="font-sans text-xs text-luxury-muted mt-0.5">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                      <p className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between font-sans text-sm text-luxury-muted">
                  <span>Subtotal</span><span className="text-luxury-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-luxury-muted">
                  <span>Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'text-luxury-dark'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-sans font-bold text-luxury-dark border-t border-gray-100 pt-2">
                  <span>Total</span><span className="text-emerald-900 text-xl font-display">{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={handlePayment} disabled={processing || loading}
                className={`btn-luxury w-full justify-center text-center ${(processing || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><FiLock size={14} /> Pay {formatPrice(total)}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
