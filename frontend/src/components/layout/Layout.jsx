import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import CartSidebar from '../cart/CartSidebar'
import SearchModal from '../common/SearchModal'

export default function Layout() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <Navbar />
      <CartSidebar />
      <SearchModal />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
