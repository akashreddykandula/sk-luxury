import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

export default function SectionHeader({ eyebrow, title, subtitle, linkTo, linkLabel = 'View All', center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-10 md:mb-14 ${center ? 'text-center' : ''}`}
    >
      {eyebrow && <p className="section-subtitle">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className={`font-sans text-luxury-muted mt-3 max-w-xl leading-relaxed ${center ? 'mx-auto' : ''}`}>{subtitle}</p>}
      <div className={`flex items-center gap-4 mt-5 ${center ? 'justify-center' : ''}`}>
        <div className="w-12 h-px bg-gold" />
        <div className="w-2 h-2 rotate-45 bg-gold" />
        <div className="w-12 h-px bg-gold" />
      </div>
      {linkTo && (
        <Link to={linkTo} className="inline-flex items-center gap-2 mt-6 font-sans text-xs tracking-widest uppercase text-emerald-900 hover:text-gold transition-colors group">
          {linkLabel} <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  )
}
