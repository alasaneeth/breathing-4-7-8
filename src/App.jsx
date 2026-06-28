import React from 'react'
import { useTimer } from './hooks/useTimer'
import { useBreathingStorage } from './hooks/useBreathingStorage'
import BreathCircle from './components/BreathCircle'
import PhaseIndicator from './components/PhaseIndicator'
import Timeline from './components/Timeline'

export default function App() {
  const {
    sessionsDoneToday, canDoSession, recordSession, last7
  } = useBreathingStorage()

  const {
    isRunning, isComplete,
    phaseIndex, phaseElapsed, phaseRemaining,
    currentPhase, sessionRemaining,
    start, pause, reset, formatTime,
  } = useTimer(recordSession)

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 py-8"
      style={{ background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 100%)' }}>

      <h1 className="text-lg font-bold text-slate-200 tracking-tight">மூச்சுப் பயிற்சி</h1>

      {/* Session slots */}
      <div className="flex gap-3">
        {[0, 1].map(i => (
          <div key={i} className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: i < sessionsDoneToday ? '#38bdf822' : '#1e293b',
              border: `1px solid ${i < sessionsDoneToday ? '#38bdf844' : '#334155'}`,
              color: i < sessionsDoneToday ? '#38bdf8' : '#475569'
            }}>
            Session {i + 1} {i < sessionsDoneToday ? '✓' : '○'}
          </div>
        ))}
      </div>

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

      {canDoSession ? (
        <div className="flex gap-3">
          <button onClick={isRunning ? pause : start}
            className="px-6 py-2 rounded-lg font-bold"
            style={{ background: currentPhase.color, color: '#050d1a' }}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={reset}
            className="px-4 py-2 rounded-lg text-slate-400"
            style={{ background: '#1e293b' }}>
            Reset
          </button>
        </div>
      ) : (
        <div className="px-6 py-3 rounded-lg text-center"
          style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#475569' }}>
          ✓ Today's sessions done!
        </div>
      )}

      {/* Timeline */}
      <Timeline last7={last7} sessionsDoneToday={sessionsDoneToday} />

    </div>
  )
}