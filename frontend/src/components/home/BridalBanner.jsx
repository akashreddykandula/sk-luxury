import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { bridalConsultation } from '../../utils/whatsapp'

export default function BridalBanner() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80" alt="Bridal"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-950/60 to-transparent" />
      </div>
      <div className="relative z-10 page-container">
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <p className="font-sans text-xs text-gold tracking-[0.4em] uppercase mb-4">Exclusive 2024</p>
          <h2 className="font-display text-5xl md:text-6xl text-white leading-tight mb-4">The Bridal<br />Collection</h2>
          <div className="w-16 h-px bg-gold mb-5" />
          <p className="font-sans text-white/75 leading-relaxed mb-8">
            Every bride deserves to feel extraordinary. Our bridal collection is crafted with the finest fabrics,
            intricate embroidery, and designs that celebrate your unique love story.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/collections/bridal" className="btn-gold group">
              Explore Bridal <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={bridalConsultation}
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3.5 font-sans text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-all duration-300">
              Book Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
