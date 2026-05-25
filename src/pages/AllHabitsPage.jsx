import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import AddHabitModal from '../components/AddHabitModal'

const CAT_LABEL = { health:'Health', mind:'Mind', wellness:'Wellness', work:'Work', social:'Social', finance:'Finance', other:'Other' }
const FREQ_LABEL = { daily:'Daily', weekdays:'Weekdays', weekends:'Weekends', '3x':'3×/week', '5x':'5×/week' }

export default function AllHabitsPage() {
  const { habits, loading, addHabit, deleteHabit, getStreak, getCompletionRate } = useHabits()
  const [showModal, setShowModal] = useState(false)

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">All Habits</div>
          <div className="page-sub">Manage your habit library</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="big">📋</div>
          <p>No habits yet.<br/>Add your first habit to get started!</p>
        </div>
      ) : habits.map(h => {
        const rate = getCompletionRate(h.id)
        const streak = getStreak(h.id)
        return (
          <div key={h.id} className="all-habit-card">
            <div className="habit-icon" style={{ background: h.color }}>{h.icon}</div>
            <div className="all-habit-info">
              <div className="all-habit-name">{h.name}</div>
              <div className="all-habit-meta">
                {CAT_LABEL[h.category]} · {FREQ_LABEL[h.frequency]}
                {h.description ? ` · ${h.description}` : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span className="badge badge-green">{rate}% done</span>
              {streak > 0 && <span className="badge badge-amber">🔥 {streak}d</span>}
              <button className="hab-btn del" onClick={() => deleteHabit(h.id)} title="Delete" style={{ opacity: 1 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {showModal && (
        <AddHabitModal onClose={() => setShowModal(false)} onSave={addHabit} />
      )}
    </div>
  )
}
