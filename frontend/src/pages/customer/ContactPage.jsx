import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { generalSupport, bridalConsultation } from '../../utils/whatsapp'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <>
      <Helmet><title>Contact Us | SK Luxury</title></Helmet>

      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80" alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-subtitle text-gold/90">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-white">Contact Us</h1>
        </div>
      </div>

      <section className="section-padding bg-luxury-cream">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-subtitle">We'd Love to Hear From You</p>
              <h2 className="font-display text-4xl text-luxury-dark mb-5">Visit Our Boutique</h2>
              <div className="w-12 h-px bg-gold mb-8" />

              <div className="space-y-6 mb-10">
                {[
                  { icon: FiMapPin, label: 'Our Address', value: '7-142, Sastri Gari Street, Prasadampadu, Vijayawada - 521108' },
                  { icon: FiPhone, label: 'Phone', value: '+91 8885372979 \n+91 8374797955' },
                  { icon: FiMail, label: 'Email', value: 'srikalacouture@gmail.com'},
                  { icon: FiClock, label: 'Store Hours', value: 'Mon – Sat: 10:00 AM – 8:00 PM\nSunday: 11:00 AM – 6:00 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-1">{label}</p>
                      <p className="font-sans text-sm text-luxury-dark whitespace-pre-line leading-relaxed">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-emerald-950 p-6">
                <p className="font-display text-xl text-white mb-2">Prefer WhatsApp?</p>
                <p className="font-sans text-sm text-white/60 mb-5">Chat with us directly for instant responses</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={generalSupport}
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-5 font-sans text-xs tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors">
                    <FaWhatsapp size={16} /> Chat Now
                  </button>
                  <button onClick={bridalConsultation}
                    className="flex items-center justify-center gap-2 border border-gold text-gold py-3 px-5 font-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-white transition-all">
                    Book Bridal Consultation
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="bg-white shadow-card p-8 space-y-5">
                <h3 className="font-display text-2xl text-luxury-dark mb-2">Send a Message</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="luxury-label">Full Name</label>
                    <input className="luxury-input" placeholder="Your name" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="luxury-label">Phone</label>
                    <input className="luxury-input" placeholder="Your phone number"
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="luxury-label">Email Address</label>
                  <input type="email" className="luxury-input" placeholder="your@email.com" required
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="luxury-label">Subject</label>
                  <select className="luxury-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select a topic</option>
                    <option>General Enquiry</option>
                    <option>Bridal Consultation</option>
                    <option>Custom Design Request</option>
                    <option>Jewellery Customisation</option>
                    <option>Order Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="luxury-label">Message</label>
                  <textarea className="luxury-input resize-none h-32" placeholder="Tell us how we can help you..."
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                </div>
                <button type="submit" disabled={sending}
                  className={`btn-luxury w-full justify-center ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><FiSend size={14} /> Send Message</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
