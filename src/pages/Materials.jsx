import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

function Materials() {
  const [materials, setMaterials] = useState([])
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [type, setType] = useState('Notes')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const types = ['Notes', 'YouTube', 'PDF', 'Book', 'Article', 'Other']

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'materials'), where('uid', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const typeIcon = (t) => {
    if (t === 'Notes') return '📝'
    if (t === 'YouTube') return '▶️'
    if (t === 'PDF') return '📄'
    if (t === 'Book') return '📖'
    if (t === 'Article') return '🌐'
    return '📌'
  }

  const typeColor = (t) => {
    if (t === 'YouTube') return '#ef4444'
    if (t === 'PDF') return '#f59e0b'
    if (t === 'Notes') return '#a78bfa'
    if (t === 'Book') return '#22c55e'
    if (t === 'Article') return '#06b6d4'
    return '#6b7280'
  }

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const addMaterial = async () => {
    if (!title.trim()) return
    await addDoc(collection(db, 'materials'), {
      title, link, type, uid: user.uid, createdAt: new Date()
    })
    setTitle('')
    setLink('')
    setType('Notes')
  }

  const deleteMaterial = async (id) => {
    await deleteDoc(doc(db, 'materials', id))
  }

  const inputStyle = {
    padding: '9px 12px', borderRadius: '2px',
    border: '1px solid #2a1f6e',
    background: 'rgba(124,58,237,0.05)',
    color: '#e0e0ff', fontSize: '13px',
    fontFamily: 'Cinzel, serif', outline: 'none'
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="page-title">Study Materials</h1>

      <div style={{
        background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
        border: '1px solid #2a1f6e', borderRadius: '4px',
        padding: '20px', marginBottom: '28px',
        display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2, minWidth: '140px' }}>
          <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>Title</label>
          <input type="text" placeholder="e.g. Data Structures Lecture" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2, minWidth: '140px' }}>
          <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>Link / URL</label>
          <input type="text" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, background: '#0a0a18', color: '#a78bfa' }}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button onClick={addMaterial} style={{
          padding: '9px 20px', borderRadius: '2px',
          background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
          color: 'white', border: 'none', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px'
        }}>Add</button>
      </div>

      {loading ? (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px', fontFamily: 'Cinzel, serif' }}>⚡ Loading materials...</p>
      ) : materials.length === 0 ? (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px' }}>No materials yet. Add your first resource! 📚</p>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {materials.map(m => {
          const ytId = m.type === 'YouTube' ? getYouTubeId(m.link) : null
          const color = typeColor(m.type)
          return (
            <div key={m.id} style={{
              background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
              border: `1px solid ${color}44`,
              borderTop: `2px solid ${color}`,
              borderRadius: '4px', overflow: 'hidden'
            }}>
              {ytId && (
                <div style={{ position: 'relative' }}>
                  <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="thumbnail" style={{ width: '100%', height: '160px', objectFit: 'cover', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(239,68,68,0.9)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'white' }}>▶</div>
                  </div>
                </div>
              )}
              {m.type === 'PDF' && (
                <div style={{ background: 'rgba(245,158,11,0.1)', padding: '20px', textAlign: 'center', fontSize: '32px' }}>📄</div>
              )}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '16px' }}>{typeIcon(m.type)}</span>
                    <span style={{ fontSize: '13px', color: '#e0d0ff', fontFamily: 'Cinzel, serif' }}>{m.title}</span>
                  </div>
                  <button onClick={() => deleteMaterial(m.id)} style={{ background: 'rgba(220,38,38,0.2)', color: '#f87171', border: 'none', borderRadius: '2px', padding: '3px 8px', cursor: 'pointer', fontSize: '10px', marginLeft: '8px' }}>✕</button>
                </div>
                <div style={{ display: 'inline-block', fontSize: '10px', color, background: `${color}22`, border: `1px solid ${color}44`, borderRadius: '2px', padding: '2px 8px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{m.type}</div>
                {m.link && (
                  <div>
                    <a href={m.link} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#06b6d4', textDecoration: 'none', letterSpacing: '0.5px' }}>
                      🔗 {m.type === 'YouTube' ? 'Watch on YouTube' : m.type === 'PDF' ? 'Open PDF' : 'Open Link'} →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Materials