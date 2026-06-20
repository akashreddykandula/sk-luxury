import React from 'react';
import {motion} from 'framer-motion';

export default function Preloader () {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-emerald-950"
      exit={{opacity: 0}}
      transition={{duration: 0.8}}
    >
      {/* Decorative lines */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.3}}
      >
        {[...Array (6)].map ((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gold/20"
            style={{left: `${(i + 1) * (100 / 7)}%`, top: 0, bottom: 0}}
            initial={{scaleY: 0, transformOrigin: 'top'}}
            animate={{scaleY: 1}}
            transition={{delay: i * 0.1, duration: 1.5, ease: 'easeOut'}}
          />
        ))}
      </motion.div>

      {/* Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{opacity: 0, scale: 0.8}}
        animate={{opacity: 1, scale: 1}}
        transition={{delay: 0.3, duration: 0.8, ease: 'easeOut'}}
      >
        <motion.div
          className="text-8xl font-display font-semibold text-[#D45B12] mb-2"
          style={{textShadow: '0 0 40px rgba(212,91,18,0.5)'}}
          animate={{
            textShadow: [
              '0 0 40px rgba(212,91,18,0.3)',
              '0 0 60px rgba(212,91,18,0.8)',
              '0 0 40px rgba(212,91,18,0.3)',
            ],
          }}
          transition={{duration: 2, repeat: Infinity}}
        >
          SK
        </motion.div>

        <motion.div
          className="h-px w-0 bg-gold"
          animate={{width: '120px'}}
          transition={{delay: 0.8, duration: 0.8, ease: 'easeOut'}}
        />

        <motion.p
          className="mt-4 font-sans text-xs text-luxury-cream/70 tracking-[0.5em] uppercase"
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 1.2, duration: 0.6}}
        >
          Luxury in Every Stitch
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div className="absolute bottom-12 w-48 h-px bg-white/10">
        <motion.div
          className="h-full bg-gold"
          initial={{width: '0%'}}
          animate={{width: '100%'}}
          transition={{delay: 0.5, duration: 2, ease: 'easeInOut'}}
        />
      </motion.div>
    </motion.div>
  );
}
