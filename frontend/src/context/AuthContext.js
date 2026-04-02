import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import { authApi, cartApi, catalogApi, injectAuth, ordersApi, paymentsApi } from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [tokens, setTokens] = useState(() => {
    const stored = localStorage.getItem('tokens')
    return stored ? JSON.parse(stored) : null
  })
  const [user, setUser] = useState(() => (tokens?.access ? jwtDecode(tokens.access) : null))

  const logout = useCallback(() => {
    localStorage.removeItem('tokens')
    setTokens(null)
    setUser(null)
    navigate('/login')
  }, [navigate])

  useEffect(() => {
    injectAuth(authApi, () => tokens?.access, logout)
    injectAuth(catalogApi, () => tokens?.access, logout)
    injectAuth(cartApi, () => tokens?.access, logout)
    injectAuth(ordersApi, () => tokens?.access, logout)
    injectAuth(paymentsApi, () => tokens?.access, logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.access])

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.post('login/', { username, password })
    localStorage.setItem('tokens', JSON.stringify(data))
    setTokens(data)
    setUser(jwtDecode(data.access))
    navigate('/')
  }, [navigate])

  const register = useCallback(async (payload) => {
    const { data } = await authApi.post('register/', payload)
    return data
  }, [])

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: Boolean(tokens?.access),
      login,
      logout,
      register,
    }),
    [tokens, user, login, logout, register]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
