import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {FiArrowRight} from 'react-icons/fi';

const stats = [
  {value: '5+', label: 'Years of Excellence'},
  {value: '10K+', label: 'Happy Customers'},
  {value: '500+', label: 'Unique Designs'},
  {value: '100%', label: 'Handcrafted'},
];

export default function BrandStory () {
  return (
    <section className="section-padding bg-luxury-cream overflow-hidden">
      <div className="page-container">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Images */}
          <motion.div
            initial={{opacity: 0, x: -40}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"
                alt="SK Luxury Brand Story"
                className="w-full aspect-[4/5] object-cover shadow-luxury-lg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/10 border border-gold/30 z-0" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-900/10 z-0" />
            <div className="absolute bottom-8 -right-8 z-20 bg-emerald-950 p-5 shadow-luxury">
              <p className="font-display text-3xl text-gold leading-none">SK</p>
              <p className="font-sans text-[9px] text-white/60 tracking-[0.3em] uppercase mt-1">
                Since 2018
              </p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{opacity: 0, x: 40}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
          >
            <p className="section-subtitle">Our Story</p>
            <h2 className="section-title text-left mb-5">
              Where Tradition Meets Modern Luxury
            </h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-gold" />
              <div className="w-2 h-2 rotate-45 bg-gold" />
            </div>
            <p className="font-sans text-luxury-muted leading-relaxed mb-4">
              Founded in 2024 in the heart of Vijaywada, SK Luxury was born from a deep passion for artisanal
              fashion and a belief that every woman deserves to feel like royalty. Each piece in our collection
              is a labour of love — conceived by our master designers and brought to life by skilled artisans.
            </p>
            <p className="font-sans text-luxury-muted leading-relaxed mb-8">
              From the finest silks sourced from Varanasi to intricate gold-thread embroidery, every detail
              reflects our unwavering commitment to quality, authenticity, and timeless elegance.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5 mb-8">
              {stats.map (s => (
                <div key={s.label} className="border-l-2 border-gold pl-4">
                  <p className="font-display text-3xl text-emerald-900">
                    {s.value}
                  </p>
                  <p className="font-sans text-xs text-luxury-muted tracking-widest uppercase mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-luxury group">
              Our Full Story
              {' '}
              <FiArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
