import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { catalogApi } from '../utils/api'

const AdminProductEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState(null)
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    const load = async () => {
      const [productRes, categoriesRes] = await Promise.all([
        catalogApi.get(`products/${id}/`),
        catalogApi.get('categories/'),
      ])
      setProduct(productRes.data)
      setCategories(categoriesRes.data.results || categoriesRes.data)
    }
    load().catch(() => {})
  }, [id])

  const updateProduct = async (event) => {
    event.preventDefault()
    await catalogApi.put(`products/${id}/`, {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock),
      category: Number(product.category),
      is_active: product.is_active,
    })
    alert('Product updated')
  }

  const addImage = async () => {
    if (!newImageUrl.trim()) return
    await catalogApi.post(`products/${id}/images/`, { image_url: newImageUrl, is_primary: true })
    const updated = await catalogApi.get(`products/${id}/`)
    setProduct(updated.data)
    setNewImageUrl('')
  }

  const removeImage = async (imageId) => {
    await catalogApi.delete(`products/images/${imageId}/`)
    const updated = await catalogApi.get(`products/${id}/`)
    setProduct(updated.data)
  }

  if (!product) {
    return <section className="container-shell"><div className="glass-panel rounded-2xl p-6">Loading...</div></section>
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold">Edit Product</h2>
          <button className="btn-secondary" onClick={() => navigate('/admin/products')}>Back</button>
        </div>

        <form onSubmit={updateProduct} className="grid gap-3 md:grid-cols-2">
          <input className="input" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          <select className="input" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input className="input" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
          <input className="input" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
          <textarea className="input md:col-span-2" rows="4" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={product.is_active} onChange={(e) => setProduct({ ...product, is_active: e.target.checked })} />
            Active
          </label>
          <div className="md:col-span-2">
            <button className="btn-primary" type="submit">Save changes</button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="font-display text-xl font-semibold">Images</h3>
          <div className="mt-3 flex gap-2">
            <input className="input" placeholder="New image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
            <button className="btn-secondary" type="button" onClick={addImage}>Add</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(product.images || []).map((img) => (
              <div key={img.id} className="glass-panel rounded-xl p-3">
                <img src={img.image_url} alt={img.alt_text || 'product'} className="h-40 w-full rounded-lg object-cover" />
                <button className="btn-secondary mt-3" onClick={() => removeImage(img.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminProductEditPage
