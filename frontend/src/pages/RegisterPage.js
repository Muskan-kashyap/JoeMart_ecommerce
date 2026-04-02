import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthContext from '../context/AuthContext'

const RegisterPage = () => {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })

  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrors({})
      await register(form)
      setSuccess('Account created! Redirecting to sign in...')
      setTimeout(() => navigate('/login'), 800)
    } catch (error) {
      const data = error.response?.data || {}
      setErrors(data)
    }
  }

  return (
    <section className="container-shell pb-12 pt-4">
      <form onSubmit={onSubmit} className="glass-panel mx-auto max-w-xl rounded-2xl p-8">
        <h2 className="font-display text-3xl font-semibold">Create account</h2>
        {success && <p className="mt-2 text-sm" style={{ color: 'var(--primary)' }}>{success}</p>}
        {errors.non_field_errors && <p className="mt-2 text-sm" style={{ color: '#e11d48' }}>{errors.non_field_errors[0]}</p>}
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account? <a className="underline" href="/login">Sign in</a>
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div>
            <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            {errors.username && <p className="text-xs" style={{ color: '#e11d48' }}>{errors.username[0]}</p>}
          </div>
          <div>
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            {errors.email && <p className="text-xs" style={{ color: '#e11d48' }}>{errors.email[0]}</p>}
          </div>
          <div>
            <input className="input" placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
          </div>
          <div>
            <input className="input" placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {errors.password && <p className="text-xs" style={{ color: '#e11d48' }}>{errors.password[0]}</p>}
          </div>
        </div>
        <button className="btn-primary mt-5" type="submit">Register</button>
      </form>
    </section>
  )
}

export default RegisterPage
