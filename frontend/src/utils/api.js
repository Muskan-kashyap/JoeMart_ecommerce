import axios from 'axios'

const authApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth/'
})

const catalogApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/catalog/'
})

const cartApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/cart/'
})

const ordersApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/orders/'
})

const paymentsApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/payments/'
})

const injectAuth = (instance, getToken, onUnauthorized) => {
  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && onUnauthorized) {
        onUnauthorized()
      }
      return Promise.reject(error)
    }
  )
}

export { authApi, catalogApi, cartApi, ordersApi, paymentsApi, injectAuth }
