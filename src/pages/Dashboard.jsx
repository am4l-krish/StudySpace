import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] || 'Hunter'
  const [taskCount, setTaskCount] = useState(0)
  const [cgpa, setCgpa] = useState(null)
  const [materialsCount, setMaterialsCount] = useState(0)
  const [streak, setStreak] = useState(0)

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

    return () => {
      unsubTasks()
      unsubGrades()
      unsubMaterials()
      unsubStreak()
    }
  }, [user])

  const getRank = () => {
    if (!cgpa) return 'E-RANK'
    if (cgpa >= 9) return 'S-RANK'
    if (cgpa >= 8) return 'A-RANK'
    if (cgpa >= 7) return 'B-RANK'
    if (cgpa >= 6) return 'C-RANK'
    return 'E-RANK'
  }

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

      <div style={{
        background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
        border: '1px solid #2a1f6e', borderRadius: '4px',
        padding: '24px',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
        <div style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Current Rank</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '40px' }}>⚔️</div>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '24px', fontWeight: '700', color: '#a78bfa', textShadow: '0 0 16px rgba(167,139,250,0.5)' }}>
              {getRank()}
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563', letterSpacing: '1px' }}>
              {cgpa ? `CGPA: ${cgpa} / 10` : 'Add grades to calculate rank'}
            </div>
            <div style={{ fontSize: '12px', color: '#f59e0b', letterSpacing: '1px', marginTop: '4px' }}>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard