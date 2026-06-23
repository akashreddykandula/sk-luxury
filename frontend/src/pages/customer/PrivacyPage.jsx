import React from 'react'
import { Helmet } from 'react-helmet-async'

function PolicyPage({ title, children }) {
  return (
    <>
      <Helmet><title>{title} | SK Luxury</title></Helmet>
      <div className="bg-emerald-950 py-12 text-center">
        <h1 className="font-display text-4xl text-white">{title}</h1>
        <p className="font-sans text-xs text-gold/70 tracking-widest uppercase mt-2">Last Updated: January 2024</p>
      </div>
      <div className="page-container py-12 max-w-4xl mx-auto">
        <div className="bg-white shadow-card p-8 md:p-12 font-sans text-luxury-muted leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-luxury-dark mb-3">{title}</h2>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <Section title="Information We Collect">
        <p>We collect information you provide directly to us, including name, email address, phone number, shipping address, and payment information when you make a purchase or create an account.</p>
        <p>We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, and pages visited.</p>
      </Section>
      <Section title="How We Use Your Information">
        <p>We use the information we collect to process orders, send order confirmations and shipping updates, respond to your enquiries, and send promotional communications (with your consent).</p>
        <p>We may also use your information to improve our website, prevent fraud, and comply with legal obligations.</p>
      </Section>
      <Section title="Information Sharing">
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. We may share your information with service providers who assist us in operating our website and fulfilling orders (such as payment processors and shipping companies).</p>
      </Section>
      <Section title="Data Security">
        <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.</p>
      </Section>
      <Section title="Contact Us">
        <p>If you have questions about this Privacy Policy, please contact us at srikalacouture@gmail.com or call +91 8374797955.</p>
      </Section>
    </PolicyPage>
  )
}

export function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions">
      <Section title="Acceptance of Terms">
        <p>By accessing and using the SK Luxury website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>
      </Section>
      <Section title="Products and Pricing">
        <p>All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices at any time without notice. We make every effort to display accurate product descriptions and images, but colours may vary slightly due to monitor settings.</p>
      </Section>
      <Section title="Orders and Payment">
        <p>By placing an order, you confirm that all information provided is accurate. We accept payment via Razorpay, which supports UPI, cards, and net banking. Orders are confirmed only after successful payment.</p>
      </Section>
      <Section title="Cancellation Policy">
        <p>Orders may be cancelled within 24 hours of placement. Custom and bridal orders cannot be cancelled once production has begun. Contact us immediately at srikalacouture@gmail.com to request a cancellation.</p>
      </Section>
      <Section title="Intellectual Property">
        <p>All content on this website, including images, designs, logos, and text, is the intellectual property of SK Luxury. Unauthorised reproduction or use is strictly prohibited.</p>
      </Section>
      <Section title="Contact">
        <p>For any questions regarding these Terms, contact us at srikalacouture@gmail.com</p>
      </Section>
    </PolicyPage>
  )
}

export function ShippingPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <Section title="Shipping Coverage">
        <p>We ship pan-India to all major cities and towns. International shipping is available on request — please contact us for rates and delivery timelines.</p>
      </Section>
      <Section title="Delivery Timelines">
        <p><strong className="text-luxury-dark">Ready-to-ship items:</strong> 3–5 business days for metro cities; 5–7 business days for other locations.</p>
        <p><strong className="text-luxury-dark">Custom / Made-to-order items:</strong> 10–15 business days depending on complexity.</p>
        <p><strong className="text-luxury-dark">Bridal orders:</strong> Please allow 21–30 days. We recommend ordering at least 6–8 weeks before your event.</p>
      </Section>
      <Section title="Shipping Charges">
        <p>Free shipping on all orders above ₹999. Orders below ₹999 attract a flat shipping charge of ₹99. Express delivery options are available at additional cost.</p>
      </Section>
      <Section title="Order Tracking">
        <p>Once your order is dispatched, you will receive a shipping confirmation email with your tracking number. You can also track your order via WhatsApp by messaging us your order number.</p>
      </Section>
      <Section title="Returns & Exchanges">
        <p>We accept returns within 7 days of delivery for unused, unwashed items in original packaging. Custom orders, jewellery, and bridal wear are not eligible for return. To initiate a return, contact us at Srikalacouture@gmail.com or call us at [+91 8374797955] with your order number and reason for return.</p>
      </Section>
      <Section title="Damaged or Wrong Items">
        <p>If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with photographs. We will arrange a replacement or full refund at no additional cost to you.</p>
      </Section>
    </PolicyPage>
  )
}

export default PrivacyPage
