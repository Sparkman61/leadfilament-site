import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../api'

const NAV = [
  { to: '/', label: 'Overview', icon: '▦' },
  { to: '/conversations', label: 'Conversations', icon: '💬' },
  { to: '/live', label: 'Live', icon: '⚡' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
  { to: '/billing', label: 'Billing', icon: '💳' },
]

export default function Shell({ children }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    try {
      await api.auth.logout()
    } catch (_) {}
    navigate('/login')
  }

  function handleNavClick() {
    setMenuOpen(false)
  }

  return (
    <div className="shell">
      <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        {menuOpen ? '✕' : '☰'}
      </button>
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
        <NavLink to="/" className="sidebar-logo" onClick={handleNavClick}>
          Lead<span>Filament</span>
        </NavLink>
        <ul className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleNavClick}>
                <span>{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout}>Sign out</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  )
}
