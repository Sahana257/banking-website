import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ uname: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('https://bank-backend-yoie.onrender.com/api/login', form, { withCredentials: true })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="kb-page">
      <div className="kb-auth-main">
        <div className="kb-auth">
          <h1 className="kb-auth-brand">🏦 Kod<span>bank</span></h1>
          <p className="kb-subtitle">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="kb-form">
            <div className="kb-input-wrap">
              <span className="kb-icon">👤</span>
              <input className="kb-input" name="uname" placeholder="Username" value={form.uname} onChange={handleChange} required />
            </div>
            <div className="kb-input-wrap">
              <span className="kb-icon">🔒</span>
              <input className="kb-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>
            <button className="kb-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          {error && <p className="kb-error">{error}</p>}
          <p className="kb-link-row">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  )
}
