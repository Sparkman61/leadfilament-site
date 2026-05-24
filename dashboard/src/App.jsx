import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { api } from './api'
import Shell from './components/Shell'
import Billing from './pages/Billing'
import ConversationDetail from './pages/ConversationDetail'
import Conversations from './pages/Conversations'
import Live from './pages/Live'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function AuthGate({ children }) {
  const [state, setState] = useState('loading')

  useEffect(() => {
    api.auth.me()
      .then(() => setState('authed'))
      .catch(() => setState('unauthed'))
  }, [])

  if (state === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontSize: '0.875rem' }}>
        Loading…
      </div>
    )
  }
  if (state === 'unauthed') return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AuthGate>
              <Shell>
                <Routes>
                  <Route index element={<Overview />} />
                  <Route path="conversations" element={<Conversations />} />
                  <Route path="conversations/:id" element={<ConversationDetail />} />
                  <Route path="live" element={<Live />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Shell>
            </AuthGate>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
