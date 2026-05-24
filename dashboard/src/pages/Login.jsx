import { useState } from 'react'
import { api } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    try {
      await api.auth.sendMagicLink(email.trim())
      setState('sent')
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
      setState('error')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          Lead<span>Filament</span>
        </div>
        <p className="login-sub">Client Dashboard</p>
        {state === 'sent' ? (
          <div className="login-sent">
            <div className="login-sent-icon">✉️</div>
            <h2>Check your email</h2>
            <p>
              We sent a login link to <strong>{email}</strong>.
              <br />
              Click the link to sign in — it expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state === 'error') setState('idle')
              }}
              required
              autoFocus
            />
            {state === 'error' && <div className="login-error">{errorMsg}</div>}
            <button className="btn-primary" type="submit" disabled={state === 'loading'}>
              {state === 'loading' ? 'Sending…' : 'Send login link →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
