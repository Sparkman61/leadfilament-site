import { useEffect, useState } from 'react'
import { api } from '../api'

function Field({ label, value }) {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <span className="field-value">{value || <span style={{ color: 'var(--faint)' }}>—</span>}</span>
    </div>
  )
}

export default function Settings() {
  const [client, setClient] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.client.get(), api.client.locations()])
      .then(([c, l]) => {
        setClient(c)
        setLocations(Array.isArray(l) ? l : (l.locations ?? []))
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load settings.')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page-loading">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Your account and location configuration.</p>
      </div>
      {error && <div className="page-error">{error}</div>}
      {client && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="field-group">
            <div className="field-group-title">Account</div>
            <Field label="Business name" value={client.business_name} />
            <Field label="Owner name" value={client.owner_name} />
            <Field label="Owner phone" value={client.owner_phone} />
            <Field label="State" value={client.state} />
          </div>
        </div>
      )}
      {locations.map((loc) => (
        <div key={loc.id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="field-group">
            <div className="field-group-title">{loc.location_name || 'Location'}</div>
            <Field label="Business phone" value={loc.business_phone} />
            <Field label="Escalation phone" value={loc.escalation_phone} />
            <Field label="Timezone" value={loc.timezone} />
            <Field label="Business type" value={loc.business_type} />
            <Field label="Services offered" value={loc.services_offered} />
            <Field label="Avg. job value" value={loc.average_job_value_cents ? '$' + Math.round(loc.average_job_value_cents / 100).toLocaleString() : null} />
            <Field label="Status" value={loc.status} />
          </div>
        </div>
      ))}
    </div>
  )
}
