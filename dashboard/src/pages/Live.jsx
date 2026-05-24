import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { ConvList } from './Conversations'
import ConversationDetail from './ConversationDetail'

export default function Live() {
  const [convs, setConvs] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isMobile = window.innerWidth <= 900

  function load() {
    api.conversations.list({ status: 'active', sort: 'desc' })
      .then((data) => {
        setConvs(Array.isArray(data) ? data : (data.conversations ?? []))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  function handleSelect(id) {
    if (isMobile) navigate('/conversations/' + id)
    else setSelectedId(id)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Live <span style={{ fontSize: '0.6em', color: 'var(--green)', fontFamily: 'Inter', fontWeight: 500 }}>● live</span></h1>
        <p>Active conversations right now — refreshes every 5 seconds.</p>
      </div>
      {loading ? <div className="page-loading">Loading…</div> : (
        <div className="conv-layout">
          <div className="conv-list-pane">
            {convs.length === 0
              ? <div className="conv-empty">No active conversations.</div>
              : <ConvList convs={convs} selectedId={selectedId} onSelect={handleSelect} />}
          </div>
          <div className="conv-detail-pane">
            {selectedId
              ? <ConversationDetail id={selectedId} inline />
              : <div className="conv-empty">Select a conversation</div>}
          </div>
        </div>
      )}
    </div>
  )
}
