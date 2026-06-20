import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
    preloaderDone: false,
    activeModal: null,
  },
  reducers: {
    toggleCart: (state) => { state.cartOpen = !state.cartOpen },
    openCart: (state) => { state.cartOpen = true },
    closeCart: (state) => { state.cartOpen = false },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen },
    closeSearch: (state) => { state.searchOpen = false },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false },
    setPreloaderDone: (state) => { state.preloaderDone = true },
    setActiveModal: (state, action) => { state.activeModal = action.payload },
    closeModal: (state) => { state.activeModal = null },
  }
})

export const {
  toggleCart, openCart, closeCart, toggleSearch, closeSearch,
  toggleMobileMenu, closeMobileMenu, setPreloaderDone, setActiveModal, closeModal
} = uiSlice.actions
export default uiSlice.reducer
