import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { generalSupport, bridalConsultation, customStitching, jewelleryCustomisation } from '../../utils/whatsapp'

const options = [
  { label: 'General Support', action: generalSupport, icon: '💬' },
  { label: 'Bridal Consultation', action: bridalConsultation, icon: '👰' },
  { label: 'Custom Stitching', action: customStitching, icon: '✂️' },
  { label: 'Jewellery Customisation', action: jewelleryCustomisation, icon: '💍' },
]

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white shadow-luxury-lg rounded-lg overflow-hidden w-56 mb-2"
          >
            <div className="bg-emerald-900 px-4 py-3">
              <p className="font-sans text-xs text-luxury-cream/80 tracking-widest uppercase">SK Luxury</p>
              <p className="font-sans text-sm text-white font-medium">How can we help?</p>
            </div>
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => { opt.action(); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-luxury-beige transition-colors border-b border-gray-100 last:border-0"
              >
                <span className="text-lg">{opt.icon}</span>
                <span className="font-sans text-sm text-luxury-dark">{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-gold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Chat on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <FaTimes className="text-white text-xl" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <FaWhatsapp className="text-white text-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
