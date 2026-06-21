import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {FiArrowRight} from 'react-icons/fi';
import axios from 'axios';

export default function CollectionBanner () {
  const [banners, setBanners] = useState ([]);

  useEffect (() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get ('/api/banners');
        setBanners (res.data.banners || []);
      } catch (error) {
        console.error ('Failed to fetch banners:', error);
      }
    };

    fetchBanners ();
  }, []);

  if (!banners.length) return null;

  return (
    <section className="py-16 bg-emerald-950 overflow-hidden">
      <div className="page-container">
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map ((item, i) => (
            <motion.div
              key={item._id}
              initial={{opacity: 0, x: i === 0 ? -30 : 30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true}}
              transition={{duration: 0.7}}
              className="group relative overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />

                <div className="absolute bottom-8 left-8">
                  <p className="font-sans text-xs text-gold tracking-[0.3em] uppercase mb-1">
                    {item.subtitle}
                  </p>

                  <h3 className="font-display text-3xl text-white mb-4">
                    {item.title}
                  </h3>

                  <Link
                    to={item.buttonLink || '/collections'}
                    className="inline-flex items-center gap-2 border border-gold text-gold px-5 py-2.5 font-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-white transition-all duration-300"
                  >
                    {item.buttonText || 'Shop Now'}
                    <FiArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
