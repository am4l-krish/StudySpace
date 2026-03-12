import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

function Grades() {
  const [grades, setGrades] = useState([])
  const [subject, setSubject] = useState('')
  const [mark, setMark] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'grades'), where('uid', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGrades(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const getGrade = (mark) => {
    if (mark >= 90) return { letter: 'O', point: 10 }
    if (mark >= 80) return { letter: 'A+', point: 9 }
    if (mark >= 70) return { letter: 'A', point: 8 }
    if (mark >= 60) return { letter: 'B+', point: 7 }
    if (mark >= 50) return { letter: 'B', point: 6 }
    if (mark >= 45) return { letter: 'C', point: 5 }
    return { letter: 'F', point: 0 }
  }

  const addGrade = async () => {
    if (!subject.trim() || !mark) return
    const m = Number(mark)
    if (m < 0 || m > 100) return alert('Mark must be between 0 and 100')
    const { letter, point } = getGrade(m)
    await addDoc(collection(db, 'grades'), {
      subject, mark: m, letter, point, uid: user.uid, createdAt: new Date()
    })
    setSubject('')
    setMark('')
  }

  const deleteGrade = async (id) => {
    await deleteDoc(doc(db, 'grades', id))
  }

  const cgpa = grades.length
    ? (grades.reduce((sum, g) => sum + g.point, 0) / grades.length).toFixed(2)
    : null

  const gradeColor = (letter) => {
    if (letter === 'O') return '#22c55e'
    if (letter === 'A+') return '#4ade80'
    if (letter === 'A') return '#3b82f6'
    if (letter === 'B+') return '#a78bfa'
    if (letter === 'B') return '#f59e0b'
    if (letter === 'C') return '#f97316'
    return '#ef4444'
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="page-title">Grades & CGPA</h1>

      {cgpa && (
        <div style={{
          background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
          border: '1px solid #2a1f6e', borderRadius: '4px',
          padding: '20px', marginBottom: '24px', display: 'inline-block', minWidth: '200px',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
          <div style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Current CGPA</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '48px', fontWeight: '700', color: '#a78bfa', textShadow: '0 0 16px rgba(167,139,250,0.5)' }}>{cgpa}</div>
          <div style={{ fontSize: '11px', color: '#4b5563', letterSpacing: '1px' }}>out of 10.0</div>
        </div>
      )}

      {/* Grade Scale */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { label: 'O ≥90', color: '#22c55e' },
          { label: 'A+ ≥80', color: '#4ade80' },
          { label: 'A ≥70', color: '#3b82f6' },
          { label: 'B+ ≥60', color: '#a78bfa' },
          { label: 'B ≥50', color: '#f59e0b' },
          { label: 'C ≥45', color: '#f97316' },
          { label: 'F <45', color: '#ef4444' },
        ].map(({ label, color }) => (
          <span key={label} style={{
            background: color + '22', color, border: `1px solid ${color}`,
            borderRadius: '2px', padding: '3px 10px', fontSize: '11px',
            fontFamily: 'Cinzel, serif', letterSpacing: '1px'
          }}>{label}</span>
        ))}
      </div>

      {/* Add Grade */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Subject name"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          style={{ flex: 1, minWidth: '160px', padding: '10px 14px', borderRadius: '2px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)', color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none' }}
        />
        <input
          type="number"
          placeholder="Mark (0-100)"
          value={mark}
          onChange={e => setMark(e.target.value)}
          style={{ width: '140px', padding: '10px 14px', borderRadius: '2px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)', color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none' }}
        />
        <button onClick={addGrade} style={{
          padding: '10px 20px', borderRadius: '2px',
          background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
          color: 'white', border: 'none', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px'
        }}>Add</button>
      </div>

      {loading ? (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px', fontFamily: 'Cinzel, serif' }}>⚡ Loading grades...</p>
      ) : grades.length === 0 ? (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px' }}>No grades yet. Add a subject above! 📚</p>
      ) : null}

      {grades.map(g => (
        <div key={g.id} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', marginBottom: '8px',
          background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
          border: '1px solid #2a1f6e', borderLeft: `3px solid ${gradeColor(g.letter)}`,
          borderRadius: '4px'
        }}>
          <div style={{ flex: 1, fontSize: '14px', color: '#e0d0ff', fontFamily: 'Cinzel, serif' }}>{g.subject}</div>
          <div style={{ fontSize: '13px', color: '#4b5563' }}>{g.mark}/100</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: gradeColor(g.letter), minWidth: '36px', textAlign: 'center', textShadow: `0 0 8px ${gradeColor(g.letter)}` }}>{g.letter}</div>
          <div style={{ fontSize: '13px', color: '#4b5563', minWidth: '40px', textAlign: 'center' }}>{g.point}/10</div>
          <button onClick={() => deleteGrade(g.id)} style={{
            background: 'rgba(220,38,38,0.2)', color: '#f87171',
            border: 'none', borderRadius: '2px',
            padding: '4px 10px', cursor: 'pointer', fontSize: '11px'
          }}>✕</button>
        </div>
      ))}
    </div>
  )
}

export default Grades