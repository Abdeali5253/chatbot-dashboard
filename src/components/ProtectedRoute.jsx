import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('token')

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
