import { createSlice } from '@reduxjs/toolkit'

const MAX_ITEMS = 8
const saved = JSON.parse(localStorage.getItem('sk_recently_viewed') || '[]')

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { items: saved },
  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload
      if (!product?._id) return
      state.items = [product, ...state.items.filter(p => p._id !== product._id)].slice(0, MAX_ITEMS)
      localStorage.setItem('sk_recently_viewed', JSON.stringify(state.items))
    },
    clearRecentlyViewed: (state) => {
      state.items = []
      localStorage.removeItem('sk_recently_viewed')
    }
  }
})

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions
export default recentlyViewedSlice.reducer
