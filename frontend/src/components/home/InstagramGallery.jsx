import React from 'react';
import {motion} from 'framer-motion';
import {FaInstagram} from 'react-icons/fa';

const photos = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',

  'https://plus.unsplash.com/premium_photo-1676586308760-e6491557432f?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
];

export default function InstagramGallery () {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className="text-center mb-10"
        >
          <p className="section-subtitle">Follow Our Journey</p>
          <h2 className="section-title">@SKLuxury</h2>
          <div className="section-divider" />
          <a
            href="https://www.instagram.com/srikala_couture?igsh=MWNrMHExZWJ4bDhvMg=="
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 font-sans text-xs tracking-widest uppercase text-luxury-muted hover:text-gold transition-colors"
          >
            <FaInstagram size={16} /> Follow on Instagram
          </a>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {photos.map ((photo, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/srikala_couture?igsh=MWNrMHExZWJ4bDhvMg=="
              target="_blank"
              rel="noreferrer"
              initial={{opacity: 0, scale: 0.9}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true}}
              transition={{delay: i * 0.08, duration: 0.4}}
              className="group relative aspect-square overflow-hidden bg-luxury-beige"
            >
              <img
                src={photo}
                alt={`SK Luxury Instagram ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/50 transition-colors duration-300 flex items-center justify-center">
                <FaInstagram
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  size={22}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
