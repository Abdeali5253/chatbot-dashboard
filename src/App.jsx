import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Complaints from './pages/Complaints'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'
import Todo from './pages/Todo'
import AdminUsers from './pages/AdminUsers'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/admin-users" element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
