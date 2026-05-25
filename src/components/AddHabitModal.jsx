import { useState } from 'react'

const EMOJIS = ['🏃','💪','🧘','📚','💧','🥗','😴','🚴','✍️','🎯','🧠','🎵','🌿','☀️','🔥','❤️','💊','🏋️','🛁','🧹','💻','🌙','🍎','☕','🎨','🤸','🏊','🚶','📝','🎸']

const CAT_COLORS = {
  health:'#064e3b', mind:'#1e3a5f', wellness:'#3b1f5e',
  work:'#3b2a0c', social:'#1a3a2a', finance:'#2a1a3a', other:'#1e1e2a'
}

export default function AddHabitModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('health')
  const [frequency, setFrequency] = useState('daily')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🏃')
  const [saving, setSaving] = useState(false)
  const [nameErr, setNameErr] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { setNameErr(true); return }
    setSaving(true)
    await onSave({ name: name.trim(), icon, category, frequency, description, color: CAT_COLORS[category] })
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">New Habit</div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mfield">
          <label>Habit Name</label>
          <input
            type="text" placeholder="e.g. Morning run"
            value={name} onChange={e => { setName(e.target.value); setNameErr(false) }}
            style={nameErr ? { borderColor: 'var(--red)' } : {}}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>

        <div className="mfield">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="health">🏃 Health & Fitness</option>
            <option value="mind">🧠 Mind & Learning</option>
            <option value="wellness">🧘 Wellness</option>
            <option value="work">💼 Work & Productivity</option>
            <option value="social">👥 Social</option>
            <option value="finance">💰 Finance</option>
            <option value="other">✨ Other</option>
          </select>
        </div>

        <div className="mfield">
          <label>Icon</label>
          <div className="emoji-grid">
            {EMOJIS.map(e => (
              <div key={e} className={`emoji-opt${icon === e ? ' sel' : ''}`} onClick={() => setIcon(e)}>{e}</div>
            ))}
          </div>
        </div>

        <div className="mfield">
          <label>Frequency</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Every day</option>
            <option value="weekdays">Weekdays only</option>
            <option value="weekends">Weekends only</option>
            <option value="3x">3× per week</option>
            <option value="5x">5× per week</option>
          </select>
        </div>

        <div className="mfield">
          <label>Goal / Description (optional)</label>
          <textarea rows={2} placeholder="What's your goal with this habit?" value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Habit'}
          </button>
        </div>
      </div>
    </div>
  )
}
