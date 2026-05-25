import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (!isLogin && !name.trim()) { setError('Please enter your name.'); return }

    setLoading(true)
    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    } else {
      const { error } = await signUp(email, password, name.trim())
      if (error) setError(error.message)
      else setError('Check your email to confirm your account, then sign in!')
    }
    setLoading(false)
  }

  const toggle = () => { setIsLogin(v => !v); setError('') }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span className="auth-logo-name">Habit<span>Flow</span></span>
        </div>

        <h1 className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p className="auth-sub">
          {isLogin ? 'Sign in to track your habits and streaks.' : 'Start your journey to better habits today.'}
        </p>

        {error && <div className="auth-err">{error}</div>}

        {!isLogin && (
          <div className="auth-field">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        )}
        <div className="auth-field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <div className="auth-switch">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>{' '}
          <button onClick={toggle}>{isLogin ? 'Sign up' : 'Sign in'}</button>
        </div>
      </div>
    </div>
  )
}
