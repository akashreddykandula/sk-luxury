import { createSlice } from '@reduxjs/toolkit'

const savedCart = JSON.parse(localStorage.getItem('sk_cart') || '{"items":[],"total":0,"count":0}')

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping
  return { subtotal, shipping, total, count }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart.items || [],
    ...calculateTotals(savedCart.items || [])
  },
  reducers: {
    addToCart: (state, action) => {
      const { _id, name, price, salePrice, isOnSale, image, size, color, quantity = 1 } = action.payload
      const existingIdx = state.items.findIndex(i => i._id === _id && i.size === size && i.color === color)
      const finalPrice = isOnSale && salePrice ? salePrice : price
      if (existingIdx >= 0) {
        state.items[existingIdx].quantity += quantity
      } else {
        state.items.push({ _id, name, price: finalPrice, originalPrice: price, image, size, color, quantity })
      }
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
      localStorage.setItem('sk_cart', JSON.stringify({ items: state.items }))
    },
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload
      state.items = state.items.filter(i => !(i._id === id && i.size === size && i.color === color))
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
      localStorage.setItem('sk_cart', JSON.stringify({ items: state.items }))
    },
    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload
      const item = state.items.find(i => i._id === id && i.size === size && i.color === color)
      if (item) item.quantity = quantity
      if (item && item.quantity <= 0) {
        state.items = state.items.filter(i => !(i._id === id && i.size === size && i.color === color))
      }
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
      localStorage.setItem('sk_cart', JSON.stringify({ items: state.items }))
    },
    clearCart: (state) => {
      state.items = []; state.subtotal = 0; state.shipping = 0; state.total = 0; state.count = 0
      localStorage.removeItem('sk_cart')
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
