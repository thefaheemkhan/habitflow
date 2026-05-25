import { useHabits } from '../hooks/useHabits'

const CAT_COLORS = {
  health:'#064e3b', mind:'#1e3a5f', wellness:'#3b1f5e',
  work:'#3b2a0c', social:'#1a3a2a', finance:'#2a1a3a', other:'#1e1e2a'
}
const DAYS = ['S','M','T','W','T','F','S']

export default function ProgressPage() {
  const { habits, logs, loading, getStreak, getBestStreak, getCompletionRate, dateStr } = useHabits()

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  )

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return { d, ds: dateStr(d), isToday: i === 6 }
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Progress</div>
          <div className="page-sub">Track your momentum</div>
        </div>
      </div>

      <div className="prog-grid">
        {/* Completion Rates */}
        <div className="prog-card">
          <div className="prog-card-title">30-day Completion</div>
          {habits.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>No habits yet.</p>
          ) : habits.map(h => {
            const rate = getCompletionRate(h.id)
            return (
              <div key={h.id} className="habit-prog-item">
                <div className="habit-prog-icon" style={{ background: CAT_COLORS[h.category] || '#1e1e2a' }}>{h.icon}</div>
                <div className="habit-prog-info">
                  <div className="habit-prog-name">{h.name}</div>
                  <div className="prog-bar-wrap">
                    <div className="prog-bar" style={{ width: rate + '%' }}/>
                  </div>
                </div>
                <div className="habit-prog-pct">{rate}%</div>
              </div>
            )
          })}
        </div>

        {/* This Week */}
        <div className="prog-card">
          <div className="prog-card-title">This Week</div>
          <div className="week-grid">
            {weekDays.map(({ d, ds, isToday }) => {
              const done = (logs[ds] || []).length
              const hasDone = done > 0
              return (
                <div key={ds} className="week-day">
                  <div className="week-day-label">{DAYS[d.getDay()]}</div>
                  <div className={`week-day-dot${hasDone ? ' done' : ''}${isToday ? ' today' : ''}`}>
                    {done}
                  </div>
                </div>
              )
            })}
          </div>

          {habits.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              {habits.map(h => {
                const thisWeek = weekDays.filter(({ ds }) => (logs[ds] || []).includes(h.id)).length
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14 }}>{h.icon}</span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: thisWeek >= 5 ? 'var(--accent)' : 'var(--text3)' }}>{thisWeek}/7</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Streaks */}
      <div className="prog-card">
        <div className="prog-card-title">Streaks</div>
        {habits.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>No habits yet.</p>
        ) : habits.map(h => {
          const cur = getStreak(h.id)
          const best = getBestStreak(h.id)
          return (
            <div key={h.id} className="habit-prog-item">
              <div className="habit-prog-icon" style={{ background: CAT_COLORS[h.category] || '#1e1e2a' }}>{h.icon}</div>
              <div className="habit-prog-info">
                <div className="habit-prog-name">{h.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>Best: {best} days</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>{cur}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>current</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
