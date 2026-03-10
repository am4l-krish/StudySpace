import { useState, useEffect } from 'react'

function Pomodoro() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' or 'break'

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(s => s - 1)
      } else if (minutes > 0) {
        setMinutes(m => m - 1)
        setSeconds(59)
      } else {
        // Timer done!
        clearInterval(timer)
        setIsRunning(false)
        alert(mode === 'focus' ? '✅ Focus session done! Take a break.' : '💪 Break over! Back to work.')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, minutes, seconds, mode])

  const reset = () => {
    setIsRunning(false)
    setMinutes(mode === 'focus' ? 25 : 5)
    setSeconds(0)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    setMinutes(newMode === 'focus' ? 25 : 5)
    setSeconds(0)
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 className="page-title" style={{ textAlign: 'left' }}>Pomodoro Timer</h1>

      {/* Mode switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
        <button
          onClick={() => switchMode('focus')}
          style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: mode === 'focus' ? '#4f46e5' : '#e5e7eb',
            color: mode === 'focus' ? 'white' : 'black', fontSize: '15px'
          }}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('break')}
          style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: mode === 'break' ? '#4f46e5' : '#e5e7eb',
            color: mode === 'break' ? 'white' : 'black', fontSize: '15px'
          }}
        >
          Break (5m)
        </button>
      </div>

      {/* Timer display */}
      <div style={{
        fontSize: '96px', fontWeight: 'bold', letterSpacing: '4px',
        color: '#1e1e2e', marginBottom: '40px'
      }}>
        {pad(minutes)}:{pad(seconds)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: '14px 40px', borderRadius: '8px', border: 'none',
            background: '#4f46e5', color: 'white', fontSize: '18px', cursor: 'pointer'
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '14px 40px', borderRadius: '8px', border: 'none',
            background: '#e5e7eb', color: 'black', fontSize: '18px', cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default Pomodoro