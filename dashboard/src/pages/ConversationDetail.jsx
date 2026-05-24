import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

function fmtTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function fmt(cents) {
  if (!cents) return null
  return '$' + Math.round(cents / 100).toLocaleString()
}

export default function ConversationDetail({ id: propId, inline }) {
  const { id: paramId } = useParams()
  const id = propId ?? paramId
  const [conv, setConv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.conversations.get(id)
      .then((data) => {
        setConv(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load conversation.')
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="page-loading">Loading…</div>
  if (error) return <div className="page-error" style={{ margin: '1.5rem' }}>{error}</div>
  if (!conv) return null

  const messages = conv.messages ?? []

  return (
    <>
      <div className="conv-detail-header">
        <div>
          {!inline && (
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.875rem', padding: '0 0 0.5rem 0', display: 'block' }}>
              ← Back
            </button>
          )}
          <div className="conv-detail-name">{conv.caller_name || conv.caller_phone}</div>
          <div className="conv-detail-meta">
            {conv.channel === 'voice' ? '📞' : '💬'} {conv.channel} ·{' '}
            <span className={'badge badge-' + conv.status} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{conv.status}</span>
            {conv.estimated_job_value_cents ? ' · Est. ' + fmt(conv.estimated_job_value_cents) : ''}
          </div>
        </div>
      </div>
      <div className="conv-messages">
        {messages.length === 0 && <div className="conv-empty">No messages yet.</div>}
        {messages.map((m) => {
          const isOwner = m.sender === 'owner'
          const isInbound = m.direction === 'inbound'
          const bubbleClass = isOwner ? 'owner' : isInbound ? 'inbound' : 'outbound'
          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isInbound ? 'flex-start' : 'flex-end' }}>
              <div className="msg-sender-label">
                {m.sender === 'ai' ? 'Lead Filament AI' : m.sender === 'owner' ? 'You' : conv.caller_name || conv.caller_phone}
              </div>
              <div className={'msg-bubble ' + bubbleClass}>{m.content}</div>
              <div className="msg-time">{fmtTime(m.created_at)}</div>
            </div>
          )
        })}
      </div>
      {conv.lead_summary && (
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--white)' }}>Summary:</strong> {conv.lead_summary}
        </div>
      )}
    </>
  )
}
