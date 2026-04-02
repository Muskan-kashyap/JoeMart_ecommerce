import { useEffect, useState } from 'react'

import ProductCard from '../components/ProductCard'
import { catalogApi } from '../utils/api'

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category_slug: '', min_price: '', max_price: '' })

  const fetchProducts = () => {
    setLoading(true)
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.category_slug) params.category_slug = filters.category_slug
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price

    catalogApi
      .get('products/', { params })
      .then((res) => setProducts(res.data.results || res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    catalogApi.get('categories/').then((res) => setCategories(res.data.results || res.data))
  }, [])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <section className="container-shell pb-14 pt-4">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold">Shop</h2>
        <p style={{ color: 'var(--text-muted)' }}>Browse products from your JoeMart.</p>
      </div>

      <div className="glass-panel mb-5 grid gap-3 rounded-2xl p-4 md:grid-cols-4">
        <input
          className="input"
          placeholder="Search products"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="input"
          value={filters.category_slug}
          onChange={(e) => setFilters({ ...filters, category_slug: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>{category.name}</option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          min="0"
          placeholder="Min price"
          value={filters.min_price}
          onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
        />
        <input
          className="input"
          type="number"
          min="0"
          placeholder="Max price"
          value={filters.max_price}
          onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
        />
      </div>

      {loading ? (
        <div className="glass-panel rounded-2xl p-6">Loading products...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ShopPage
