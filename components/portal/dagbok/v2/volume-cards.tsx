"use client";

interface VolumeCardsProps {
  pyramid: { name: string; pct: number; color: string }[];
  pyramidAiTip?: string;
  weekly: { week: string; hours: number }[];
  weeklyAvg: number;
  weeklyPeak?: string | null;
  weeklyQoq?: string | null;
  typeDistribution: { name: string; pct: number; color: string }[];
  totalSessions: number;
}

const WEEKLY_GOAL = 10;

export function VolumeCards({
  pyramid,
  pyramidAiTip,
  weekly,
  weeklyAvg,
  weeklyPeak,
  weeklyQoq,
  typeDistribution,
  totalSessions,
}: VolumeCardsProps) {
  const maxHours = Math.max(WEEKLY_GOAL * 1.5, ...weekly.map((w) => w.hours));
  const peakHours = weekly.reduce((m, w) => Math.max(m, w.hours), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-card border border-line rounded-2xl p-4">
        <h3 className="m-0 mb-2.5 text-[13px] font-bold text-ink">
          Pyramide-volum · 30d
        </h3>
        <div className="font-mono text-[9px] text-ink-subtle tracking-[0.14em] mb-3.5 uppercase">
          % av total trening
        </div>
        <div className="flex flex-col gap-1.5">
          {pyramid.map((p) => (
            <div
              key={p.name}
              className="grid items-center text-xs gap-2.5"
              style={{ gridTemplateColumns: "90px 1fr 60px" }}
            >
              <span className="font-semibold text-ink">{p.name}</span>
              <div className="h-3 bg-surface-soft rounded overflow-hidden">
                <div className="h-full rounded" style={{ background: p.color, width: `${p.pct}%` }} />
              </div>
              <span className="font-mono text-[11px] font-semibold text-ink-muted text-right">
                {p.pct}%
              </span>
            </div>
          ))}
        </div>
        {pyramidAiTip && (
          <div
            className="mt-3.5 rounded-lg px-2.5 py-2.5 text-xs"
            style={{ background: "#FAF5FF", color: "#6B21A8" }}
          >
            <strong>AI:</strong> {pyramidAiTip}
          </div>
        )}
      </div>

      <div className="bg-card border border-line rounded-2xl p-4">
        <h3 className="m-0 mb-2.5 text-[13px] font-bold text-ink">Ukentlig timer</h3>
        <div className="font-mono text-[9px] text-ink-subtle tracking-[0.14em] mb-3.5 uppercase">
          Mål {WEEKLY_GOAL}t · siste {weekly.length} uker
        </div>
        <svg viewBox="0 0 300 140" style={{ width: "100%" }}>
          {(() => {
            const baseY = 120;
            const topY = 10;
            const range = baseY - topY;
            const goalY = baseY - (WEEKLY_GOAL / maxHours) * range;
            const colWidth = 290 / Math.max(1, weekly.length);
            const barWidth = Math.min(20, colWidth * 0.55);
            return (
              <>
                <line
                  x1="0"
                  y1={goalY}
                  x2="300"
                  y2={goalY}
                  stroke="#D1F843"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <text
                  x="295"
                  y={goalY - 4}
                  textAnchor="end"
                  fontSize="9"
                  fill="var(--color-ink-muted)"
                  fontFamily="JetBrains Mono, monospace"
                >
                  MÅL {WEEKLY_GOAL}t
                </text>
                {weekly.map((w, i) => {
                  const x = 10 + i * colWidth;
                  const h = (w.hours / maxHours) * range;
                  const y = baseY - h;
                  const isPeak = w.hours > 0 && w.hours === peakHours;
                  const aboveGoal = w.hours >= WEEKLY_GOAL;
                  const fill = isPeak
                    ? "#2A7D5A"
                    : aboveGoal
                      ? "#7FB88F"
                      : "#B8D9BF";
                  return (
                    <g key={w.week}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(2, h)}
                        fill={fill}
                        rx="2"
                      >
                        <title>{`${w.week}: ${w.hours.toFixed(1)}t`}</title>
                      </rect>
                      <text
                        x={x + barWidth / 2}
                        y="135"
                        textAnchor="middle"
                        fontSize="9"
                        fill="var(--color-ink-subtle)"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {w.week}
                      </text>
                    </g>
                  );
                })}
              </>
            );
          })()}
        </svg>
        <div className="text-xs text-ink-muted mt-1.5">
          Snitt:{" "}
          <strong className="text-ink">{weeklyAvg.toFixed(1)} t/uke</strong>
          {weeklyPeak ? <> · peak {weeklyPeak}</> : null}
          {weeklyQoq ? (
            <>
              {" "}
              ·{" "}
              <span style={{ color: weeklyQoq.startsWith("-") ? "#B84233" : "#2A7D5A" }}>
                {weeklyQoq}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="bg-card border border-line rounded-2xl p-4">
        <h3 className="m-0 mb-2.5 text-[13px] font-bold text-ink">Typefordeling 30d</h3>
        <div className="font-mono text-[9px] text-ink-subtle tracking-[0.14em] mb-3.5 uppercase">
          treningstyper
        </div>

        <svg viewBox="0 0 200 200" style={{ width: 160, margin: "0 auto", display: "block" }}>
          {(() => {
            const C = 440;
            let acc = 0;
            return typeDistribution.map((t) => {
              const len = (t.pct / 100) * C;
              const offset = -((acc / 100) * C);
              acc += t.pct;
              return (
                <circle
                  key={t.name}
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke={t.color}
                  strokeWidth="28"
                  strokeDasharray={`${len} ${C}`}
                  strokeDashoffset={offset}
                  transform="rotate(-90 100 100)"
                />
              );
            });
          })()}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fontSize="24"
            fontWeight="700"
            fill="var(--color-ink)"
          >
            {totalSessions}
          </text>
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-ink-muted)"
            fontFamily="JetBrains Mono, monospace"
          >
            ØKTER
          </text>
        </svg>

        <div className="grid grid-cols-2 gap-1 text-[11px] mt-2">
          {typeDistribution.map((t) => (
            <div key={t.name} className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-sm flex-shrink-0" style={{ background: t.color }} />
              <span className="text-ink-muted">
                {t.name} {t.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
