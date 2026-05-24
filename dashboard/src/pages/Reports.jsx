import { useEffect, useState } from 'react'
import { api } from '../api'

function fmtDate(isoStr) {
  if (!isoStr) return ''
  return new Date(isoStr).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmt(cents) {
  if (!cents) return '$0'
  return '$' + Math.round(cents / 100).toLocaleString()
}

export default function Reports() {
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.reports.current(), api.reports.list()])
      .then(([c, h]) => {
        setCurrent(c)
        setHistory(Array.isArray(h) ? h : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load reports.')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page-loading">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>Weekly performance history.</p>
      </div>
      {error && <div className="page-error">{error}</div>}
      {current && (
        <>
          <div className="section-title">This Week (Live)</div>
          <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="stat-card">
              <div className="stat-card-label">Intercepted</div>
              <div className="stat-card-value">{current.total_conversations ?? current.calls_intercepted ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Qualified</div>
              <div className="stat-card-value">{current.leads_qualified ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Escalated</div>
              <div className="stat-card-value">{current.leads_escalated ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Est. Recovered</div>
              <div className="stat-card-value">{fmt(current.estimated_recovered_cents)}</div>
            </div>
          </div>
        </>
      )}
      <div className="section-title">Report History</div>
      {history.length === 0 ? (
        <div className="conv-empty" style={{ height: '80px' }}>No weekly reports yet — first report sends Monday 8am.</div>
      ) : (
        history.map((r) => (
          <div key={r.id} className="report-row">
            <div className="report-row-period">
              Week of {fmtDate(r.period_start)}
              <span>{fmtDate(r.period_start)} – {fmtDate(r.period_end)}</span>
            </div>
            <div className="report-stat">
              <div className="report-stat-val">{r.calls_intercepted}</div>
              <div className="report-stat-label">Intercepted</div>
            </div>
            <div className="report-stat">
              <div className="report-stat-val">{r.leads_qualified}</div>
              <div className="report-stat-label">Qualified</div>
            </div>
            <div className="report-stat">
              <div className="report-stat-val">{r.leads_escalated}</div>
              <div className="report-stat-label">Escalated</div>
            </div>
            <div className="report-stat">
              <div className="report-stat-val">{fmt(r.estimated_recovered_cents)}</div>
              <div className="report-stat-label">Est. Value</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
