import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import ConversationDetail from './ConversationDetail'

function timeAgo(isoStr) {
  if (!isoStr) return ''
  const diff = Math.floor((Date.now() - new Date(isoStr)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  return Math.floor(diff / 86400) + 'd ago'
}

export function ConvList({ convs, selectedId, onSelect }) {
  if (convs.length === 0) return <div className="conv-empty">No conversations yet.</div>
  return convs.map((c) => (
    <div
      key={c.id}
      className={'conv-row' + (c.id === selectedId ? ' selected' : '')}
      onClick={() => onSelect(c.id)}
    >
      <div className="conv-row-top">
        <span className="conv-row-name">{c.caller_name || c.caller_phone}</span>
        <span className="conv-row-time">{timeAgo(c.started_at)}</span>
      </div>
      <div className="conv-row-preview">{c.lead_summary || 'No summary yet'}</div>
      <span className={'badge badge-' + c.status}>{c.status}</span>
    </div>
  ))
}

export default function Conversations() {
  const [convs, setConvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const navigate = useNavigate()
  const isMobile = window.innerWidth <= 900

  useEffect(() => {
    api.conversations.list({ sort: 'desc', limit: 50 })
      .then((data) => {
        setConvs(Array.isArray(data) ? data : (data.conversations ?? []))
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load conversations.')
        setLoading(false)
      })
  }, [])

  function handleSelect(id) {
    if (isMobile) {
      navigate('/conversations/' + id)
    } else {
      setSelectedId(id)
    }
  }

  if (loading) return <div className="page-loading">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Conversations</h1>
        <p>All lead conversations.</p>
      </div>
      {error && <div className="page-error">{error}</div>}
      <div className="conv-layout">
        <div className="conv-list-pane">
          <ConvList convs={convs} selectedId={selectedId} onSelect={handleSelect} />
        </div>
        <div className="conv-detail-pane">
          {selectedId
            ? <ConversationDetail id={selectedId} inline />
            : <div className="conv-empty">Select a conversation</div>}
        </div>
      </div>
    </div>
  )
}
