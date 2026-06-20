import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { FiMessageSquare } from 'react-icons/fi'

const testimonials = [
  { name: 'Priya Sharma', role: 'Bride, Delhi', text: 'SK Luxury made my wedding absolutely magical. The bridal lehenga was beyond my dreams — the craftsmanship and attention to detail was extraordinary. I felt like a queen on my special day!', rating: 5, avatar: 'PS' },
  { name: 'Ananya Reddy', role: 'Fashion Blogger, Hyderabad', text: "I've been a loyal SK customer for 3 years and they never disappoint. The quality of fabrics, the unique designs, and the personal service is unmatched. SK Luxury is truly in a league of their own.", rating: 5, avatar: 'AR' },
  { name: 'Meera Kapoor', role: 'Corporate Executive, Mumbai', text: 'The custom design service is phenomenal. They understood exactly what I wanted and delivered a masterpiece. The jewellery collection is also stunning — I bought three pieces in one visit!', rating: 5, avatar: 'MK' },
  { name: 'Divya Nair', role: 'Homemaker, Bangalore', text: 'Ordered a silk saree for my daughter\'s engagement. The quality exceeded expectations and the packaging was beautiful. Fast delivery and excellent communication throughout. Highly recommended!', rating: 5, avatar: 'DN' },
  { name: 'Rekha Menon', role: 'Entrepreneur, Chennai', text: "The jewellery customisation service is extraordinary. They crafted a necklace matching my grandmother's design from just a photograph. The team's dedication and skill is truly world-class.", rating: 5, avatar: 'RM' },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(p => (p + 1) % testimonials.length)

  const t = testimonials[current]

  return (
    <section className="section-padding bg-luxury-cream overflow-hidden">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="section-subtitle">Client Love</p>
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="section-divider" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Large quote icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
              <FiMessageSquare size={36} className="text-gold/30" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-card p-10 md:p-14 text-center"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} className="text-gold" size={16} />)}
                </div>
                <p className="font-display text-xl md:text-2xl text-luxury-dark leading-relaxed italic mb-8">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-emerald-900 flex items-center justify-center">
                    <span className="font-display text-white text-sm font-semibold">{t.avatar}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-sans text-sm font-semibold text-luxury-dark">{t.name}</p>
                    <p className="font-sans text-xs text-luxury-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={prev} className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <FiChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-gray-300 rounded-full hover:bg-gold'}`} />
                ))}
              </div>
              <button onClick={next} className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
