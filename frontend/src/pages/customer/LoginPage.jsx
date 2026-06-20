import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { loginUser, clearError } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  useEffect (
  () => {
    if (user) {
      toast.success ('Account logged in successfully!');
      navigate ('/');
    }
  },
  [user, navigate]
)
  

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <>
      <Helmet><title>Login | SK Luxury</title></Helmet>
      <div className="min-h-screen bg-luxury-cream flex">
        {/* Image side */}
        <div className="hidden lg:block w-1/2 relative">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
            alt="SK Luxury" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-emerald-950/50 flex flex-col items-center justify-center text-center p-12">
            <span className="font-display text-7xl text-gold font-semibold">SK</span>
            <p className="font-sans text-xs text-white/60 tracking-[0.4em] uppercase mt-2">Luxury in Every Stitch</p>
          </div>
        </div>

        {/* Form side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-10">
              <p className="section-subtitle">Welcome Back</p>
              <h1 className="font-display text-4xl text-luxury-dark">Sign In</h1>
              <div className="section-divider" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="luxury-label"><FiMail size={11} className="inline mr-1" />Email Address</label>
                <input type="email" className="luxury-input" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="luxury-label"><FiLock size={11} className="inline mr-1" />Password</label>
                  <Link to="/forgot-password" className="font-sans text-xs text-gold hover:text-gold-600 transition-colors mb-2">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="luxury-input pr-12" placeholder="Your password"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold transition-colors">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className={`btn-luxury w-full justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing In...</span> : 'Sign In'}
              </button>
            </form>

            <p className="text-center font-sans text-sm text-luxury-muted mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-600 font-medium transition-colors">Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
