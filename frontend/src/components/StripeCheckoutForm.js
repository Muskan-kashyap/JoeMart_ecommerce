import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

import { paymentsApi } from '../utils/api'

const StripeCheckoutForm = ({ clientSecret, orderId, onDone }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    try {
      const card = elements.getElement(CardElement)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      })

      if (result.error) {
        alert(result.error.message || 'Payment failed')
        return
      }

      await paymentsApi.post('confirm/', { order_id: orderId })
      onDone()
    } catch (error) {
      alert(error.response?.data?.detail || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div className="rounded-xl border bg-white p-4">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button className="btn-primary" type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing payment...' : 'Complete secure payment'}
      </button>
    </form>
  )
}

export default StripeCheckoutForm
