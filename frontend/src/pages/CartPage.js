import { useContext } from 'react'
import { Link } from 'react-router-dom'

import CartContext from '../context/CartContext'

const CartPage = () => {
  const { cart, updateItem, removeItem } = useContext(CartContext)
  const subtotal = (cart.items || []).reduce(
    (sum, item) => sum + Number(item.product_detail?.price || 0) * item.quantity,
    0
  )

  return (
    <section className="container-shell pb-12 pt-4">
      <h2 className="mb-5 font-display text-3xl font-semibold">Your Cart</h2>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          {(cart.items || []).map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.product_detail?.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Rs {item.product_detail?.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="input !w-20"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, Number(e.target.value))}
                  />
                  <button className="btn-secondary" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {!cart.items?.length && <div className="glass-panel rounded-2xl p-6">Your cart is empty.</div>}
        </div>

        <aside className="glass-panel h-fit rounded-2xl p-5">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Subtotal</p>
          <p className="mt-1 font-display text-3xl font-semibold">Rs {subtotal.toFixed(2)}</p>
          <Link to="/checkout" className="btn-primary mt-5 inline-block">Proceed to checkout</Link>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
