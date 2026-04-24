import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import { loadCart } from './store/CartSlice'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import RandomQuotesList from './pages/RandomQuotesList'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import AuthLayout from './components/AuthLayout'

import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const authStatus = useSelector(state => state.auth.status)
  const userData = useSelector(state => state.auth.userData)

  // Sync cart automatically when auth state changes!
  useEffect(() => {
    // We skip if it's still globally loading the first check
    if (loading) return;

    if (authStatus && userData) {
        const savedCart = JSON.parse(localStorage.getItem(`bookstore_cart_${userData.$id}`)) || { items: [] };
        dispatch(loadCart(savedCart.items));
    } else {
        const guestCart = JSON.parse(localStorage.getItem("bookstore_cart_guest")) || { items: [] };
        dispatch(loadCart(guestCart.items));
    }
  }, [authStatus, userData, dispatch, loading])

  // Appwrite global session check!
  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(userData))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) {
     return <div className="h-screen flex items-center justify-center text-3xl text-gray-600">Loading Session...</div>
  }

  return (
    <BrowserRouter>
      {/* Global Toast Notifications */}
      <Toaster position="bottom-right" />
      
      {/* The Navbar stays on screen no matter what page we are on */}
      <Navbar />
      
      {/* The Routes change depending on the URL! */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<RandomQuotesList />} />
          <Route path="/login" element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout authentication={false}><Signup /></AuthLayout>} />
          <Route path="/cart" element={<AuthLayout authentication><Cart /></AuthLayout>} />
          <Route path="/checkout" element={<AuthLayout authentication><Checkout /></AuthLayout>} />
          <Route path="/admin" element={<AuthLayout authentication><AdminDashboard /></AuthLayout>} />
          <Route path="/order-confirmation/:id" element={<AuthLayout authentication><OrderConfirmation /></AuthLayout>} />
          <Route path="/profile" element={<AuthLayout authentication><Profile /></AuthLayout>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
