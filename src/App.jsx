import { useState } from 'react'
import { useAuth } from './lib/AuthContext'
import { useHabits } from './hooks/useHabits'
import TodayPage from './pages/TodayPage'
import ProgressPage from './pages/ProgressPage'
import AllHabitsPage from './pages/AllHabitsPage'
import AuthPage from './pages/AuthPage'

const NAV = [
  { id: 'today', label: 'Today', icon: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )},
  { id: 'progress', label: 'Progress', icon: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )},
  { id: 'all', label: 'All Habits', icon: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/>
    </svg>
  )},
]

function AppShell() {
  const { user, signOut } = useAuth()
  const [page, setPage] = useState('today')

  if (!user) return <AuthPage />

  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const avatar = name[0].toUpperCase()

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span className="sidebar-logo-name">Habit<span>Flow</span></span>
        </div>

        <div className="nav-label">Main</div>
        {NAV.map(n => (
          <button key={n.id} className={`nav-item${page === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>
            {n.icon}{n.label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="user-chip">
            <div className="user-avatar">{avatar}</div>
            <div className="user-info">
              <div className="user-name">{name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <button className="logout-btn" onClick={signOut} title="Sign out">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {page === 'today' && <TodayPage />}
        {page === 'progress' && <ProgressPage />}
        {page === 'all' && <AllHabitsPage />}
      </div>
    </div>
  )
}

export default AppShell
