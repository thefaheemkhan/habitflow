import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import AddHabitModal from '../components/AddHabitModal'

const CAT_LABEL = { health:'Health', mind:'Mind', wellness:'Wellness', work:'Work', social:'Social', finance:'Finance', other:'Other' }
const FREQ_LABEL = { daily:'Daily', weekdays:'Weekdays', weekends:'Weekends', '3x':'3×/week', '5x':'5×/week' }

export default function TodayPage() {
  const { habits, logs, loading, toggleHabit, addHabit, deleteHabit, getStreak, getBestStreak, dateStr } = useHabits()
  const [showModal, setShowModal] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const todayLogs = logs[today] || []
  const doneCnt = todayLogs.length
  const totalCnt = habits.length

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // Best streak across all habits
  const bestStreak = habits.reduce((best, h) => Math.max(best, getBestStreak(h.id)), 0)

  // Weekly completion %
  let wDone = 0, wTotal = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = dateStr(d)
    wDone += (logs[ds] || []).length
    wTotal += habits.length
  }
  const weekPct = wTotal ? Math.round((wDone / wTotal) * 100) : 0

  // Heatmap: last 364 days
  const heatmapCells = []
  const total = habits.length || 1
  for (let i = 363; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = dateStr(d)
    const done = (logs[ds] || []).length
    const ratio = done / total
    let lvl = ''
    if (ratio > 0.75) lvl = 'l4'
    else if (ratio > 0.5) lvl = 'l3'
    else if (ratio > 0.25) lvl = 'l2'
    else if (ratio > 0) lvl = 'l1'
    heatmapCells.push({ ds, done, lvl })
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <span style={{ fontSize: 13, color: 'var(--text3)' }}>Loading habits...</span>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Today</div>
          <div className="page-sub">{todayLabel}</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Habit
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Today</div>
          <div className="stat-val green">{doneCnt}/{totalCnt}</div>
          <div className="stat-sub">completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best Streak</div>
          <div className="stat-val amber">{bestStreak}</div>
          <div className="stat-sub">days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Week</div>
          <div className="stat-val blue">{weekPct}%</div>
          <div className="stat-sub">completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Habits</div>
          <div className="stat-val purple">{totalCnt}</div>
          <div className="stat-sub">active</div>
        </div>
      </div>

      <div className="section-title">Today's Habits</div>
      <div className="habits-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="big">🌱</div>
            <p>No habits yet.<br/>Add your first habit to get started!</p>
          </div>
        ) : habits.map(h => {
          const isDone = todayLogs.includes(h.id)
          const streak = getStreak(h.id)
          return (
            <div key={h.id} className={`habit-row${isDone ? ' done' : ''}`}>
              <div className={`habit-check${isDone ? ' done' : ''}`} onClick={() => toggleHabit(h.id)}>
                {isDone && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className="habit-icon" style={{ background: h.color }}>{h.icon}</div>
              <div className="habit-info">
                <div className="habit-name">{h.name}</div>
                <div className="habit-meta">{CAT_LABEL[h.category]} · {FREQ_LABEL[h.frequency]}</div>
              </div>
              {streak > 0 && (
                <div className="habit-streak">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--amber)">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {streak}d
                </div>
              )}
              <div className="habit-actions">
                <button className="hab-btn del" onClick={() => deleteHabit(h.id)} title="Delete">
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
      </div>

      <div className="section-title" style={{ marginTop: '1.5rem' }}>Activity Heatmap</div>
      <div className="heatmap-wrap">
        <div className="section-title" style={{ margin: 0 }}>Last 52 weeks</div>
        <div className="heatmap-grid">
          {heatmapCells.map((c, i) => (
            <div key={i} className={`hmap-cell${c.lvl ? ' ' + c.lvl : ''}`} title={`${c.ds}: ${c.done} done`}/>
          ))}
        </div>
      </div>

      {showModal && (
        <AddHabitModal onClose={() => setShowModal(false)} onSave={addHabit} />
      )}
    </div>
  )
}
