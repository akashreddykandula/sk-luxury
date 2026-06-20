import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const { user, token } = useSelector(s => s.auth)
  if (!user || !token) return <Navigate to="/login" replace />
  return children
}
