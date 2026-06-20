import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {FiArrowRight, FiChevronLeft, FiChevronRight} from 'react-icons/fi';

const slides = [
  {
    id: 1,
    eyebrow: 'New Collection 2024',
    title: 'Luxury in\nEvery Stitch',
    subtitle: 'Discover handcrafted couture where tradition meets modern elegance',
    cta: 'Explore Collection',
    ctaLink: '/collections',
    bg: 'from-emerald-950/80 via-emerald-900/50 to-transparent',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    align: 'center',
  },
  {
    id: 2,
    eyebrow: 'Bridal 2024',
    title: 'Your Perfect\nBridal Story',
    subtitle: 'Exquisite bridal collections crafted for your most precious moments',
    cta: 'Bridal Collection',
    ctaLink: '/collections/bridal',
    bg: 'from-black/70 via-black/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1779253806162-a58a28c1c81a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    align: 'left',
  },
  {
    id: 3,
    eyebrow: 'Designer Jewellery',
    title: 'Adorned in\nPure Gold',
    subtitle: 'Timeless jewellery pieces that tell stories of heritage and artistry',
    cta: 'Shop Jewellery',
    ctaLink: '/collections/jewellery',
    bg: 'from-emerald-950/75 via-teal-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80',
    align: 'right',
  },
];

export default function HeroSection () {
  const [current, setCurrent] = useState (0);
  const [isAnimating, setIsAnimating] = useState (false);

  useEffect (
    () => {
      const timer = setInterval (() => goNext (), 6000);
      return () => clearInterval (timer);
    },
    [current]
  );

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating (true);
    setCurrent (p => (p + 1) % slides.length);
    setTimeout (() => setIsAnimating (false), 800);
  };
  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating (true);
    setCurrent (p => (p - 1 + slides.length) % slides.length);
    setTimeout (() => setIsAnimating (false), 800);
  };

  const slide = slides[current];
  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[slide.align];

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{opacity: 0, scale: 1.05}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.9, ease: 'easeInOut'}}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 page-container">
        <div
          className={`flex flex-col ${alignClass} max-w-2xl ${slide.align === 'right' ? 'ml-auto' : slide.align === 'center' ? 'mx-auto' : ''}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.7, ease: 'easeOut'}}
              className={`flex flex-col ${alignClass}`}
            >
              <motion.p
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
                className="font-sans text-xs text-gold tracking-[0.4em] uppercase mb-4"
              >
                {slide.eyebrow}
              </motion.p>
              <motion.h1
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
                className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] whitespace-pre-line"
                style={{textShadow: '0 2px 20px rgba(0,0,0,0.3)'}}
              >
                {slide.title}
              </motion.h1>
              <motion.div
                initial={{width: 0}}
                animate={{width: '80px'}}
                transition={{delay: 0.5, duration: 0.6}}
                className="h-px bg-gold my-5"
              />
              <motion.p
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.4}}
                className="font-sans text-base md:text-lg text-white/80 max-w-md leading-relaxed mb-8"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.6}}
                className="flex flex-wrap gap-4"
              >
                <Link to={slide.ctaLink} className="btn-gold group">
                  {slide.cta}
                  {' '}
                  <FiArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white font-sans text-sm tracking-widest uppercase hover:bg-white/10 transition-colors"
                >
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={goPrev}
          className="w-12 h-12 bg-black/20 hover:bg-black/40 border border-white/20 flex items-center justify-center text-white transition-all hover:border-gold"
        >
          <FiChevronLeft size={22} />
        </button>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={goNext}
          className="w-12 h-12 bg-black/20 hover:bg-black/40 border border-white/20 flex items-center justify-center text-white transition-all hover:border-gold"
        >
          <FiChevronRight size={22} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map ((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent (i)}
            className={`transition-all duration-300 ${i === current ? 'w-8 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white rounded-full'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2">
        <motion.div
          animate={{y: [0, 8, 0]}}
          transition={{duration: 1.5, repeat: Infinity}}
          className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
        />
        <p className="font-sans text-[9px] text-white/50 tracking-[0.3em] uppercase rotate-90 mt-2">
          Scroll
        </p>
      </div>
    </section>
  );
}
