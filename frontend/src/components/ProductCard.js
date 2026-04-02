import { useContext } from 'react'
import { Link } from 'react-router-dom'

import AuthContext from '../context/AuthContext'
import CartContext from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useContext(AuthContext)
  const { addToCart } = useContext(CartContext)
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

  return (
    <article className="glass-panel rounded-2xl p-4">
      <img
        src={primaryImage?.image_url || 'https://via.placeholder.com/600x400?text=Product'}
        alt={product.name}
        className="h-48 w-full rounded-xl object-cover"
      />
      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{product.name}</h3>
        <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Rs {product.price}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm" style={{ color: 'var(--text-muted)' }}>{product.description}</p>
      <div className="mt-4 flex gap-2">
        <Link to={`/products/${product.id}`} className="btn-secondary">Details</Link>
        {isAuthenticated && (
          <button className="btn-primary" onClick={() => addToCart(product, 1)}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
