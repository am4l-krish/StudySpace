import { useState } from 'react'

function Grades() {
  const [grades, setGrades] = useState([])
  const [subject, setSubject] = useState('')
  const [mark, setMark] = useState('')

  const getGrade = (mark) => {
    if (mark >= 90) return { letter: 'O', point: 10 }
    if (mark >= 80) return { letter: 'A+', point: 9 }
    if (mark >= 70) return { letter: 'A', point: 8 }
    if (mark >= 60) return { letter: 'B+', point: 7 }
    if (mark >= 50) return { letter: 'B', point: 6 }
    if (mark >= 45) return { letter: 'C', point: 5 }
    return { letter: 'F', point: 0 }
  }

  const addGrade = () => {
    if (!subject.trim() || !mark) return
    const m = Number(mark)
    if (m < 0 || m > 100) return alert('Mark must be between 0 and 100')
    const { letter, point } = getGrade(m)
    setGrades([...grades, { id: Date.now(), subject, mark: m, letter, point }])
    setSubject('')
    setMark('')
  }

  const deleteGrade = (id) => setGrades(grades.filter(g => g.id !== id))

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

      {/* CGPA Card */}
      {cgpa && (
        <div style={{
          background: '#1e1e2e', color: 'white', borderRadius: '12px',
          padding: '20px', marginBottom: '24px', display: 'inline-block', minWidth: '200px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '4px' }}>Current CGPA</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4f46e5' }}>{cgpa}</div>
          <div style={{ fontSize: '13px', opacity: 0.5 }}>out of 10.0</div>
        </div>
      )}

      {/* Add Grade */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Subject name"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          style={{
            flex: 1, minWidth: '160px', padding: '10px 14px',
            borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px'
          }}
        />
        <input
          type="number"
          placeholder="Mark (0-100)"
          value={mark}
          onChange={e => setMark(e.target.value)}
          style={{
            width: '140px', padding: '10px 14px',
            borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px'
          }}
        />
        <button onClick={addGrade} style={{
          padding: '10px 20px', borderRadius: '8px',
          background: '#4f46e5', color: 'white', border: 'none', fontSize: '15px', cursor: 'pointer'
        }}>
          Add
        </button>
      </div>

      {/* Grade Scale Reference */}
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
            borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 'bold'
          }}>{label}</span>
        ))}
      </div>

      {/* Grades List */}
      {grades.length === 0 && (
        <p style={{ opacity: 0.5 }}>No grades yet. Add a subject above! 📚</p>
      )}

      {grades.map(g => (
        <div key={g.id} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', marginBottom: '8px',
          background: '#1e1e2e', borderRadius: '8px', color: 'white'
        }}>
          <div style={{ flex: 1, fontSize: '15px' }}>{g.subject}</div>
          <div style={{ fontSize: '14px', opacity: 0.6 }}>{g.mark}/100</div>
          <div style={{
            fontWeight: 'bold', fontSize: '16px',
            color: gradeColor(g.letter), minWidth: '36px', textAlign: 'center'
          }}>
            {g.letter}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.6, minWidth: '40px', textAlign: 'center' }}>
            {g.point}/10
          </div>
          <button onClick={() => deleteGrade(g.id)} style={{
            background: '#ef4444', color: 'white', border: 'none',
            borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '13px'
          }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Grades