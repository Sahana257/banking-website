import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ uname: '', password: '', email: '', phone: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('https://banking-website-t0to.onrender.com/api/auth/register', form)
      setMessage(res.data.message)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="kb-page">
      <div className="kb-auth-main">
        <div className="kb-auth">
          <h1 className="kb-auth-brand">🏦 Kod<span>bank</span></h1>
          <p className="kb-subtitle">Create your account</p>

          <form onSubmit={handleSubmit} className="kb-form">
            <div className="kb-input-wrap">
              <span className="kb-icon">👤</span>
              <input className="kb-input" name="uname" placeholder="Username" value={form.uname} onChange={handleChange} required />
            </div>
            <div className="kb-input-wrap">
              <span className="kb-icon">🔒</span>
              <input className="kb-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="kb-input-wrap">
              <span className="kb-icon">✉️</span>
              <input className="kb-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="kb-input-wrap">
              <span className="kb-icon">📱</span>
              <input className="kb-input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="kb-input-wrap">
              <span className="kb-icon">🏷️</span>
              <div className="kb-role-badge">Role: Customer</div>
            </div>
            <button className="kb-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          {message && <p className="kb-success">{message}</p>}
          {error   && <p className="kb-error">{error}</p>}
          <p className="kb-link-row">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}
