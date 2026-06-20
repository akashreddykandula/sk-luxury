import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {FiArrowRight} from 'react-icons/fi';

const collections = [
  {
    title: 'Clothing',
    subtitle: 'Premium Fabrics',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    link: '/collections/clothing',
    count: '200+ Styles',
  },
  {
    title: 'Jewellery',
    subtitle: 'Designer Pieces',
    image: 'https://images.unsplash.com/photo-1628926379972-9843ad139a8c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/collections/jewellery',
    count: '150+ Designs',
  },
  {
    title: 'Bridal',
    subtitle: 'Dream Weddings',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    link: '/collections/bridal',
    count: '50+ Collections',
  },
  {
    title: 'Custom',
    subtitle: 'Made for You',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
    link: '/contact',
    count: 'Bespoke Designs',
  },
];

export default function CollectionGrid () {
  return (
    <section className="section-padding bg-luxury-cream">
      <div className="page-container">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className="text-center mb-12"
        >
          <p className="section-subtitle">Shop by Category</p>
          <h2 className="section-title">Our Collections</h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {collections.map ((col, i) => (
            <motion.div
              key={col.title}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: i * 0.1}}
            >
              <Link
                to={col.link}
                className="group block relative overflow-hidden aspect-[3/4] bg-luxury-beige"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="font-sans text-[10px] text-gold tracking-[0.3em] uppercase mb-1">
                    {col.subtitle}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-white font-medium">
                    {col.title}
                  </h3>
                  <p className="font-sans text-xs text-white/60 mt-1">
                    {col.count}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="font-sans text-xs tracking-widest uppercase">
                      Explore
                    </span>
                    <FiArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
