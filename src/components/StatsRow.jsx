import React from "react";

export default function StatsRow({
  streak,
  totalDays,
  cycleCount,
  sessionRemaining,
  formatTime,
}) {
  const stats = [
    { label: "Streak", value: streak, suffix: "d" },
    { label: "Total Days", value: totalDays, suffix: "" },
    { label: "Cycles", value: cycleCount, suffix: "" },
    { label: "Remaining", value: formatTime(sessionRemaining), suffix: "" },
  ];

  return (
    <div className="flex gap-3 w-full max-w-md">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex-1 flex flex-col items-center py-2 px-1 rounded-lg"
          style={{ background: "#0f172a", border: "1px solid #1e293b" }}
        >
          <span className="text-xs text-slate-500 tracking-wide mb-0.5">
            {s.label}
          </span>
          <span className="text-xs sm:text-base font-bold tabular-nums text-slate-200">
            {s.value}
            {s.suffix}
          </span>
        </div>
      ))}
    </div>
  );
}
