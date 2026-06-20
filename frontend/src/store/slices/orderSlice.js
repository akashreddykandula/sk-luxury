import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/orders', data); return res.data.order }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create order') }
})

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/orders/my-orders'); return res.data.orders }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load orders') }
})

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try { const res = await api.get(`/orders/${id}`); return res.data.order }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Order not found') }
})

export const trackOrderByDetails = createAsyncThunk('orders/track', async ({ orderNumber, email }, { rejectWithValue }) => {
  try { const res = await api.post('/orders/track', { orderNumber, email }); return res.data.order }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Order not found') }
})

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try { const res = await api.put(`/orders/${id}/cancel`, { reason }); return res.data.order }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to cancel order') }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], currentOrder: null, trackedOrder: null, loading: false, trackingLoading: false, error: null, trackingError: null },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null },
    clearTrackedOrder: (state) => { state.trackedOrder = null; state.trackingError = null },
    clearOrderError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.orders = action.payload })
      .addCase(fetchOrder.pending, (state) => { state.loading = true })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(trackOrderByDetails.pending, (state) => { state.trackingLoading = true; state.trackingError = null })
      .addCase(trackOrderByDetails.fulfilled, (state, action) => { state.trackingLoading = false; state.trackedOrder = action.payload })
      .addCase(trackOrderByDetails.rejected, (state, action) => { state.trackingLoading = false; state.trackingError = action.payload; state.trackedOrder = null })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload
        state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o)
      })
  }
})

export const { clearCurrentOrder, clearTrackedOrder, clearOrderError } = orderSlice.actions
export default orderSlice.reducer
