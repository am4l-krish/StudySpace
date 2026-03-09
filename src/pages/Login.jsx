import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">📖</div>
        <h1 className="auth-title">SideQuest</h1>
        <p className="auth-subtitle">Your Academic Companion</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${!isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(false)}
          >Sign In</button>
          <button
            className={`auth-tab ${isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(true)}
          >Sign Up</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {isSignUp && (
          <input
            className="auth-input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleSubmit}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <div className="auth-divider">or</div>

        <button className="auth-google-btn" onClick={handleGoogle}>
          🔵 Continue with Google
        </button>
      </div>
    </div>
  )
}

export default Login