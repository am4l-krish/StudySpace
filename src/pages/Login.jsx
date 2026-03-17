import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import sqlogo from '../assets/sqlogo.png'

function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [marqueePos, setMarqueePos] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMarqueePos(p => (p - 1) % 600)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    setError('')
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err.message)
    }
  }

  const features = [
    { icon: '📋', title: 'Task Management', desc: 'Track quests and daily goals with ease' },
    { icon: '📊', title: 'Grade Tracker', desc: 'SRM CGPA calculator with smart rankings' },
    { icon: '🗓️', title: 'Schedule', desc: 'Visual timetable for your weekly classes' },
    { icon: '🤖', title: 'AI Assistant', desc: 'Powered by Llama 3 for instant study help' },
    { icon: '⏱️', title: 'Pomodoro Timer', desc: 'Focus sessions to maximize productivity' },
    { icon: '📚', title: 'Study Materials', desc: 'YouTube, PDFs and notes in one place' },
  ]

  const marqueeText = '⚡ TASK MANAGEMENT  ✦  GRADE TRACKING  ✦  AI ASSISTANT  ✦  POMODORO TIMER  ✦  STUDY MATERIALS  ✦  SCHEDULE PLANNER  ✦  '

  return (
    <div style={{ background: '#05051a', minHeight: '100vh', fontFamily: 'Cinzel, serif', color: '#e0e0ff', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #1a1a3a', position: 'sticky', top: 0, background: '#05051a', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={sqlogo} alt="SideQuest" style={{ width: '32px', height: '32px', objectFit: 'contain', mixBlendMode: 'screen' }} />          <span style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'Cinzel Decorative, serif', background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '3px' }}>SIDEQUEST</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setIsSignUp(false); setShowForm(true) }} style={{ padding: '9px 24px', borderRadius: '10px', background: 'transparent', border: '1px solid #2a1f6e', color: '#a78bfa', fontSize: '11px', cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px', fontWeight: '600' }}>
            SIGN IN
          </button>
          <button onClick={() => { setIsSignUp(true); setShowForm(true) }} style={{ padding: '9px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', border: 'none', color: 'white', fontSize: '11px', cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '1px', fontWeight: '600' }}>
            GET STARTED
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '80px 48px 60px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ fontSize: '11px', color: '#7c3aed', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#7c3aed' }}></span>
            YOUR ACADEMIC COMPANION
          </div>

          <h1 style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', color: '#f0edff' }}>
            LEVEL UP YOUR<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STUDENT LIFE</span>
          </h1>

          <p style={{ fontSize: '14px', color: '#6b6b90', maxWidth: '480px', lineHeight: '1.8', marginBottom: '40px', letterSpacing: '0.5px' }}>
            SideQuest is your all-in-one academic productivity app. Manage tasks, track grades, plan your schedule, and get AI-powered study help — all in one powerful platform.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <button onClick={() => { setIsSignUp(true); setShowForm(true) }} style={{ padding: '14px 36px', borderRadius: '12px', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '2px', fontWeight: '700', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>
              START FOR FREE →
            </button>
            <button onClick={() => { setIsSignUp(false); setShowForm(true) }} style={{ padding: '14px 36px', borderRadius: '12px', background: 'transparent', border: '1px solid #2a1f6e', color: '#a78bfa', fontSize: '12px', cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '2px', fontWeight: '600' }}>
              SIGN IN
            </button>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {[{ num: '8+', label: 'Features' }, { num: '100%', label: 'Free Forever' }, { num: 'AI', label: 'Powered' }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: '28px', fontWeight: '900', color: '#a78bfa' }}>{s.num}</div>
                <div style={{ fontSize: '11px', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero logo image */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
            <img src={sqlogo} alt="SideQuest Logo" style={{ width: '220px', height: '220px', objectFit: 'contain', position: 'relative', filter: 'drop-shadow(0 0 24px rgba(167,139,250,0.6))' }} />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ background: '#7c3aed', padding: '14px 0', overflow: 'hidden', borderTop: '1px solid #5b21b6', borderBottom: '1px solid #5b21b6' }}>
        <div style={{ whiteSpace: 'nowrap', transform: `translateX(${marqueePos}px)`, fontSize: '11px', color: 'white', letterSpacing: '2px', fontWeight: '700' }}>
          {marqueeText.repeat(6)}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 48px' }}>
        <div style={{ fontSize: '11px', color: '#7c3aed', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>WHAT YOU GET</div>
        <h2 style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: '700', textAlign: 'center', color: '#f0edff', marginBottom: '48px' }}>EVERYTHING YOU NEED TO SUCCEED</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'linear-gradient(135deg, #0d0d1f, #10102a)', border: '1px solid #2a1f6e', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a1f6e'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e0d0ff', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: '#6b6b90', lineHeight: '1.7', letterSpacing: '0.3px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ margin: '0 48px 80px', background: 'linear-gradient(135deg, #0d0d1f, #10102a)', border: '1px solid #2a1f6e', borderRadius: '20px', padding: '60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
        <img src={sqlogo} alt="SideQuest" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '20px', filter: 'drop-shadow(0 0 12px rgba(167,139,250,0.5))' }} />
        <h2 style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: '900', color: '#f0edff', marginBottom: '16px' }}>READY TO BEGIN?</h2>
        <p style={{ fontSize: '13px', color: '#6b6b90', marginBottom: '32px', letterSpacing: '0.5px' }}>Join SideQuest and start your academic journey today. Free forever.</p>
        <button onClick={() => { setIsSignUp(true); setShowForm(true) }} style={{ padding: '16px 48px', borderRadius: '12px', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', border: 'none', color: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '2px', fontWeight: '700', boxShadow: '0 0 32px rgba(124,58,237,0.4)' }}>
          GET STARTED FREE →
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div style={{ background: 'linear-gradient(135deg, #0a0a18, #0d0d22)', border: '1px solid #2a1f6e', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 0 60px rgba(124,58,237,0.3)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)', borderRadius: '20px 20px 0 0' }} />

            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(124,58,237,0.1)', border: '1px solid #2a1f6e', color: '#a78bfa', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '12px' }}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <img src={sqlogo} alt="SideQuest" style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '10px', filter: 'drop-shadow(0 0 10px rgba(167,139,250,0.6))' }} />
              <div style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: '18px', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '2px' }}>SIDEQUEST</div>
            </div>

            <div style={{ display: 'flex', border: '1px solid #1e1a4a', borderRadius: '10px', marginBottom: '24px', overflow: 'hidden' }}>
              {['Sign In', 'Sign Up'].map((t, i) => (
                <button key={t} onClick={() => setIsSignUp(i === 1)} style={{ flex: 1, padding: '9px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', border: 'none', background: (i === 0 ? !isSignUp : isSignUp) ? 'linear-gradient(135deg, #5b21b6, #7c3aed)' : 'transparent', color: (i === 0 ? !isSignUp : isSignUp) ? 'white' : '#4b5563', fontFamily: 'Cinzel, serif', letterSpacing: '1px', transition: 'all 0.2s' }}>{t}</button>
              ))}
            </div>

            {error && <div style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '10px', padding: '10px 13px', fontSize: '12px', marginBottom: '14px' }}>{error}</div>}

            {isSignUp && (
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)', color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none', marginBottom: '12px' }} />
            )}
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)', color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none', marginBottom: '12px' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)', color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none', marginBottom: '16px' }} />

            <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '700', fontFamily: 'Cinzel, serif', marginBottom: '12px', cursor: 'pointer', letterSpacing: '2px', boxShadow: '0 0 16px rgba(124,58,237,0.3)' }}>
              {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>

            <div style={{ textAlign: 'center', color: '#374151', fontSize: '10px', marginBottom: '12px', letterSpacing: '2px' }}>OR</div>

            <button onClick={handleGoogle} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #2a1f6e', borderRadius: '10px', fontSize: '12px', fontFamily: 'Cinzel, serif', cursor: 'pointer', color: '#a78bfa', letterSpacing: '1px', fontWeight: '600' }}>
              🔵 CONTINUE WITH GOOGLE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login