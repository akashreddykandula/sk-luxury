import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

export default function CollectionBanner() {
  return (
    <section className="py-16 bg-emerald-950 overflow-hidden">
      <div className="page-container">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Women's Exclusive", subtitle: "Timeless feminine elegance", cta: "Shop Now", link: "/collections/clothing", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80" },
            { title: "Men's Collection", subtitle: "Refined modern masculinity", cta: "Explore", link: "/collections/clothing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="group relative overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="font-sans text-xs text-gold tracking-[0.3em] uppercase mb-1">{item.subtitle}</p>
                  <h3 className="font-display text-3xl text-white mb-4">{item.title}</h3>
                  <Link to={item.link} className="inline-flex items-center gap-2 border border-gold text-gold px-5 py-2.5 font-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-white transition-all duration-300">
                    {item.cta} <FiArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
