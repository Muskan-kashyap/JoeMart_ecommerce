import { useEffect, useState } from 'react'

import { catalogApi } from '../utils/api'

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  image_url: '',
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [form, setForm] = useState(initialForm)

  const load = async () => {
    const [productsRes, categoriesRes] = await Promise.all([catalogApi.get('products/'), catalogApi.get('categories/')])
    setProducts(productsRes.data.results || productsRes.data)
    setCategories(categoriesRes.data.results || categoriesRes.data)
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  const createProduct = async (event) => {
    event.preventDefault()
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: Number(form.category),
      is_active: true,
    }
    const created = await catalogApi.post('products/', payload)
    if (form.image_url) {
      await catalogApi.post(`products/${created.data.id}/images/`, { image_url: form.image_url, is_primary: true })
    }
    setForm(initialForm)
    await load()
  }

  const createCategory = async (event) => {
    event.preventDefault()
    if (!newCategory.trim()) {
      return
    }
    await catalogApi.post('categories/', { name: newCategory.trim() })
    setNewCategory('')
    await load()
  }

  const deleteProduct = async (id) => {
    await catalogApi.delete(`products/${id}/`)
    await load()
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <h2 className="mb-5 font-display text-3xl font-semibold">Admin - Products</h2>

      <form className="glass-panel mb-6 rounded-2xl p-5" onSubmit={createProduct}>
        <h3 className="mb-3 font-display text-xl">Create product</h3>
        <div className="mb-4 rounded-xl border p-3">
          <p className="mb-2 text-sm font-semibold">Quick add category</p>
          <div className="flex gap-2">
            <input className="input" placeholder="Category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <button className="btn-secondary" type="button" onClick={createCategory}>Add</button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input className="input" type="number" min="1" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="input" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Primary image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <textarea className="input md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <button className="btn-primary mt-4" type="submit">Create product</button>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <article key={product.id} className="glass-panel rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Rs {product.price} | Stock: {product.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <a className="btn-secondary" href={`/admin/products/${product.id}/edit`}>Edit</a>
                <button className="btn-secondary" onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminProductsPage
