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

  async function handleLogout() {
    try {
      await api.auth.logout()
    } catch (_) {}
    navigate('/login')
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          Lead<span>Filament</span>
        </NavLink>
        <ul className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
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
