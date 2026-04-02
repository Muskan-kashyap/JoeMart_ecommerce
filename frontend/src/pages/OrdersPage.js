import { useEffect, useState } from 'react'

import { ordersApi } from '../utils/api'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    ordersApi.get('').then((res) => setOrders(res.data))
  }, [])

  return (
    <section className="container-shell pb-12 pt-4">
      <h2 className="mb-5 font-display text-3xl font-semibold">Order History</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Order #{order.id}</p>
              <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase" style={{ backgroundColor: 'var(--bg-soft)' }}>
                {order.status}
              </span>
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Total: Rs {order.total_amount} | Tracking: {order.tracking_number || 'Pending assignment'}
            </p>
            <a className="btn-secondary mt-3 inline-block" href={`/orders/${order.id}`}>View details</a>
          </article>
        ))}
        {!orders.length && <div className="glass-panel rounded-2xl p-6">No orders yet.</div>}
      </div>
    </section>
  )
}

export default OrdersPage
