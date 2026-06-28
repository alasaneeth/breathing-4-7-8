import { useState, useCallback } from 'react'

const STORAGE_KEY = '478_breathing_data'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function getDefaultData() {
  return {
    history: [],
    streak: 0,
    lastDate: null,
  }
}

export function useBreathingStorage() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : getDefaultData()
    } catch {
      return getDefaultData()
    }
  })

  const today = todayStr()
  const todayEntry = data.history.find(h => h.date === today) || { date: today, sessions: 0, totalMinutes: 0 }
  const sessionsDoneToday = todayEntry.sessions
  const canDoSession = sessionsDoneToday < 2

  const recordSession = useCallback((minutesSpent) => {
    setData(prev => {
      const next = { ...prev, history: [...prev.history] }
      const idx = next.history.findIndex(h => h.date === today)

      if (idx >= 0) {
        next.history[idx] = {
          ...next.history[idx],
          sessions: next.history[idx].sessions + 1,
          totalMinutes: next.history[idx].totalMinutes + minutesSpent,
        }
      } else {
        next.history.push({ date: today, sessions: 1, totalMinutes: minutesSpent })
      }

      // Streak calculate
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yStr = yesterday.toISOString().slice(0, 10)

      if (prev.lastDate === yStr || prev.lastDate === today) {
        next.streak = prev.lastDate === today ? prev.streak : prev.streak + 1
      } else {
        next.streak = 1
      }
      next.lastDate = today

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [today])

  const resetAll = useCallback(() => {
    const fresh = getDefaultData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    setData(fresh)
  }, [])

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().slice(0, 10)
    const entry = data.history.find(h => h.date === ds)
    return {
      date: ds,
      label: d.toLocaleDateString('ta-IN', { weekday: 'short' }),
      sessions: entry?.sessions || 0,
      totalMinutes: entry?.totalMinutes || 0,
    }
  })

  return {
    data,
    todayEntry,
    sessionsDoneToday,
    canDoSession,
    recordSession,
    resetAll,
    last7,
    streak: data.streak,
    totalDays: data.history.filter(h => h.sessions > 0).length,
  }
}