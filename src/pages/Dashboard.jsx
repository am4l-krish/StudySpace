import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] || 'Hunter'

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
          padding: '12px 16px',
          borderRadius: '2px',
          fontSize: '13px',
          color: '#a78bfa',
          letterSpacing: '0.5px',
          marginTop: '12px'
        }}>
          ⚡ Welcome back, <strong>{firstName}</strong>. Your daily quests await.
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">⚔ Quests Pending</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🍅 Focus Sessions</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">📊 CGPA</div>
          <div className="stat-value" style={{ color: '#06b6d4', textShadow: '0 0 12px rgba(6,182,212,0.5)' }}>—</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🔥 Study Streak</div>
          <div className="stat-value" style={{ color: '#f59e0b', textShadow: '0 0 12px rgba(245,158,11,0.5)' }}>0</div>
        </div>
      </div>

      {/* Rank card */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
        border: '1px solid #2a1f6e',
        borderRadius: '4px',
        padding: '24px',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
        <div style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Current Rank</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '40px' }}>🏆</div>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: '700', color: '#a78bfa', textShadow: '0 0 16px rgba(167,139,250,0.5)' }}>E-RANK</div>
            <div style={{ fontSize: '12px', color: '#4b5563', letterSpacing: '1px' }}>Complete quests to level up</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard