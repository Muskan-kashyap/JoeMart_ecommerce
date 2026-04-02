import { useContext, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import AuthContext from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'
import AboutPage from './pages/AboutPage'
import AccountPage from './pages/AccountPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminProductEditPage from './pages/AdminProductEditPage'
import AdminProductsPage from './pages/AdminProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import RegisterPage from './pages/RegisterPage'
import ShopPage from './pages/ShopPage'

function App() {
  const { isAuthenticated, user } = useContext(AuthContext)
  const [theme, setTheme] = useState('nocturne-sage')

  return (
    <main className="app-shell" data-theme={theme}>
      <Header theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <OrderDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && Boolean(user?.is_staff)}>
              <AdminProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && Boolean(user?.is_staff)}>
              <AdminProductEditPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && Boolean(user?.is_staff)}>
              <AdminOrdersPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </main>
  )
}

export default App
