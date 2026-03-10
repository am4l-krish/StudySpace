import { useState } from 'react'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  const addTask = () => {
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), title: input, done: false }])
    setInput('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="page-title">Tasks</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '15px',
            outline: 'none'
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {tasks.length === 0 && (
        <p style={{ opacity: 0.5 }}>No tasks yet. Add one above! ✅</p>
      )}

      {tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          marginBottom: '8px',
          background: '#1e1e2e',
          borderRadius: '8px',
          color: 'white'
        }}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span style={{
            flex: 1,
            fontSize: '15px',
            textDecoration: task.done ? 'line-through' : 'none',
            opacity: task.done ? 0.5 : 1
          }}>
            {task.title}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Tasks