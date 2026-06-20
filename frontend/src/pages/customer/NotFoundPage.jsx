import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>Page Not Found | SK Luxury</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <p className="font-display text-8xl text-gold/30 mb-2">404</p>
          <h1 className="font-display text-3xl text-luxury-dark mb-3">Page Not Found</h1>
          <p className="font-sans text-sm text-luxury-muted mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. Let's get you back to something beautiful.
          </p>
          <Link to="/" className="btn-luxury inline-flex items-center gap-2">
            Return to Homepage <FiArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </>
  )
}
