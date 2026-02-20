import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const COLORS = ['#c084fc','#a855f7','#e879f9','#f0abfc','#818cf8','#7c3aed','#d8b4fe','#a78bfa']

function Confetti({ active }) {
  const pieces = useRef([])
  if (active && pieces.current.length === 0) {
    pieces.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.8 + Math.random() * 1.6,
      delay: Math.random() * 0.8,
      size: 8 + Math.random() * 8,
    }))
  }
  if (!active) { pieces.current = []; return null }
  return (
    <div className="kb-confetti-wrap">
      {pieces.current.map(p => (
        <div key={p.id} className="piece" style={{
          left: `${p.left}%`,
          background: p.color,
          width: p.size,
          height: p.size * 1.4,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [balance, setBalance] = useState(null)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    axios.post('https://banking-website-t0to.onrender.com/api/balance/getBalance', {}, { withCredentials: true })
      .then(res => setUsername(res.data.username))
      .catch(err => { if (err.response?.status === 401) navigate('/login') })
  }, [navigate])

  const handleCheckBalance = async () => {
    setError('')
    setChecking(true)
    setBalance(null)
    setConfetti(false)
    try {
      const res = await axios.post('https://banking-website-t0to.onrender.com/api/balance/getBalance', {}, { withCredentials: true })
      setBalance(res.data.balance)
      setConfetti(true)
      setTimeout(() => setConfetti(false), 3500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch balance.'
      setError(msg)
      if (err.response?.status === 401) setTimeout(() => navigate('/login'), 1500)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="kb-page">
      <Confetti active={confetti} />
      <Navbar />

      <main className="kb-dash-main">
        {username && (
          <p className="kb-welcome">Welcome back, <strong>{username}</strong>! 👋</p>
        )}

        <div className="kb-dash-panel">
          {balance !== null && (
            <div className="kb-balance-box">
              <p className="kb-balance-msg">🎉 Your balance is :</p>
              <p className="kb-balance-amount">₹ {balance}</p>
            </div>
          )}

          {balance === null ? (
            <button className="kb-btn-check" onClick={handleCheckBalance} disabled={checking}>
              {checking ? 'Fetching…' : '💰 Check Balance'}
            </button>
          ) : (
            <div className="kb-action-grid">
              <button className="kb-action-btn">
                <span className="kb-action-icon">➕</span>
                Deposit
              </button>
              <button className="kb-action-btn">
                <span className="kb-action-icon">➖</span>
                Withdraw
              </button>
              <button className="kb-action-btn">
                <span className="kb-action-icon">📜</span>
                Transaction History
              </button>
            </div>
          )}

          {error && <p className="kb-error">{error}</p>}
        </div>
      </main>
    </div>
  )
}
