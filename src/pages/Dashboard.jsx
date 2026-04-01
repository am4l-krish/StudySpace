import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const RANK_COLORS = {
  S: '#fac775', A: '#9fe1cb', B: '#85b7eb',
  C: '#afa9ec', D: '#b4b2a9', E: '#f09595'
}

const RANK_LABELS = {
  S: 'Shadow Monarch', A: 'National Level Hunter', B: 'Elite Hunter',
  C: 'Hunter', D: 'Novice Hunter', E: 'Weakest Hunter'
}

function HexBadge({ rank, size = 72 }) {
  const color = RANK_COLORS[rank] || '#f09595'
  const fontSize = size * 0.36

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        viewBox="0 0 72 72"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size, display: 'block' }}
      >
        {/* Outer hex ring */}
        <polygon
          points="36,4 63,20 63,52 36,68 9,52 9,20"
          fill={color}
          fillOpacity="0.18"
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
        {/* Mid hex */}
        <polygon
          points="36,10 57,22 57,50 36,62 15,50 15,22"
          fill={color}
          fillOpacity="0.1"
        />
        {/* Core hex */}
        <polygon
          points="36,16 53,26 53,46 36,56 19,46 19,26"
          fill={color}
          fillOpacity="0.9"
        />
        {/* Inner glow ring */}
        <polygon
          points="36,4 63,20 63,52 36,68 9,52 9,20"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          transform="scale(0.94) translate(2.2, 2.2)"
        />
        {/* Rank letter centered via SVG text — no positioning bugs */}
        <text
          x="36"
          y="36"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Cinzel, serif"
          fontWeight="900"
          fontSize={fontSize}
          fill="#0a0a14"
        >
          {rank}
        </text>
      </svg>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] || 'Hunter'
  const [taskCount, setTaskCount] = useState(0)
  const [cgpa, setCgpa] = useState(null)
  const [materialsCount, setMaterialsCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastSession, setLastSession] = useState(null)
  const [sessionRank, setSessionRank] = useState(null)

  useEffect(() => {
    if (!user) return

    const tasksQ = query(collection(db, 'tasks'), where('uid', '==', user.uid), where('done', '==', false))
    const unsubTasks = onSnapshot(tasksQ, (snap) => setTaskCount(snap.size))

    const gradesQ = query(collection(db, 'grades'), where('uid', '==', user.uid))
    const unsubGrades = onSnapshot(gradesQ, (snap) => {
      const grades = snap.docs.map(d => d.data())
      if (grades.length > 0) {
        const avg = grades.reduce((sum, g) => sum + g.point, 0) / grades.length
        setCgpa(avg.toFixed(2))
      } else {
        setCgpa(null)
      }
    })

    const materialsQ = query(collection(db, 'materials'), where('uid', '==', user.uid))
    const unsubMaterials = onSnapshot(materialsQ, (snap) => setMaterialsCount(snap.size))

    const streakRef = doc(db, 'streak', user.uid)
    const unsubStreak = onSnapshot(streakRef, (snap) => {
      if (snap.exists()) {
        const { lastDate, count } = snap.data()
        const today = new Date().toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (lastDate === today || lastDate === yesterday.toDateString()) {
          setStreak(count)
        } else {
          setStreak(0)
        }
      }
    })

    try {
      const saved = localStorage.getItem(`studySession_${user.uid}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        setLastSession(parsed)
        setSessionRank(parsed.rank || null)
      }
    } catch {}

    return () => {
      unsubTasks()
      unsubGrades()
      unsubMaterials()
      unsubStreak()
    }
  }, [user])

  const rank = sessionRank || 'E'
  const rankLabel = RANK_LABELS[rank] || 'Weakest Hunter'
  const rankColor = RANK_COLORS[rank] || '#f09595'

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: '#4b5563', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>
          ▸ System Notification
        </div>
        <h1 className="page-title">Hunter Dashboard</h1>
        <div style={{
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderLeft: '3px solid #7c3aed',
          padding: '12px 16px', borderRadius: '2px',
          fontSize: '13px', color: '#a78bfa',
          letterSpacing: '0.5px', marginTop: '12px'
        }}>
          ⚡ Welcome back, <strong>{firstName}</strong>. Your daily quests await.
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">⚔ Quests Pending</div>
          <div className="stat-value">{taskCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">📚 Materials</div>
          <div className="stat-value" style={{ color: '#06b6d4', textShadow: '0 0 12px rgba(6,182,212,0.5)' }}>{materialsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">📊 CGPA</div>
          <div className="stat-value" style={{ color: '#22c55e', textShadow: '0 0 12px rgba(34,197,94,0.5)' }}>{cgpa || '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🔥 Study Streak</div>
          <div className="stat-value" style={{ color: '#f59e0b', textShadow: '0 0 12px rgba(245,158,11,0.5)' }}>{streak}</div>
        </div>
      </div>

      {/* Current Rank */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
        border: '1px solid #2a1f6e', borderRadius: '4px',
        padding: '24px', marginTop: '20px',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
        <div style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Current Rank</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <HexBadge rank={rank} size={72} />
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '24px', fontWeight: '700', color: rankColor, textShadow: `0 0 16px ${rankColor}66` }}>
              {rank}-RANK
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '1px', marginTop: '2px' }}>
              {rankLabel}
            </div>
            <div style={{ fontSize: '11px', color: '#374151', letterSpacing: '1px', marginTop: '4px' }}>
              {sessionRank
                ? `Last session score: ${lastSession?.score}/100`
                : 'Complete a study session to earn your rank'}
            </div>
          </div>
        </div>
      </div>

      {/* Last Study Session */}
      {lastSession ? (
        <div style={{
          background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
          border: '1px solid #2a1f6e', borderRadius: '4px',
          padding: '24px', marginTop: '16px',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #06b6d4, #7c3aed, transparent)' }} />
          <div style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Last Study Session
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <HexBadge rank={lastSession.rank} size={60} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#e2e8f0', marginBottom: '2px' }}>
                {lastSession.topic}
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563' }}>
                Score: <span style={{ color: '#a78bfa' }}>{lastSession.score}/100</span>
                {lastSession.date && (
                  <span style={{ marginLeft: '12px' }}>{lastSession.date}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '4px', padding: '10px 12px' }}>
              <div style={{ fontSize: '10px', color: '#22c55e', letterSpacing: '1px', marginBottom: '6px' }}>STRONG</div>
              {lastSession.strong?.slice(0, 2).map((c, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>• {c}</div>
              ))}
            </div>
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px', padding: '10px 12px' }}>
              <div style={{ fontSize: '10px', color: '#ef4444', letterSpacing: '1px', marginBottom: '6px' }}>NEEDS WORK</div>
              {lastSession.weak?.slice(0, 2).map((c, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>• {c}</div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#6b7280', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', fontStyle: 'italic' }}>
            ⚡ {lastSession.tip}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(124,58,237,0.04)',
          border: '1px dashed rgba(124,58,237,0.2)',
          borderRadius: '4px', padding: '20px',
          marginTop: '16px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#4b5563', letterSpacing: '1px' }}>
            No study sessions yet — head to <span style={{ color: '#a78bfa' }}>AI Study Buddy</span> to begin your first dungeon.
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard