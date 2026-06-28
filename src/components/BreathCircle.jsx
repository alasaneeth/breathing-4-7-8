import React from 'react'
import { PHASES } from '../hooks/useTimer'

export default function BreathCircle({ phaseIndex, phaseElapsed, phaseRemaining, isRunning, isComplete }) {
  const phase = PHASES[phaseIndex]

  const circleClass = !isRunning && phaseElapsed === 0
    ? 'circle-idle'
    : phase.id === 'inhale'
    ? 'circle-breathe-in'
    : phase.id === 'hold'
    ? 'circle-breathe-hold'
    : 'circle-breathe-out'

  const progress = (phaseElapsed / phase.duration) * 100

  return (
    <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>

      {/* Ripple rings */}
      {isRunning && phase.id !== 'hold' && (
        <>
          <div className="ripple absolute rounded-full border"
            style={{ width: 200, height: 200, borderColor: phase.color, opacity: 0.3 }} />
          <div className="ripple-delay absolute rounded-full border"
            style={{ width: 200, height: 200, borderColor: phase.color, opacity: 0.2 }} />
        </>
      )}

      {/* SVG progress ring */}
      <svg className="absolute" width={240} height={240} viewBox="0 0 240 240">
        <circle cx={120} cy={120} r={108} fill="none" stroke="#1e293b" strokeWidth={6} />
        <circle
          cx={120} cy={120} r={108}
          fill="none"
          stroke={phase.color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 108}`}
          strokeDashoffset={`${2 * Math.PI * 108 * (1 - progress / 100)}`}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease' }}
          transform="rotate(-90 120 120)"
        />
      </svg>

      {/* Main circle */}
      <div
        className={`${circleClass} rounded-full flex flex-col items-center justify-center`}
        key={`${phaseIndex}-${isRunning}`}
        style={{
          width: 180, height: 180,
          background: `radial-gradient(circle at 40% 35%, ${phase.color}44, ${phase.color}11 70%)`,
          border: `2px solid ${phase.color}66`,
          boxShadow: `0 0 40px ${phase.color}33`,
          transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {isComplete ? (
          <span className="text-4xl">✓</span>
        ) : (
          <>
            <span className="text-5xl font-bold tabular-nums" style={{ color: phase.color }}>
              {phaseRemaining}
            </span>
            <span className="text-xs mt-1 tracking-widest uppercase" style={{ color: phase.color + 'cc' }}>
              {phase.labelEn}
            </span>
          </>
        )}
      </div>
    </div>
  )
}