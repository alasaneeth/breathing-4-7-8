import React from 'react'
import { PHASES } from '../hooks/useTimer'

export default function PhaseIndicator({ phaseIndex, phaseElapsed }) {
  return (
    <div className="flex gap-4 items-end">
      {PHASES.map((phase, i) => {
        const isActive = i === phaseIndex
        const isDone = i < phaseIndex
        return (
          <div key={phase.id} className="flex flex-col items-center gap-1">
            {/* Phase bar */}
            <div className="relative rounded-sm overflow-hidden"
              style={{ width: phase.duration * 5, height: 6, background: '#1e293b' }}>
              <div
                className="absolute inset-y-0 left-0 rounded-sm"
                style={{
                  background: phase.color,
                  width: isActive
                    ? `${(phaseElapsed / phase.duration) * 100}%`
                    : isDone ? '100%' : '0%',
                  transition: isActive ? 'width 0.95s linear' : 'none',
                }}
              />
            </div>
            {/* Seconds */}
            <span className="text-xs" style={{ color: isActive ? phase.color : '#475569', fontWeight: isActive ? 700 : 400 }}>
              {phase.duration}s
            </span>
            {/* Label */}
            <span style={{ color: isActive ? phase.color + 'bb' : '#334155', fontSize: '10px' }}>
              {phase.labelEn}
            </span>
          </div>
        )
      })}
    </div>
  )
}