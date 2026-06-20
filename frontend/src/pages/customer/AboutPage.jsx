import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { bridalConsultation, generalSupport } from '../../utils/whatsapp'
import toast from 'react-hot-toast'

export default function AboutPage() {
  return (
    <>
      <Helmet><title>About Us | SK Luxury</title></Helmet>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80" alt="About SK Luxury" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-subtitle text-gold/90">Our Heritage</p>
          <h1 className="font-display text-5xl text-white">About SK Luxury</h1>
        </div>
      </div>

      <section className="section-padding bg-luxury-cream">
        <div className="page-container max-w-4xl mx-auto text-center">
          <p className="section-subtitle">Our Story</p>
          <h2 className="section-title mb-5">Crafting Luxury Since 2018</h2>
          <div className="section-divider mb-8" />
          <p className="font-sans text-luxury-muted leading-relaxed text-lg mb-6">
            SK Luxury was born from a profound love for India's rich textile heritage and a vision to bring bespoke, 
            handcrafted luxury fashion to the modern woman. Founded in Hyderabad in 2018, we began as a small atelier 
            with a singular mission: to create garments that honour tradition while embracing contemporary elegance.
          </p>
          <p className="font-sans text-luxury-muted leading-relaxed mb-6">
            Today, SK Luxury stands as one of Hyderabad's premier luxury boutiques, offering premium clothing, 
            designer jewellery, exquisite bridal collections, and bespoke custom designs. Every piece we create is 
            a testament to our unwavering commitment to quality, artistry, and the enduring power of great design.
          </p>
          <p className="font-sans text-luxury-muted leading-relaxed">
            Our master artisans bring decades of expertise to every garment, from the selection of the finest silks 
            and brocades to the delicate application of hand-embroidery and gold-thread work. At SK Luxury, we don't 
            just create clothes — we craft legacies.
          </p>
        </div>
      </section>

      <section className="section-padding bg-emerald-950">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2018', label: 'Founded' },
              { value: '10,000+', label: 'Happy Clients' },
              { value: '500+', label: 'Unique Designs' },
              { value: '25+', label: 'Skilled Artisans' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-5xl text-gold mb-2">{s.value}</p>
                <p className="font-sans text-xs text-white/60 tracking-widest uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
