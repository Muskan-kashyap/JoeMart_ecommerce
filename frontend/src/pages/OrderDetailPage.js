import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { ordersApi } from '../utils/api'

const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered']

const OrderDetailPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  const loadOrder = () => {
    ordersApi.get(`${id}/`).then((res) => setOrder(res.data))
  }

  useEffect(() => {
    loadOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!order) {
    return <section className="container-shell"><div className="glass-panel rounded-2xl p-6">Loading...</div></section>
  }

  const currentIndex = Math.max(statusSteps.indexOf(order.status), 0)
  const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.status)

  const cancelOrder = async () => {
    await ordersApi.post(`${id}/cancel/`)
    loadOrder()
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold">Order #{order.id}</h2>
          <Link to="/orders" className="btn-secondary">Back to orders</Link>
        </div>
        {canCancel && (
          <button className="btn-secondary mt-3" onClick={cancelOrder}>Cancel order</button>
        )}
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Tracking: {order.tracking_number || 'Pending assignment'}
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Shipping</p>
            <p className="font-semibold">{order.shipping_address?.full_name || 'Not set'}</p>
            {order.shipping_address && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {order.shipping_address.line_1}, {order.shipping_address.city}
              </p>
            )}
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Billing</p>
            <p className="font-semibold">{order.billing_address?.full_name || 'Not set'}</p>
            {order.billing_address && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {order.billing_address.line_1}, {order.billing_address.city}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {statusSteps.map((step, index) => (
            <div key={step} className="text-center">
              <div
                className="mx-auto h-3 w-3 rounded-full"
                style={{ backgroundColor: index <= currentIndex ? 'var(--primary)' : 'var(--bg-soft)' }}
              />
              <p className="mt-2 text-xs uppercase" style={{ color: index <= currentIndex ? 'var(--primary)' : 'var(--text-muted)' }}>
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-display text-xl font-semibold">Items</h3>
          <div className="mt-3 space-y-2">
            {(order.items || []).map((item) => (
              <div key={item.id} className="glass-panel rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span>{item.product_name}</span>
                  <span>Rs {item.unit_price} x {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderDetailPage
