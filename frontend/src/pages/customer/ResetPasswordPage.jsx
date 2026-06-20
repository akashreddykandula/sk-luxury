import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiLock, FiEye, FiEyeOff, FiXCircle } from 'react-icons/fi'
import { resetPassword, clearError } from '../../store/slices/authSlice'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [tokenStatus, setTokenStatus] = useState('checking') // checking | valid | invalid

  useEffect(() => {
    api.get(`/auth/reset-password/${token}/verify`)
      .then(res => setTokenStatus(res.data.valid ? 'valid' : 'invalid'))
      .catch(() => setTokenStatus('invalid'))
  }, [token])

 useEffect (
  () => {
    if (user) {
      toast.success ('Password reset successfully. Please login.');
      navigate ('/login');
    }
  },
  [user]
);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    dispatch(resetPassword({ token, password: form.password }))
  }

  return (
    <>
      <Helmet><title>Reset Password | SK Luxury</title></Helmet>
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-4xl text-emerald-900 inline-block mb-4">SK</Link>
            <p className="section-subtitle">Account Recovery</p>
            <h1 className="font-display text-4xl text-luxury-dark">Reset Password</h1>
          </div>

          {tokenStatus === 'checking' && (
            <div className="bg-white shadow-card p-8 text-center">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {tokenStatus === 'invalid' && (
            <div className="bg-white shadow-card p-8 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiXCircle size={28} className="text-red-500" />
              </div>
              <h2 className="font-display text-xl text-luxury-dark mb-2">Link Expired</h2>
              <p className="font-sans text-sm text-luxury-muted mb-6">This password reset link is invalid or has expired.</p>
              <Link to="/forgot-password" className="btn-luxury inline-block">Request New Link</Link>
            </div>
          )}

          {tokenStatus === 'valid' && (
            <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-card p-8">
              <div>
                <label className="luxury-label"><FiLock size={11} className="inline mr-1" />New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} className="luxury-input pr-12" placeholder="Min 6 characters" required
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold transition-colors">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="luxury-label">Confirm New Password</label>
                <input
                  type="password" className="luxury-input" required
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                />
              </div>
              <button type="submit" disabled={loading} className={`btn-luxury w-full justify-center ${loading ? 'opacity-70' : ''}`}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</span>
                ) : 'Reset Password'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </>
  )
}
