import React, { useState } from 'react'
import { useTimer } from './hooks/useTimer'
import { useBreathingStorage } from './hooks/useBreathingStorage'
import BreathCircle from './components/BreathCircle'
import PhaseIndicator from './components/PhaseIndicator'
import Timeline from './components/Timeline'
import StatsRow from './components/StatsRow'

export default function App() {
  const {
    sessionsDoneToday, canDoSession,
    recordSession, resetAll,
    last7, streak, totalDays,
  } = useBreathingStorage()

  const [view, setView] = useState('home')
  const [showReset, setShowReset] = useState(false)

  const {
    isRunning, isComplete,
    phaseIndex, phaseElapsed, phaseRemaining,
    currentPhase, sessionRemaining, sessionProgress,
    cycleCount, start, pause, resume, reset, formatTime,
  } = useTimer((mins) => {
    recordSession(mins)
    setView('done')
  })

  const handleStart = () => {
    reset()
    setView('session')
    setTimeout(start, 300)
  }

  const handleFinish = () => {
    reset()
    setView('home')
  }

  return (
 <div className="w-full flex flex-col items-center px-3 py-5 gap-4"
  style={{ background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 100%)', minHeight: '100dvh' }}>

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-200">மூச்சுப் பயிற்சி</h1>
          <p className="text-xs tracking-widest text-slate-500">4 · 7 · 8 METHOD</p>
        </div>
        <button onClick={() => setShowReset(v => !v)}
          className="text-slate-600 hover:text-slate-400 transition-colors px-2 py-1 rounded text-xs">
          ⚙
        </button>
      </div>

      {/* Reset panel */}
      {showReset && (
        <div className="w-full max-w-md rounded-lg p-4 flex items-center justify-between"
          style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
          <span className="text-xs text-slate-400">Reset all data?</span>
          <div className="flex gap-2">
            <button onClick={() => { resetAll(); setShowReset(false); reset(); setView('home') }}
              className="text-xs px-3 py-1 rounded"
              style={{ background: '#7f1d1d', color: '#fca5a5' }}>
              Reset
            </button>
            <button onClick={() => setShowReset(false)}
              className="text-xs px-3 py-1 rounded text-slate-400"
              style={{ background: '#1e293b' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── HOME VIEW ── */}
      {view === 'home' && (
        <>
          <StatsRow
            streak={streak}
            totalDays={totalDays}
            cycleCount={0}
            sessionRemaining={5 * 60}
            formatTime={formatTime}
          />

          {/* Session slots */}
          <div className="w-full max-w-md rounded-xl p-4"
            style={{ background: '#0a1628', border: '1px solid #1e293b' }}>
            <p className="text-xs text-slate-500 mb-3 tracking-widest uppercase">Today's Sessions</p>
            <div className="flex gap-3">
              {[0, 1].map(i => (
                <div key={i} className="flex-1 rounded-lg p-3 flex flex-col gap-1"
                  style={{
                    background: i < sessionsDoneToday ? '#38bdf811' : '#0f172a',
                    border: `1px solid ${i < sessionsDoneToday ? '#38bdf844' : '#1e293b'}`,
                  }}>
                  <span className="text-xl">{i < sessionsDoneToday ? '✓' : '○'}</span>
                  <span className="text-xs" style={{ color: i < sessionsDoneToday ? '#38bdf8' : '#334155' }}>
                    Session {i + 1}
                  </span>
                  <span className="text-xs text-slate-600">5 min</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start button */}
          {canDoSession ? (
            <button onClick={handleStart}
              className="w-full max-w-md py-4 rounded-xl font-bold tracking-widest text-sm uppercase transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                color: '#fff',
                boxShadow: '0 0 32px #0ea5e933',
              }}>
              Start Session {sessionsDoneToday + 1}
            </button>
          ) : (
            <div className="w-full max-w-md py-4 rounded-xl text-center text-sm"
              style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#475569' }}>
              ✓ Both sessions done for today!<br />
              <span className="text-xs">Come back tomorrow</span>
            </div>
          )}

          <Timeline last7={last7} sessionsDoneToday={sessionsDoneToday} />

          {/* Method guide */}
          <div className="w-full max-w-md rounded-xl p-4"
            style={{ background: '#0a1628', border: '1px solid #1e293b' }}>
            <p className="text-xs tracking-widest text-slate-500 uppercase mb-3">4-7-8 Method</p>
            <div className="flex flex-col gap-2">
              {[
                { phase: 'Inhale', secs: '4s', color: '#38bdf8', ta: 'மூக்கால் மூச்சை இழு' },
                { phase: 'Hold',   secs: '7s', color: '#a78bfa', ta: 'மூச்சை பிடி'         },
                { phase: 'Exhale', secs: '8s', color: '#34d399', ta: 'வாயால் மூச்சை விடு'  },
              ].map(r => (
                <div key={r.phase} className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full" style={{ background: r.color }} />
                  <span className="text-xs w-14" style={{ color: r.color }}>{r.phase}</span>
                  <span className="text-xs font-bold w-8" style={{ color: r.color }}>{r.secs}</span>
                  <span className="text-xs text-slate-500">{r.ta}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── SESSION VIEW ── */}
      {view === 'session' && (
        <>
          {/* Progress bar */}
          <div className="w-full max-w-md h-1 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${sessionProgress}%`,
                background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
              }} />
          </div>
          <div className="flex justify-between w-full max-w-md text-xs text-slate-500">
            <span>Session {sessionsDoneToday + 1}/2</span>
            <span>{formatTime(sessionRemaining)} left</span>
          </div>

          <BreathCircle
            phaseIndex={phaseIndex}
            phaseElapsed={phaseElapsed}
            phaseRemaining={phaseRemaining}
            isRunning={isRunning}
            isComplete={isComplete}
          />

          <p className="text-2xl tracking-wide" style={{ color: currentPhase.color + 'cc' }}>
            {currentPhase.label}
          </p>

          <PhaseIndicator phaseIndex={phaseIndex} phaseElapsed={phaseElapsed} />

          <StatsRow
            streak={streak}
            totalDays={totalDays}
            cycleCount={cycleCount}
            sessionRemaining={sessionRemaining}
            formatTime={formatTime}
          />

          <div className="flex gap-3 w-full max-w-md">
            <button onClick={isRunning ? pause : resume}
              className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-80"
              style={{ background: '#1e293b', color: '#94a3b8' }}>
              {isRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button onClick={() => { reset(); setView('home') }}
              className="py-3 px-5 rounded-xl text-sm transition-all hover:opacity-80"
              style={{ background: '#1e293b', color: '#475569' }}>
              ✕ Stop
            </button>
          </div>
        </>
      )}

      {/* ── DONE VIEW ── */}
      {view === 'done' && (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mt-8">
          <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl"
            style={{
              background: 'radial-gradient(circle, #38bdf822, #38bdf811)',
              border: '2px solid #38bdf844',
              boxShadow: '0 0 40px #38bdf822',
            }}>
            🌬️
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ color: '#38bdf8' }}>நன்றாக செய்தீர்கள்!</h2>
            <p className="text-slate-400 text-sm mt-1">Session {sessionsDoneToday}/2 complete</p>
          </div>

          <div className="w-full rounded-xl p-4 flex justify-around"
            style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#38bdf8' }}>{streak}</p>
              <p className="text-xs text-slate-500">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{totalDays}</p>
              <p className="text-xs text-slate-500">Total Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#34d399' }}>5</p>
              <p className="text-xs text-slate-500">Minutes</p>
            </div>
          </div>

          <Timeline last7={last7} sessionsDoneToday={sessionsDoneToday} />

          <button onClick={handleFinish}
            className="w-full py-4 rounded-xl font-bold tracking-widest text-sm uppercase"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: '#fff',
            }}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  )
}