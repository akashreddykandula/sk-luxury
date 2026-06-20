export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const getDiscount = (price, salePrice) => {
  if (!salePrice || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str

export const getImageUrl = (images) => {
  if (!images || images.length === 0) return 'https://via.placeholder.com/400x500?text=SK+Luxury'
  const primary = images.find(i => i.isPrimary)
  return (primary || images[0])?.url || 'https://via.placeholder.com/400x500?text=SK+Luxury'
}

export const statusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const formatDateLong = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const getDeliveryEstimateText = (estimatedDelivery, orderStatus) => {
  if (orderStatus === 'delivered') return 'Delivered'
  if (orderStatus === 'cancelled') return 'Order Cancelled'
  if (orderStatus === 'returned') return 'Order Returned'
  if (!estimatedDelivery) return 'Calculating...'

  const now = new Date()
  const est = new Date(estimatedDelivery)
  const diffDays = Math.ceil((est - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `Expected ${formatDateLong(estimatedDelivery)}`
  if (diffDays === 0) return 'Arriving today'
  if (diffDays === 1) return 'Arriving tomorrow'
  return `Estimated Delivery by ${formatDateLong(estimatedDelivery)}`
}

export const ORDER_STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered']

export const getOrderStatusStepIndex = (status) => {
  if (status === 'cancelled' || status === 'returned') return -1
  if (status === 'pending') return 0
  return ORDER_STATUS_STEPS.indexOf(status)
}
