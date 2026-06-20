import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { registerUser, clearError } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)

  useEffect (
  () => {
    if (user) {
      toast.success ('Account created successfully!');
      navigate ('/');
    }
  },
  [user, navigate]
)

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }))
  }

  return (
    <>
      <Helmet><title>Create Account | SK Luxury</title></Helmet>
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-4xl text-emerald-900 inline-block mb-4">SK</Link>
            <p className="section-subtitle">Join Us</p>
            <h1 className="font-display text-4xl text-luxury-dark">Create Account</h1>
            <div className="section-divider" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-card p-8">
            <div>
              <label className="luxury-label"><FiUser size={11} className="inline mr-1" />Full Name</label>
              <input type="text" className="luxury-input" placeholder="Your full name"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="luxury-label"><FiMail size={11} className="inline mr-1" />Email Address</label>
              <input type="email" className="luxury-input" placeholder="your@email.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="luxury-label"><FiPhone size={11} className="inline mr-1" />Phone Number</label>
              <input type="tel" className="luxury-input" placeholder="10-digit mobile number"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="luxury-label"><FiLock size={11} className="inline mr-1" />Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="luxury-input pr-12" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold transition-colors">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="luxury-label">Confirm Password</label>
              <input type="password" className="luxury-input" placeholder="Repeat your password"
                value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading}
              className={`btn-luxury w-full justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</span> : 'Create Account'}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-luxury-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-600 font-medium transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
