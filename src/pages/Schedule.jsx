import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

function Schedule() {
  const [classes, setClasses] = useState([])
  const [subject, setSubject] = useState('')
  const [day, setDay] = useState('Mon')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'schedule'), where('uid', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const addClass = async () => {
    if (!subject.trim()) return
    const slotHour = startTime ? startTime.split(':')[0] : '8'
    await addDoc(collection(db, 'schedule'), {
      subject, day, startTime, endTime, slotHour, uid: user.uid
    })
    setSubject('')
    setStartTime('')
    setEndTime('')
    setShowForm(false)
  }

  const deleteClass = async (id) => {
    await deleteDoc(doc(db, 'schedule', id))
  }

  const getClass = (d, slot) => {
    const slotHour = slot.split(':')[0]
    return classes.find(c => c.day === d && c.slotHour === slotHour)
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Schedule</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px', borderRadius: '2px',
            background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
            color: 'white', border: 'none', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Class'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
          border: '1px solid #2a1f6e', borderRadius: '4px',
          padding: '20px', marginBottom: '24px',
          display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2, minWidth: '140px' }}>
            <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>Subject</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '2px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)', color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>Day</label>
            <select value={day} onChange={e => setDay(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '2px', border: '1px solid #2a1f6e', background: '#0a0a18', color: '#a78bfa', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none' }}>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>Start</label>
            <select value={startTime} onChange={e => setStartTime(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '2px', border: '1px solid #2a1f6e', background: '#0a0a18', color: '#a78bfa', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none' }}>
              <option value="">Select</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase' }}>End</label>
            <select value={endTime} onChange={e => setEndTime(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '2px', border: '1px solid #2a1f6e', background: '#0a0a18', color: '#a78bfa', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none' }}>
              <option value="">Select</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button onClick={addClass} style={{
            padding: '9px 20px', borderRadius: '2px',
            background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
            color: 'white', border: 'none', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px'
          }}>Add</button>
        </div>
      )}

      {loading && (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px', fontFamily: 'Cinzel, serif' }}>⚡ Loading schedule...</p>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid #1e1a4a', background: '#0a0a18', width: '70px', fontFamily: 'Cinzel, serif' }}>Time</th>
              {days.map(d => (
                <th key={d} style={{ padding: '10px', fontSize: '11px', color: '#a78bfa', letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid #1e1a4a', background: '#0a0a18', fontFamily: 'Cinzel, serif' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td style={{ padding: '8px 10px', fontSize: '11px', color: '#4b5563', border: '1px solid #1e1a4a', background: '#0a0a18', textAlign: 'center', fontFamily: 'Cinzel, serif' }}>{slot}</td>
                {days.map(d => {
                  const cls = getClass(d, slot)
                  return (
                    <td key={d} style={{ padding: '4px', border: '1px solid #1e1a4a', background: cls ? 'rgba(124,58,237,0.08)' : '#07070f', height: '48px', verticalAlign: 'top' }}>
                      {cls && (
                        <div style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', borderRadius: '2px', padding: '6px 8px', position: 'relative', height: '100%', boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                          <div style={{ fontSize: '11px', color: '#fff', fontFamily: 'Cinzel, serif' }}>{cls.subject}</div>
                          {cls.endTime && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{cls.startTime} - {cls.endTime}</div>}
                          <button onClick={() => deleteClass(cls.id)} style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', borderRadius: '2px', width: '14px', height: '14px', fontSize: '8px', cursor: 'pointer' }}>✕</button>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Schedule