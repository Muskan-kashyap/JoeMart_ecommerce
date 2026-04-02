import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

import AuthContext from '../context/AuthContext'
import CartContext from '../context/CartContext'

const Header = ({ theme, setTheme }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const { count } = useContext(CartContext)

  return (
    <header className="container-shell py-6">
      <div className="glass-panel flex items-center justify-between rounded-2xl px-5 py-4 backdrop-blur-xl">
        <Link to="/" className="font-display text-xl font-semibold" style={{ color: 'var(--primary)' }}>
          JoeMart
        </Link>

        <nav className="hidden gap-4 md:flex">
          <Link to="/shop" className="btn-secondary">Shop</Link>
          <Link to="/orders" className="btn-secondary">Orders</Link>
          {isAuthenticated && <Link to="/account" className="btn-secondary">Account</Link>}
          {user?.is_staff && <Link to="/admin/products" className="btn-secondary">Manage Products</Link>}
          {user?.is_staff && <Link to="/admin/orders" className="btn-secondary">Manage Orders</Link>}
          <Link to="/about" className="btn-secondary">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <select className="input !w-44" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="nocturne-sage">Navy + Sage</option>
            <option value="mono-gold">Mono + Gold</option>
            <option value="coastal-coral">Coastal Coral</option>
          </select>
          <Link to="/cart" className="relative btn-secondary">
            <ShoppingBagIcon className="h-4 w-4" />
            <span className="ml-2">{count}</span>
          </Link>
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm md:inline">Hi, {user?.username}</span>
              <button className="btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
