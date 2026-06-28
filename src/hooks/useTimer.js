import { useState, useEffect, useRef, useCallback } from 'react'

export const PHASES = [
  { id: 'inhale', label: 'மூச்சை இழு',  labelEn: 'Breathe In',  duration: 4, color: '#38bdf8' },
  { id: 'hold',   label: 'பிடி',          labelEn: 'Hold',        duration: 7, color: '#a78bfa' },
  { id: 'exhale', label: 'மூச்சை விடு',  labelEn: 'Breathe Out', duration: 8, color: '#34d399' },
]

const SESSION_DURATION = 5 * 60 // 5 minutes

export function useTimer(onSessionComplete) {
  const [isRunning, setIsRunning]         = useState(false)
  const [phaseIndex, setPhaseIndex]       = useState(0)
  const [phaseElapsed, setPhaseElapsed]   = useState(0)
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [cycleCount, setCycleCount]       = useState(0)
  const [isComplete, setIsComplete]       = useState(false)

  const intervalRef = useRef(null)

  const currentPhase    = PHASES[phaseIndex]
  const phaseRemaining  = currentPhase.duration - phaseElapsed
  const sessionRemaining = Math.max(0, SESSION_DURATION - sessionElapsed)
  const sessionProgress  = (sessionElapsed / SESSION_DURATION) * 100

  const tick = useCallback(() => {
    setPhaseElapsed(prev => {
      const next = prev + 1
      if (next >= PHASES[phaseIndex].duration) {
        const nextPhaseIdx = (phaseIndex + 1) % PHASES.length
        setPhaseIndex(nextPhaseIdx)
        if (nextPhaseIdx === 0) setCycleCount(c => c + 1)
        return 0
      }
      return next
    })

    setSessionElapsed(prev => {
      const next = prev + 1
      if (next >= SESSION_DURATION) {
        setIsRunning(false)
        setIsComplete(true)
        if (onSessionComplete) onSessionComplete(Math.round(SESSION_DURATION / 60))
        return SESSION_DURATION
      }
      return next
    })
  }, [phaseIndex, onSessionComplete])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, tick])

  const start  = useCallback(() => { setIsComplete(false); setIsRunning(true) }, [])
  const pause  = useCallback(() => setIsRunning(false), [])
  const resume = useCallback(() => setIsRunning(true), [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setPhaseIndex(0)
    setPhaseElapsed(0)
    setSessionElapsed(0)
    setCycleCount(0)
    setIsComplete(false)
  }, [])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    isRunning, isComplete,
    phaseIndex, phaseElapsed, phaseRemaining,
    currentPhase,
    sessionElapsed, sessionRemaining, sessionProgress,
    cycleCount,
    start, pause, resume, reset, formatTime,
  }
}