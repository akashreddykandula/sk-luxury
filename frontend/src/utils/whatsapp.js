const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918374797955'

export const openWhatsApp = (message) => {
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
}

export const productEnquiry = (product) => {
  const message = `Hello SK Luxury! 👋

I am interested in:

*Product Name:* ${product.name}
*Product Price:* ₹${product.salePrice && product.isOnSale ? product.salePrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
*SKU:* ${product.sku || 'N/A'}

Please share more details about this product. 🙏`
  openWhatsApp(message)
}

export const customOrderEnquiry = (product) => {
  const message = `Hello SK Luxury! 👋

I would like to customize this product:

*Product Name:* ${product.name}
*Product Price:* ₹${product.price.toLocaleString('en-IN')}

Please contact me to discuss customization options. 🙏`
  openWhatsApp(message)
}

export const bridalConsultation = () => {
  const message = `Hello SK Luxury! 👋

I am interested in a *Bridal Consultation*.

I would like to discuss:
- Bridal outfit options
- Jewellery collection
- Custom bridal designs
- Pricing and availability

Please help me schedule a consultation. 🌸`
  openWhatsApp(message)
}

export const customStitching = () => {
  const message = `Hello SK Luxury! 👋

I am interested in your *Custom Stitching* services.

Please share details about:
- Custom design options
- Fabric choices
- Pricing
- Timeline

Looking forward to hearing from you! 🙏`
  openWhatsApp(message)
}

export const jewelleryCustomisation = () => {
  const message = `Hello SK Luxury! 👋

I am interested in *Jewellery Customisation*.

Please share details about your custom jewellery options and pricing. 💍`
  openWhatsApp(message)
}

export const orderSupport = (orderNumber) => {
  const message = `Hello SK Luxury! 👋

I need support for my order:

*Order Number:* ${orderNumber}

Please help me with my query. 🙏`
  openWhatsApp(message)
}

export const generalSupport = () => {
  const message = `Hello SK Luxury! 👋

I need assistance. Can you please help me? 🙏`
  openWhatsApp(message)
}
