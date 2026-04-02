import { useEffect, useState } from 'react'

import { authApi } from '../utils/api'

const emptyForm = {
  address_type: 'shipping',
  full_name: '',
  line_1: '',
  line_2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
  is_default: false,
}

const AccountPage = () => {
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAddresses = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.get('addresses/')
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
      setAddresses(list)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load addresses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses().catch(() => {})
  }, [])

  const addAddress = async (event) => {
    event.preventDefault()
    try {
      await authApi.post('addresses/', form)
      setForm(emptyForm)
      await loadAddresses()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to save address.')
    }
  }

  const deleteAddress = async (id) => {
    try {
      await authApi.delete(`addresses/${id}/`)
      await loadAddresses()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to delete address.')
    }
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="font-display text-3xl font-semibold">Account & Addresses</h2>
        {error && <p className="mt-2 text-sm" style={{ color: '#e11d48' }}>{error}</p>}
        {loading && <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Loading addresses...</p>}

        <form className="mt-6 grid gap-3 md:grid-cols-2" onSubmit={addAddress}>
          <select className="input" value={form.address_type} onChange={(e) => setForm({ ...form, address_type: e.target.value })}>
            <option value="shipping">Shipping</option>
            <option value="billing">Billing</option>
          </select>
          <input className="input" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Address line 1" value={form.line_1} onChange={(e) => setForm({ ...form, line_1: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Address line 2" value={form.line_2} onChange={(e) => setForm({ ...form, line_2: e.target.value })} />
          <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <input className="input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
          <input className="input" placeholder="Postal code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} required />
          <input className="input" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Default address
          </label>
          <div className="md:col-span-2">
            <button className="btn-primary" type="submit">Add address</button>
          </div>
        </form>

        <div className="mt-8 space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="glass-panel rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{addr.full_name} ({addr.address_type})</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {addr.line_1}, {addr.city}, {addr.state} {addr.postal_code}
                  </p>
                </div>
                <button className="btn-secondary" onClick={() => deleteAddress(addr.id)}>Delete</button>
              </div>
            </div>
          ))}
          {!addresses.length && <div className="glass-panel rounded-xl p-4">No addresses yet.</div>}
        </div>
      </div>
    </section>
  )
}

export default AccountPage
