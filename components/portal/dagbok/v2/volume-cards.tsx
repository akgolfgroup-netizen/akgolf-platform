"use client";

interface VolumeCardsProps {
  pyramid: { name: string; pct: number; color: string }[];
  weekly: { week: string; hours: number }[];
  weeklyAvg: number;
  typeDistribution: { name: string; pct: number; color: string }[];
  totalSessions: number;
}

export function VolumeCards({
  pyramid,
  weekly,
  weeklyAvg,
  typeDistribution,
  totalSessions,
}: VolumeCardsProps) {
  const maxHours = Math.max(10, ...weekly.map((w) => w.hours));

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
      </div>

      <div className="bg-card border border-line rounded-2xl p-4">
        <h3 className="m-0 mb-2.5 text-[13px] font-bold text-ink">Ukentlig timer</h3>
        <div className="font-mono text-[9px] text-ink-subtle tracking-[0.14em] mb-3.5 uppercase">
          Mål 10t · siste {weekly.length} uker
        </div>
        <div className="flex items-end gap-1.5 h-28">
          {weekly.map((w) => {
            const h = Math.max(8, (w.hours / maxHours) * 100);
            const above = w.hours >= 10;
            return (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <div
                  title={`${w.week}: ${w.hours.toFixed(1)}t`}
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: above ? "var(--color-success)" : "var(--color-data-sage-light)",
                  }}
                />
                <div className="font-mono text-[9px] text-ink-subtle">{w.week}</div>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-ink-muted mt-2.5">
          Snitt:{" "}
          <strong className="text-ink">{weeklyAvg.toFixed(1)} t/uke</strong>
        </div>
      </div>

      <div className="bg-card border border-line rounded-2xl p-4">
        <h3 className="m-0 mb-2.5 text-[13px] font-bold text-ink">Typefordeling 30d</h3>
        <div className="font-mono text-[9px] text-ink-subtle tracking-[0.14em] mb-3.5 uppercase">
          treningstyper
        </div>

        <div className="text-center my-2">
          <div className="text-[28px] font-bold tracking-tight text-ink">
            {totalSessions}
          </div>
          <div className="font-mono text-[10px] text-ink-muted tracking-wider uppercase">
            økter
          </div>
        </div>

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
