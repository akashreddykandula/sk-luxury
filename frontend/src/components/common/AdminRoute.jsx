import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute({ children }) {
  const { user, token } = useSelector(s => s.auth)
  if (!user || !token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
