import { useEffect, useState } from 'react'

import { ordersApi } from '../utils/api'

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([])

  const load = async () => {
    const { data } = await ordersApi.get('admin/')
    setOrders(data)
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  const updateStatus = async (orderId, status) => {
    await ordersApi.patch(`admin/${orderId}/status/`, { status })
    await load()
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <h2 className="mb-5 font-display text-3xl font-semibold">Admin - Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="glass-panel rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total: Rs {order.total_amount}</p>
              </div>
              <select className="input !w-48" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminOrdersPage
