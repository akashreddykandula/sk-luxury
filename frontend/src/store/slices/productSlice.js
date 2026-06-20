import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params })
    return res.data
  } catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${id}`)
    return res.data.product
  } catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const fetchFeatured = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/products/featured'); return res.data.products }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const fetchNewArrivals = createAsyncThunk('products/newArrivals', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/products/new-arrivals'); return res.data.products }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const fetchBestSellers = createAsyncThunk('products/bestSellers', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/products/best-sellers'); return res.data.products }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const searchProducts = createAsyncThunk('products/search', async (q, { rejectWithValue }) => {
  try { const res = await api.get('/products/search', { params: { q } }); return res.data.products }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [], currentProduct: null, featured: [], newArrivals: [],
    bestSellers: [], searchResults: [], pagination: {},
    loading: false, searchLoading: false, error: null
  },
  reducers: { clearCurrentProduct: (state) => { state.currentProduct = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.products; state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.currentProduct = null })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.currentProduct = action.payload })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => { state.newArrivals = action.payload })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload })
      .addCase(searchProducts.pending, (state) => { state.searchLoading = true })
      .addCase(searchProducts.fulfilled, (state, action) => { state.searchLoading = false; state.searchResults = action.payload })
      .addCase(searchProducts.rejected, (state) => { state.searchLoading = false })
  }
})

export const { clearCurrentProduct } = productSlice.actions
export default productSlice.reducer
