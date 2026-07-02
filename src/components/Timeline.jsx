import React from 'react'

export default function Timeline({ last7, sessionsDoneToday }) {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs tracking-widest text-slate-500 uppercase">7-Day Timeline</h3>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#1e293b' }} />
          <span>0</span>
          <span className="w-3 h-3 rounded-sm inline-block ml-1" style={{ background: '#38bdf822' }} />
          <span>1</span>
          <span className="w-3 h-3 rounded-sm inline-block ml-1" style={{ background: '#38bdf8' }} />
          <span>2 sessions</span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex gap-2">
        {last7.map((day) => {
          const isToday = day.date === today
          const pct = Math.min(day.sessions / 2, 1)
          const bg =
            day.sessions === 0 ? '#1e293b'
            : day.sessions === 1 ? '#38bdf822'
            : '#38bdf8'
          const border = isToday ? '#38bdf8' : day.sessions > 0 ? '#38bdf844' : '#334155'

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              {/* Bar */}
              <div
                className="relative w-full rounded-sm overflow-hidden"
                style={{ height: 40, background: '#0f172a', border: `1px solid ${border}` }}
                title={`${day.sessions} session${day.sessions !== 1 ? 's' : ''} · ${day.totalMinutes} min`}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-500"
                  style={{ height: `${pct * 100}%`, background: bg }}
                />
                {/* Dots */}
                {day.sessions > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    {Array.from({ length: Math.min(day.sessions, 2) }).map((_, j) => (
                      <div key={j} className="rounded-full"
                        style={{ width: 5, height: 5, background: '#38bdf8' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Day label */}
              <span style={{
                fontSize: '9px',
                color: isToday ? '#38bdf8' : '#475569',
                fontWeight: isToday ? 700 : 400,
                letterSpacing: '0.05em',
              }}>
                {isToday ? 'Today' : day.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Today's session progress */}
      <div className="mt-3 flex gap-2">
        {[0, 1].map(i => (
          <div key={i} className="flex-1 h-1.5 rounded-full"
            style={{
              background: i < sessionsDoneToday ? '#38bdf8' : '#1e293b',
              border: '1px solid #334155',
              transition: 'background 0.4s ease',
            }}
          />
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 mt-1">
        {sessionsDoneToday}/2 sessions today
      </p>
    </div>
  )
}