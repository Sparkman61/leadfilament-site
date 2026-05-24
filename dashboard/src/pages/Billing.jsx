import { useEffect, useState } from 'react'
import { api } from '../api'

function fmtDate(isoStr) {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Billing() {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.client.get()
      .then((c) => {
        setClient(c)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load billing info.')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page-loading">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Billing</h1>
        <p>Your subscription details.</p>
      </div>
      {error && <div className="page-error">{error}</div>}
      {client && (
        <div className="card" style={{ maxWidth: '520px' }}>
          <div className="field-group">
            <div className="field-group-title">Subscription</div>
            <div className="field-row">
              <span className="field-label">Plan</span>
              <span className="field-value">{client.plan || 'Lead Filament'}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Status</span>
              <span className="field-value" style={{ textTransform: 'capitalize' }}>{client.billing_status || client.status}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Next billing date</span>
              <span className="field-value">{fmtDate(client.next_billing_date)}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--faint)', marginTop: '0.5rem' }}>
            To update payment method or cancel, contact support.
          </p>
        </div>
      )}
    </div>
  )
}
