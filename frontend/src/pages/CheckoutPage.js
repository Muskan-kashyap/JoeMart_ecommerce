import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import CartContext from '../context/CartContext'
import StripeCheckoutForm from '../components/StripeCheckoutForm'
import { authApi, ordersApi, paymentsApi } from '../utils/api'

const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null

const CheckoutPage = () => {
  const { cart } = useContext(CartContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [devMode, setDevMode] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [shippingAddressId, setShippingAddressId] = useState('')
  const [billingAddressId, setBillingAddressId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    authApi.get('addresses/')
      .then((res) => {
        const data = res.data
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
        setAddresses(list)
      })
      .catch(() => setAddresses([]))
  }, [])

  const startCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      if (!shippingAddressId || !billingAddressId) {
        setError('Please select shipping and billing addresses before checkout.')
        return
      }
      const orderRes = await ordersApi.post('checkout/', {
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
      })
      const newOrderId = orderRes.data.id
      const paymentRes = await paymentsApi.post('intent/', { order_id: newOrderId })
      setOrderId(newOrderId)
      setClientSecret(paymentRes.data.client_secret)
      setDevMode(String(paymentRes.data.client_secret || '').startsWith('dev_secret_'))
    } catch (error) {
      setError(error.response?.data?.detail || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  const completeDevPayment = async () => {
    await paymentsApi.post('confirm/', { order_id: orderId })
    navigate('/orders')
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <div className="glass-panel mx-auto max-w-2xl rounded-2xl p-8">
        <h2 className="font-display text-3xl font-semibold">Checkout</h2>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
          Use secure checkout. If Stripe keys are not set, demo mode is used.
        </p>
        <p className="mt-5 text-lg font-semibold">Items in cart: {(cart.items || []).length}</p>
        {error && <p className="mt-3 text-sm" style={{ color: '#e11d48' }}>{error}</p>}

        <div className="mt-4 grid gap-3">
          <select className="input" value={shippingAddressId} onChange={(e) => setShippingAddressId(e.target.value)}>
            <option value="">Select shipping address</option>
            {addresses.filter((addr) => addr.address_type === 'shipping').map((addr) => (
              <option key={addr.id} value={addr.id}>{addr.full_name} - {addr.city}</option>
            ))}
          </select>
          <select className="input" value={billingAddressId} onChange={(e) => setBillingAddressId(e.target.value)}>
            <option value="">Select billing address</option>
            {addresses.filter((addr) => addr.address_type === 'billing').map((addr) => (
              <option key={addr.id} value={addr.id}>{addr.full_name} - {addr.city}</option>
            ))}
          </select>
        </div>

        {!clientSecret && (
          <button className="btn-primary mt-6" onClick={startCheckout} disabled={loading}>
            {loading ? 'Preparing checkout...' : 'Start secure checkout'}
          </button>
        )}

        {clientSecret && devMode && (
          <div className="mt-6">
            <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              Demo mode: Stripe publishable key is missing. Click below to simulate successful payment.
            </p>
            <button className="btn-primary" onClick={completeDevPayment}>Complete demo payment</button>
          </div>
        )}

        {clientSecret && !devMode && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckoutForm clientSecret={clientSecret} orderId={orderId} onDone={() => navigate('/orders')} />
          </Elements>
        )}
      </div>
    </section>
  )
}

export default CheckoutPage
