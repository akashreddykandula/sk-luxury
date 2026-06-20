import React from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiTruck, FiRefreshCw, FiPhone, FiScissors, FiHeart } from 'react-icons/fi'

const features = [
  { icon: FiAward, title: 'Premium Quality', desc: 'Every garment crafted with finest fabrics and meticulous attention to detail' },
  { icon: FiScissors, title: 'Custom Designs', desc: 'Bespoke creations tailored to your exact measurements and preferences' },
  { icon: FiTruck, title: 'Pan India Delivery', desc: 'Safe and secure delivery across all major cities within 5-7 business days' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: 'Hassle-free 7-day return policy for your complete peace of mind' },
  { icon: FiPhone, title: 'Expert Consultation', desc: 'Personal styling consultations available via appointment or WhatsApp' },
  { icon: FiHeart, title: 'Bridal Expertise', desc: 'Dedicated bridal studio with exclusive collections for your big day' },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-emerald-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute w-px bg-gold/50 top-0 bottom-0" style={{ left: `${(i + 1) * 20}%` }} />
        ))}
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <p className="section-subtitle text-gold/80">Why SK Luxury</p>
          <h2 className="font-display text-4xl md:text-5xl text-white">The SK Promise</h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="w-12 h-px bg-gold/50" />
            <div className="w-2 h-2 rotate-45 bg-gold/50" />
            <div className="w-12 h-px bg-gold/50" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-7 border border-white/10 hover:border-gold/40 bg-white/5 hover:bg-white/8 transition-all duration-400"
            >
              <div className="w-12 h-12 border border-gold/40 flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                <f.icon size={20} className="text-gold" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">{f.title}</h3>
              <p className="font-sans text-sm text-white/55 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
