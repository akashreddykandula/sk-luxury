import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { forgotPassword, clearResetStatus } from '../../store/slices/authSlice'

export default function ForgotPasswordPage() {
  const dispatch = useDispatch()
  const { loading, resetStatus, resetMessage } = useSelector(s => s.auth)
  const [email, setEmail] = useState('')

  useEffect(() => { dispatch(clearResetStatus()) }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    dispatch(forgotPassword(email.trim()))
  }

  return (
    <>
      <Helmet><title>Forgot Password | SK Luxury</title></Helmet>
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-4xl text-emerald-900 inline-block mb-4">SK</Link>
            <p className="section-subtitle">Account Recovery</p>
            <h1 className="font-display text-4xl text-luxury-dark">Forgot Password?</h1>
            <p className="font-sans text-sm text-luxury-muted mt-3">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {resetStatus === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white shadow-card p-8 text-center"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={28} className="text-emerald-600" />
              </div>
              <h2 className="font-display text-xl text-luxury-dark mb-2">Check Your Email</h2>
              <p className="font-sans text-sm text-luxury-muted leading-relaxed">{resetMessage}</p>
              <p className="font-sans text-xs text-luxury-muted mt-4">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => dispatch(clearResetStatus())} className="text-gold hover:text-gold-600 font-medium">try again</button>.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-card p-8">
              <div>
                <label className="luxury-label"><FiMail size={11} className="inline mr-1" />Email Address</label>
                <input
                  type="email" className="luxury-input" placeholder="your@email.com" required
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className={`btn-luxury w-full justify-center ${loading ? 'opacity-70' : ''}`}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                ) : 'Send Reset Link'}
              </button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 font-sans text-sm text-luxury-muted hover:text-gold transition-colors mt-6">
            <FiArrowLeft size={14} /> Back to Sign In
          </Link>
        </motion.div>
      </div>
    </>
  )
}
