import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function fmt(cents) {
  if (!cents) return '$0'
  return '$' + Math.round(cents / 100).toLocaleString()
}

function timeAgo(isoStr) {
  if (!isoStr) return ''
  const diff = Math.floor((Date.now() - new Date(isoStr)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  return Math.floor(diff / 86400) + 'd ago'
}

export default function Overview() {
  const [stats, setStats] = useState(null)
  const [convs, setConvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.reports.current(),
      api.conversations.list({ limit: 5, sort: 'desc' }),
    ])
      .then(([s, c]) => {
        setStats(s)
        setConvs(Array.isArray(c) ? c : (c.conversations ?? []))
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load dashboard.')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page-loading">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Overview</h1>
        <p>This week's performance at a glance.</p>
      </div>
      {error && <div className="page-error">{error}</div>}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">Calls Intercepted</div>
            <div className="stat-card-value">{stats.total_conversations ?? stats.calls_intercepted ?? 0}</div>
            <div className="stat-card-sub">this week</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Leads Qualified</div>
            <div className="stat-card-value">{stats.leads_qualified ?? 0}</div>
            <div className="stat-card-sub">this week</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Escalated</div>
            <div className="stat-card-value">{stats.leads_escalated ?? 0}</div>
            <div className="stat-card-sub">hot leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Est. Recovered</div>
            <div className="stat-card-value">{fmt(stats.estimated_recovered_cents)}</div>
            <div className="stat-card-sub">this week</div>
          </div>
        </div>
      )}
      <div className="section-title">Recent Conversations</div>
      {convs.length === 0 ? (
        <div className="conv-empty" style={{ height: '120px' }}>No conversations yet.</div>
      ) : (
        convs.map((c) => (
          <div key={c.id} className="conv-row" style={{ marginBottom: '0.5rem' }} onClick={() => navigate('/conversations/' + c.id)}>
            <div className="conv-row-top">
              <span className="conv-row-name">{c.caller_name || c.caller_phone}</span>
              <span className="conv-row-time">{timeAgo(c.started_at)}</span>
            </div>
            <div className="conv-row-preview">{c.lead_summary || 'No summary yet'}</div>
            <span className={'badge badge-' + c.status}>{c.status}</span>
          </div>
        ))
      )}
    </div>
  )
}
