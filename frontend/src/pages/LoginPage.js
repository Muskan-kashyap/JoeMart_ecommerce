import { useContext, useState } from 'react'

import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ username: '', password: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form.username, form.password)
    } catch (error) {
      alert(error.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <form onSubmit={onSubmit} className="glass-panel mx-auto max-w-md rounded-2xl p-8">
        <h2 className="font-display text-3xl font-semibold">Sign in</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          New here? <Link to="/register" className="underline">Create an account</Link>
        </p>
        <input className="input mt-5" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="input mt-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary mt-5" type="submit">Login</button>
      </form>
    </section>
  )
}

export default LoginPage
