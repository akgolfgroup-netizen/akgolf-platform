"use client";

import type { RoiRow } from "../actions";

interface RoiCardProps {
  rows: RoiRow[];
}

export function RoiCard({ rows }: RoiCardProps) {
  if (rows.length === 0) {
    return (
      <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          Hvor kommer slagene fra?
        </span>
        <p className="mt-3 text-sm text-portal-muted">
          Ikke nok treningslogger til å regne ROI enda. Registrer økter for å se.
        </p>
      </div>
    );
  }

  const maxPerHour = Math.max(...rows.map((r) => r.sgPerHour), 0.001);
  const best = rows[0];
  const onCourse = rows.find((r) => r.label === "Banegolf 18 hull");
  const ratio =
    best && onCourse && onCourse.sgPerHour > 0
      ? Math.round(best.sgPerHour / onCourse.sgPerHour)
      : null;

  return (
    <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        Hvor kommer slagene fra? · Siste 90 dager
      </span>

      <div className="mt-4">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-2 items-center text-xs">
          <div className="text-portal-muted">Aktivitet</div>
          <div className="text-portal-muted text-right">Timer</div>
          <div className="text-portal-muted text-right">SG-delta</div>
          <div className="text-portal-muted text-right">SG/time</div>

          {rows.map((r) => {
            const fillPct = Math.min(100, (r.sgPerHour / maxPerHour) * 100);
            return (
              <div key={r.label} className="contents">
                <div className="text-portal-text">
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="mt-1 h-[3px] rounded-full bg-portal-hover overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right text-sm tabular-nums text-portal-secondary">
                  {r.hours}
                </div>
                <div className="text-right text-sm tabular-nums text-portal-secondary">
                  {r.sgDelta > 0 ? "+" : ""}
                  {r.sgDelta.toFixed(2)}
                </div>
                <div className="text-right text-sm tabular-nums font-semibold text-portal-text">
                  {r.sgPerHour.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {ratio !== null && ratio >= 2 && (
        <div className="mt-4 rounded-lg bg-performance-soft px-3 py-2.5 text-xs leading-relaxed text-primary">
          1 time målrettet ferdighet gir ~{ratio}x mer utvikling enn 1 time
          banegolf. Evidens fra din egen trening.
        </div>
      )}
    </div>
  );
}
