import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState({}) // { 'YYYY-MM-DD': [habit_id, ...] }
  const [loading, setLoading] = useState(true)

  const todayStr = () => new Date().toISOString().slice(0, 10)
  const dateStr = (d) => d.toISOString().slice(0, 10)

  // Load all habits
  const fetchHabits = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (!error) setHabits(data || [])
  }, [user])

  // Load logs for last 365 days
  const fetchLogs = useCallback(async () => {
    if (!user) return
    const since = new Date()
    since.setDate(since.getDate() - 365)
    const { data, error } = await supabase
      .from('habit_logs')
      .select('habit_id, log_date')
      .eq('user_id', user.id)
      .gte('log_date', dateStr(since))
    if (!error) {
      const grouped = {}
      ;(data || []).forEach(({ habit_id, log_date }) => {
        if (!grouped[log_date]) grouped[log_date] = []
        grouped[log_date].push(habit_id)
      })
      setLogs(grouped)
    }
  }, [user])

  useEffect(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    Promise.all([fetchHabits(), fetchLogs()]).finally(() => setLoading(false))
  }, [user, fetchHabits, fetchLogs])

  // Add a habit
  const addHabit = async (habitData) => {
    const { data, error } = await supabase
      .from('habits')
      .insert({ ...habitData, user_id: user.id })
      .select()
      .single()
    if (!error && data) setHabits(prev => [...prev, data])
    return { data, error }
  }

  // Delete a habit
  const deleteHabit = async (habitId) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', user.id)
    if (!error) setHabits(prev => prev.filter(h => h.id !== habitId))
    return { error }
  }

  // Toggle habit completion for today
  const toggleHabit = async (habitId) => {
    const today = todayStr()
    const todayLogs = logs[today] || []
    const isDone = todayLogs.includes(habitId)

    // Optimistic update
    setLogs(prev => {
      const current = prev[today] || []
      return {
        ...prev,
        [today]: isDone
          ? current.filter(id => id !== habitId)
          : [...current, habitId]
      }
    })

    if (isDone) {
      await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('log_date', today)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('habit_logs')
        .upsert({ habit_id: habitId, log_date: today, user_id: user.id })
    }
  }

  // Calculate current streak for a habit
  const getStreak = useCallback((habitId) => {
    let streak = 0
    const d = new Date()
    while (true) {
      const ds = dateStr(d)
      if (logs[ds]?.includes(habitId)) { streak++; d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  }, [logs])

  // Calculate best streak
  const getBestStreak = useCallback((habitId) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return 0
    const start = new Date(habit.created_at || '2024-01-01')
    let best = 0, cur = 0, d = new Date(start)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    while (d <= today) {
      const ds = dateStr(d)
      if (logs[ds]?.includes(habitId)) { cur++; if (cur > best) best = cur } else cur = 0
      d.setDate(d.getDate() + 1)
    }
    return best
  }, [logs, habits])

  // Completion rate over last 30 days
  const getCompletionRate = useCallback((habitId) => {
    let done = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const ds = dateStr(d)
      if (logs[ds]?.includes(habitId)) done++
    }
    return Math.round((done / 30) * 100)
  }, [logs])

  return {
    habits, logs, loading,
    addHabit, deleteHabit, toggleHabit,
    getStreak, getBestStreak, getCompletionRate,
    todayStr, dateStr, refresh: () => { fetchHabits(); fetchLogs() }
  }
}
