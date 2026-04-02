import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import CartContext from '../context/CartContext'
import { catalogApi } from '../utils/api'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    catalogApi.get(`products/${id}/`).then((res) => setProduct(res.data))
  }, [id])

  if (!product) {
    return <section className="container-shell"><div className="glass-panel rounded-2xl p-6">Loading...</div></section>
  }

  const mainImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

  return (
    <section className="container-shell pb-12 pt-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <img
          src={mainImage?.image_url || 'https://via.placeholder.com/800x600?text=Product'}
          alt={product.name}
          className="glass-panel h-[420px] w-full rounded-2xl object-cover p-3"
        />
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: 'var(--primary-soft)' }}>{product.category_name}</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-base" style={{ color: 'var(--text-muted)' }}>{product.description}</p>
          <p className="mt-6 text-3xl font-bold" style={{ color: 'var(--primary)' }}>Rs {product.price}</p>
          <button className="btn-primary mt-6" onClick={() => addToCart(product, 1)}>Add to cart</button>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
