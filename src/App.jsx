import React from 'react'
import { useTimer } from './hooks/useTimer'
import BreathCircle from './components/BreathCircle'
import PhaseIndicator from './components/PhaseIndicator'

export default function App() {
  const {
    isRunning, isComplete,
    phaseIndex, phaseElapsed, phaseRemaining,
    currentPhase, sessionRemaining,
    start, pause, reset, formatTime,
  } = useTimer()

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6"
      style={{ background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 100%)' }}>

      <h1 className="text-lg font-bold tracking-tight text-slate-200">மூச்சுப் பயிற்சி</h1>

      <BreathCircle
        phaseIndex={phaseIndex}
        phaseElapsed={phaseElapsed}
        phaseRemaining={phaseRemaining}
        isRunning={isRunning}
        isComplete={isComplete}
      />

      <p className="text-2xl" style={{ color: currentPhase.color }}>
        {currentPhase.label}
      </p>

      <PhaseIndicator phaseIndex={phaseIndex} phaseElapsed={phaseElapsed} />

      <p className="text-slate-500 tabular-nums">{formatTime(sessionRemaining)} remaining</p>

      <div className="flex gap-3">
        <button onClick={isRunning ? pause : start}
          className="px-6 py-2 rounded-lg font-bold"
          style={{ background: currentPhase.color, color: '#050d1a' }}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset}
          className="px-6 py-2 rounded-lg text-slate-400"
          style={{ background: '#1e293b' }}>
          Reset
        </button>
      </div>
    </div>
  )
}