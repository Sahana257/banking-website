import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ showAuth = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await axios.post('https://bank-backend-yoie.onrender.com/api/logout', {}, { withCredentials: true })
    } catch {
      // ignore errors — still navigate away
    }
    navigate('/login')
  }

  const navLinks = [
    { label: 'Accounts',     path: '/dashboard' },
    { label: 'Transactions', path: '/dashboard' },
    { label: 'Support',      path: '/dashboard' },
  ]

  return (
    <nav className="kb-nav">
      {/* Logo */}
      <button className="kb-nav-logo" onClick={() => navigate('/')}>
        🏦 Kod<span>bank</span>
      </button>

      {/* Center links — only on dashboard */}
      {!showAuth && (
        <div className="kb-nav-links">
          {navLinks.map(l => (
            <button
              key={l.label}
              className={`kb-nav-link ${location.pathname === l.path && l.label === 'Accounts' ? 'active' : ''}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      {/* Right side */}
      <div className="kb-nav-right">
        {showAuth ? (
          <button className="kb-nav-cta" onClick={() => navigate('/login')}>Login</button>
        ) : (
          <button className="kb-btn-danger" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  )
}
