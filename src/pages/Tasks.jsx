import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'tasks'), where('uid', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const addTask = async () => {
    console.log('user:', user)
    if (!input.trim()) return
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        title: input,
        done: false,
        uid: user.uid,
        createdAt: new Date()
      })
      console.log('saved with id:', docRef.id)
    } catch (err) {
      console.error('error saving:', err)
    }
    setInput('')
  }

  const toggleTask = async (id, done) => {
    await updateDoc(doc(db, 'tasks', id), { done: !done })
  }

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="page-title">Tasks</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Add a new quest..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '2px',
            border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)',
            color: '#e0e0ff', fontSize: '14px', fontFamily: 'Cinzel, serif', outline: 'none'
          }}
        />
        <button onClick={addTask} style={{
          padding: '10px 20px', borderRadius: '2px',
          background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
          color: 'white', border: 'none', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px'
        }}>Add</button>
      </div>

      {loading ? (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px', fontFamily: 'Cinzel, serif' }}>⚡ Loading quests...</p>
      ) : tasks.length === 0 ? (
        <p style={{ opacity: 0.4, fontSize: '13px', letterSpacing: '1px' }}>No quests yet. Add one above! ⚔️</p>
      ) : null}

      {tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', marginBottom: '8px',
          background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
          border: `1px solid ${task.done ? '#22c55e44' : '#2a1f6e'}`,
          borderLeft: `3px solid ${task.done ? '#22c55e' : '#7c3aed'}`,
          borderRadius: '4px'
        }}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id, task.done)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#7c3aed' }}
          />
          <span style={{
            flex: 1, fontSize: '14px', color: '#e0d0ff',
            fontFamily: 'Cinzel, serif',
            textDecoration: task.done ? 'line-through' : 'none',
            opacity: task.done ? 0.4 : 1
          }}>
            {task.title}
          </span>
          {task.done && <span style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '1px' }}>COMPLETE</span>}
          <button onClick={() => deleteTask(task.id)} style={{
            background: 'rgba(220,38,38,0.2)', color: '#f87171',
            border: 'none', borderRadius: '2px',
            padding: '4px 10px', cursor: 'pointer', fontSize: '11px'
          }}>✕</button>
        </div>
      ))}
    </div>
  )
}

export default Tasks