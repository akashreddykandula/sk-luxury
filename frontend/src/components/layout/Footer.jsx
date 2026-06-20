import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaPinterest,
  FaYoutube,
} from 'react-icons/fa';
import {FiMail, FiPhone, FiMapPin, FiArrowRight} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Footer () {
  const [email, setEmail] = useState ('');

  const handleNewsletter = e => {
    e.preventDefault ();
    if (!email) return;
    toast.success ("Welcome to SK Luxury! You've been subscribed.");
    setEmail ('');
  };

  return (
    <footer className="bg-emerald-950 text-luxury-cream/80">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="page-container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="section-subtitle text-gold/80">Stay Connected</p>
              <h3 className="font-display text-2xl text-white">
                Join the SK Luxury Circle
              </h3>
              <p className="font-sans text-sm text-luxury-cream/60 mt-1">
                Exclusive previews, styling tips & private sale access
              </p>
            </div>
            <form
              onSubmit={handleNewsletter}
              className="flex w-full md:w-auto gap-0 min-w-[320px]"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail (e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3.5 bg-gold text-white hover:bg-gold-600 transition-colors flex items-center gap-2 font-sans text-sm tracking-widest uppercase"
              >
                <FiArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <span className="font-display text-5xl font-semibold text-gold leading-none">
                SK
              </span>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold/60 mt-1">
                Luxury in Every Stitch
              </p>
            </div>
            <p className="font-sans text-sm text-luxury-cream/60 leading-relaxed mb-6">
              Crafting timeless elegance since 2018. Every piece is a testament to our commitment to quality, artistry, and the art of luxury fashion.
            </p>
            <div className="flex items-center gap-4">
              {[
                {Icon: FaInstagram, href: '#', label: 'Instagram'},
                {Icon: FaFacebook, href: '#', label: 'Facebook'},
                {Icon: FaWhatsapp, href: '#', label: 'WhatsApp'},
                {Icon: FaPinterest, href: '#', label: 'Pinterest'},
                {Icon: FaYoutube, href: '#', label: 'YouTube'},
              ].map (({Icon, href, label}) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-luxury-cream/60 hover:border-gold hover:text-gold transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              {[
                {to: '/collections/clothing', label: 'Premium Clothing'},
                {to: '/collections/jewellery', label: 'Designer Jewellery'},
                {to: '/collections/bridal', label: 'Bridal Collection'},
                {to: '/collections', label: 'Custom Designs'},
                {to: '/collections', label: 'New Arrivals'},
                {to: '/collections', label: 'Best Sellers'},
              ].map (({to, label}) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-sm text-luxury-cream/60 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Information
            </h4>
            <ul className="space-y-3">
              {[
                {to: '/about', label: 'About Us'},
                {to: '/contact', label: 'Contact Us'},
                {to: '/track-order', label: 'Track Your Order'},
                {to: '/shipping-policy', label: 'Shipping Policy'},
                {to: '/privacy-policy', label: 'Privacy Policy'},
                {to: '/terms-conditions', label: 'Terms & Conditions'},
              ].map (({to, label}) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-sm text-luxury-cream/60 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin size={15} className="text-gold mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-luxury-cream/60 leading-relaxed">
                  123 Fashion Street, Banjara Hills, Hyderabad – 500034
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={15} className="text-gold shrink-0" />
                <a
                  href="tel:+918374797955"
                  className="font-sans text-sm text-luxury-cream/60 hover:text-gold transition-colors"
                >
                  +91 83747 97955
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={15} className="text-gold shrink-0" />
                <a
                  href="mailto:hello@skluxury.in"
                  className="font-sans text-sm text-luxury-cream/60 hover:text-gold transition-colors"
                >
                  hello@skluxury.in
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 border border-white/10 bg-white/5">
              <p className="font-sans text-xs text-gold tracking-widest uppercase mb-1">
                Store Hours
              </p>
              <p className="font-sans text-sm text-luxury-cream/60">
                Mon – Sat: 10:00 AM – 8:00 PM
              </p>
              <p className="font-sans text-sm text-luxury-cream/60">
                Sunday: 11:00 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="page-container py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-sans text-xs text-luxury-cream/40">
              © {new Date ().getFullYear ()} SK Luxury. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              {[
                'Visa',
                'Mastercard',
                'RuPay',
                'UPI',
                'PhonePe',
                'GPay',
              ].map (m => (
                <span
                  key={m}
                  className="px-2 py-1 border border-white/10 font-sans text-[10px] text-luxury-cream/40"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
