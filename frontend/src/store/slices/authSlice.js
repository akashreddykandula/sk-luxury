import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const user = JSON.parse(localStorage.getItem('sk_user') || 'null')
const token = localStorage.getItem('sk_token') || null

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('sk_token', res.data.token)
    localStorage.setItem('sk_user', JSON.stringify(res.data.user))
    return res.data
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed') }
})

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('sk_token', res.data.token)
    localStorage.setItem('sk_user', JSON.stringify(res.data.user))
    return res.data
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed') }
})

export const getProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/profile')
    return res.data.user
  } catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data)
    return res.data.user
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update profile') }
})

export const updatePassword = createAsyncThunk('auth/updatePassword', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/password', data)
    localStorage.setItem('sk_token', res.data.token)
    localStorage.setItem('sk_user', JSON.stringify(res.data.user))
    return res.data
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update password') }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data.message
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to send reset link') }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/auth/reset-password/${token}`, { password })
    localStorage.setItem('sk_token', res.data.token)
    localStorage.setItem('sk_user', JSON.stringify(res.data.user))
    return res.data
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to reset password') }
})

export const toggleWishlist = createAsyncThunk('auth/toggleWishlist', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/auth/wishlist/${productId}`)
    return res.data
  } catch (e) { return rejectWithValue(e.response?.data?.message) }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, loading: false, error: null, resetStatus: null, resetMessage: null },
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null
      localStorage.removeItem('sk_token'); localStorage.removeItem('sk_user')
    },
    clearError: (state) => { state.error = null },
    clearResetStatus: (state) => { state.resetStatus = null; state.resetMessage = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('sk_user', JSON.stringify(action.payload))
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('sk_user', JSON.stringify(action.payload))
      })
      .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(updatePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.resetStatus = null })
      .addCase(forgotPassword.fulfilled, (state, action) => { state.loading = false; state.resetStatus = 'sent'; state.resetMessage = action.payload })
      .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.resetStatus = 'error'; state.resetMessage = action.payload })
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (state.user) state.user.wishlist = action.payload.wishlist
      })
  }
})

export const { logout, clearError, clearResetStatus } = authSlice.actions
export default authSlice.reducer
