import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast';

import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { toggleCart, toggleSearch, toggleMobileMenu, closeMobileMenu } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'

const collections = [
  { label: 'All Collections', to: '/collections' },
  { label: 'Clothing', to: '/collections/clothing' },
  { label: 'Jewellery', to: '/collections/jewellery' },
  { label: 'Bridal', to: '/collections/bridal' },
]

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartOpen, mobileMenuOpen } = useSelector(s => s.ui)
  const { user } = useSelector(s => s.auth)
  const { count } = useSelector(s => s.cart)
  const [scrolled, setScrolled] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const collectionsRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target)) setCollectionsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-emerald-950 text-center py-2 px-4">
        <p className="font-sans text-xs text-gold/90 tracking-[0.2em] uppercase">
          Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; Custom Designs Available &nbsp;|&nbsp; Bridal Consultations by Appointment
        </p>
      </div>

      <header className={`sticky top-0 z-40 transition-all duration-400 ${scrolled ? 'bg-white shadow-luxury' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-luxury-dark"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Desktop Nav Left */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
              {/* Collections dropdown */}
              <div className="relative" ref={collectionsRef}>
                <button
                  className="nav-link flex items-center gap-1"
                  onClick={() => setCollectionsOpen(!collectionsOpen)}
                >
                  Collections <FiChevronDown size={12} className={`transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {collectionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white shadow-luxury-lg border-t-2 border-gold z-50"
                    >
                      {collections.map(c => (
                        <Link
                          key={c.to} to={c.to}
                          onClick={() => setCollectionsOpen(false)}
                          className="block px-5 py-3 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
            </nav>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl md:text-4xl font-semibold text-emerald-900 leading-none tracking-wider"
                  style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
                  SK
                </span>
                <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold hidden md:block">Luxury in Every Stitch</span>
              </div>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-5">
              <button onClick={() => dispatch(toggleSearch())} className="p-1.5 text-luxury-dark hover:text-gold transition-colors" aria-label="Search">
                <FiSearch size={20} />
              </button>
              {user && (
                <Link to="/wishlist" className="p-1.5 text-luxury-dark hover:text-gold transition-colors hidden md:block" aria-label="Wishlist">
                  <FiHeart size={20} />
                </Link>
              )}
              {/* User menu */}
              <div className="relative hidden md:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="p-1.5 text-luxury-dark hover:text-gold transition-colors" aria-label="Account">
                  <FiUser size={20} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white shadow-luxury-lg border-t-2 border-gold z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-5 py-3 border-b border-gray-100">
                            <p className="font-sans text-xs text-luxury-muted">Welcome,</p>
                            <p className="font-sans text-sm font-medium text-luxury-dark truncate">{user.name}</p>
                          </div>
                          <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-5 py-2.5 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors">My Profile</Link>
                          <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-5 py-2.5 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors">Wishlist</Link>
                          <Link to="/track-order" onClick={() => setUserMenuOpen(false)} className="block px-5 py-2.5 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors">Track Order</Link>
                          {user.role === 'admin' && <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-5 py-2.5 font-sans text-xs tracking-widest uppercase text-gold hover:bg-luxury-beige transition-colors">Admin Panel</Link>}
                          <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 font-sans text-xs tracking-widest uppercase text-red-500 hover:bg-luxury-beige transition-colors border-t border-gray-100">Logout</button>
                        </>
                      ) : (
                        <>
                          <Link
  to="/login"
  onClick={() => setUserMenuOpen(false)}
  className="block px-5 py-3 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors"
>
  Login
</Link>

<Link
  to="/track-order"
  onClick={() => setUserMenuOpen(false)}
  className="block px-5 py-3 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors"
>
  Track Order
</Link>

<Link
  to="/register"
  onClick={() => setUserMenuOpen(false)}
  className="block px-5 py-3 font-sans text-xs tracking-widest uppercase text-luxury-dark hover:bg-luxury-beige hover:text-gold transition-colors"
>
  Register
</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Cart */}
              <button onClick={() => dispatch(toggleCart())} className="p-1.5 text-luxury-dark hover:text-gold transition-colors relative" aria-label="Cart">
                <FiShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white font-sans text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="font-display text-2xl text-emerald-900">Sri Kala</span>
              <button onClick={() => dispatch(closeMobileMenu())}><FiX size={24} /></button>
            </div>
            <nav className="px-6 py-6 flex flex-col gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/collections', label: 'All Collections' },
                { to: '/collections/clothing', label: 'Clothing' },
                { to: '/collections/jewellery', label: 'Jewellery' },
                { to: '/collections/bridal', label: 'Bridal' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/track-order', label: 'Track Order' },
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => dispatch(closeMobileMenu())}
                  className="py-3.5 border-b border-gray-100 font-sans text-sm tracking-widest uppercase text-luxury-dark hover:text-gold transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => dispatch(closeMobileMenu())} className="btn-luxury text-center">My Account</Link>
                    <button onClick={() => { handleLogout(); dispatch(closeMobileMenu()) }} className="btn-outline text-center">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => dispatch(closeMobileMenu())} className="btn-luxury text-center">Login</Link>
                    <Link to="/register" onClick={() => dispatch(closeMobileMenu())} className="btn-outline text-center">Register</Link>
                    {/* <Link
  to="/track-order"
  onClick={() => dispatch (closeMobileMenu ())}
  className="nav-link"
>
  Track Order
</Link> */}

                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
