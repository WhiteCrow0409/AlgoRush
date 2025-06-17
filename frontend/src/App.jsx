import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './component/Navbar'
import NotFound from './pages/Notfound'
import Authpage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import { useAuthentication } from './auth'

function App() {

  const { isAuthorized } = useAuthentication()

  const ProtectedLogin = () => {
    return isAuthorized ? <Navigate to="/" /> : <Authpage initialMethod='login' />
  }

  const ProtectedRegister = () => {
    return isAuthorized ? <Navigate to="/" /> : <Authpage initialMethod='register' />
  }

  const ProtectedDashboard = () => {
    return isAuthorized ? <Dashboard /> : <Navigate to="/login" />
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedDashboard />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
