import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import uiReducer from './slices/uiSlice'
import recentlyViewedReducer from './slices/recentlyViewedSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    ui: uiReducer,
    recentlyViewed: recentlyViewedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export default store
