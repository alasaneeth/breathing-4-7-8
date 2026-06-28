import React from 'react'
import { useTimer } from './hooks/useTimer'

export default function App() {
  const { isRunning, currentPhase, phaseRemaining, start, pause } = useTimer()

  return (
    <div className="min-h-dvh flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold" style={{ color: currentPhase.color }}>
        {currentPhase.labelEn}
      </h1>
      <p className="text-6xl font-bold tabular-nums" style={{ color: currentPhase.color }}>
        {phaseRemaining}
      </p>
      <button
        onClick={isRunning ? pause : start}
        className="px-6 py-2 rounded-lg text-white"
        style={{ background: currentPhase.color }}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  )
}