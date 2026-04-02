import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import AuthContext from './AuthContext'
import { cartApi, injectAuth } from '../utils/api'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { tokens, logout, isAuthenticated } = useContext(AuthContext)
  const [cart, setCart] = useState({ items: [] })

  useEffect(() => {
    injectAuth(cartApi, () => tokens?.access, logout)
  }, [tokens?.access, logout])

  useEffect(() => {
    if (isAuthenticated) {
      cartApi.get('').then((res) => setCart(res.data)).catch(() => {})
    } else {
      setCart({ items: [] })
    }
  }, [isAuthenticated])

  const addToCart = async (product, quantity = 1) => {
    const { data } = await cartApi.post('items/', { product: product.id, quantity })
    setCart(data)
  }

  const updateItem = async (itemId, quantity) => {
    const { data } = await cartApi.patch(`items/${itemId}/`, { quantity })
    setCart(data)
  }

  const removeItem = async (itemId) => {
    const { data } = await cartApi.delete(`items/${itemId}/`)
    setCart(data)
  }

  const count = useMemo(() => cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0, [cart])

  return (
    <CartContext.Provider value={{ cart, count, addToCart, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
