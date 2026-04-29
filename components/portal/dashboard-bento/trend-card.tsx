// Server Component — handicap-trend SVG, statisk rendering.
import { buildAreaPath } from "@/components/portal/charts/svg-path-utils";

interface TrendCardProps {
  current: number | null;
  trend: number | null;
  history: number[];
  yearLabel?: string;
}

export function TrendCard({
  current,
  trend,
  history,
  yearLabel = "12 mnd",
}: TrendCardProps) {
  const hasHistory = history.length >= 2;
  const { line, area, lastX, lastY } = hasHistory
    ? buildAreaPath(history)
    : { line: "", area: "", lastX: 0, lastY: 0 };

  const trendArrow = trend !== null ? (trend < 0 ? "▼" : "▲") : "—";
  const trendArrowLabel = trend !== null ? (trend < 0 ? "ned" : "opp") : "uendret";
  const trendIsGood = trend !== null && trend < 0;

  return (
    <div
      className="col-span-12 md:col-span-6 rounded-2xl bg-card p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
            Handicap · {yearLabel}
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-ink">
            {current !== null ? current.toFixed(1) : "—"}{" "}
            <span className="text-[13px] font-medium text-ink-subtle">
              aktiv
            </span>
          </h3>
        </div>
        {trend !== null ? (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: trendIsGood ? "var(--color-success-light)" : "var(--color-warning-light)",
              color: trendIsGood ? "var(--color-success)" : "var(--color-warning)",
            }}
          >
            <span aria-label={trendArrowLabel}>{trendArrow}</span>{" "}
            {Math.abs(trend).toFixed(1)} i år
          </span>
        ) : null}
      </div>

      {hasHistory ? (
        <svg viewBox="0 0 400 180" className="mt-2.5 block w-full">
          <defs>
            <linearGradient id="bento-gT" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.5" />
              <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="var(--color-line-soft)" strokeWidth="1">
            <line x1="0" y1="30" x2="400" y2="30" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="130" x2="400" y2="130" />
          </g>
          <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" />
          <path d={area} fill="url(#bento-gT)" />
          <circle
            cx={lastX}
            cy={lastY}
            r={5}
            fill="var(--color-accent)"
            stroke="var(--color-ink)"
            strokeWidth={2}
          />
        </svg>
      ) : (
        <div className="mt-4 rounded-lg bg-surface-soft p-4 text-sm text-ink-muted">
          Vi trenger flere handicap-registreringer for å vise utvikling.
        </div>
      )}
    </div>
  );
}
