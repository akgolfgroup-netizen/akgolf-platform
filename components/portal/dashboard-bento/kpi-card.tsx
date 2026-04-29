// Server Component — KPI-kort med statisk SVG-sparkline, ingen interaktivitet.

export interface KpiChange {
  text: string;
  direction: "up" | "down" | "flat";
  isGood?: boolean;
}

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  change?: KpiChange;
  contextLabel?: string;
  sparkline?: { points: number[]; type?: "line" | "bars" };
  accent?: boolean;
}

function buildKpiLinePath(points: number[], width = 160, height = 40) {
  if (points.length === 0) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;
  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const ARROW_META = {
  up: { glyph: "▲", label: "opp" },
  down: { glyph: "▼", label: "ned" },
  flat: { glyph: "—", label: "uendret" },
} as const;

export function KpiCard({
  label,
  value,
  unit,
  change,
  contextLabel,
  sparkline,
  accent,
}: KpiCardProps) {
  const arrowMeta = change ? ARROW_META[change.direction] : null;

  const changeColor =
    change?.isGood === true
      ? "var(--color-success)"
      : change?.isGood === false
        ? "var(--color-error)"
        : "var(--color-ink-muted)";

  return (
    <div
      className={`col-span-6 lg:col-span-3 flex min-h-[140px] flex-col gap-2.5 rounded-2xl p-[18px] ${
        accent
          ? "bg-accent"
          : "bg-card"
      }`}
      style={{
        boxShadow: accent
          ? "none"
          : "var(--shadow-card)",
      }}
    >
      <div className={`text-[10px] font-bold uppercase tracking-[0.16em] ${accent ? "text-ink/60" : "text-ink-subtle"}`}>
        {label}
      </div>
      <div className="text-[36px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {value}
        {unit ? (
          <span className={`ml-1 text-[13px] font-medium ${accent ? "text-ink/60" : "text-ink-subtle"}`}>
            {unit}
          </span>
        ) : null}
      </div>
      {change ? (
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          <span
            className="rounded px-1.5 py-0.5 font-semibold"
            style={
              accent
                ? { background: "rgba(10, 31, 24, 0.1)", color: "var(--color-ink)" }
                : { color: changeColor }
            }
          >
            {arrowMeta ? <span aria-label={arrowMeta.label}>{arrowMeta.glyph} </span> : null}
            {change.text}
          </span>
          {contextLabel ? (
            <span className={accent ? "text-ink/60" : "text-ink-subtle"}>{contextLabel}</span>
          ) : null}
        </div>
      ) : null}
      {sparkline && sparkline.points.length > 0 ? (
        <div className="mt-auto">
          <svg viewBox="0 0 160 40" preserveAspectRatio="none" className="block h-10 w-full">
            {sparkline.type === "bars" ? (
              <g fill={accent ? "var(--color-ink)" : "var(--color-data-coral)"}>
                {sparkline.points.map((p, i) => {
                  const max = Math.max(...sparkline.points) || 1;
                  const h = Math.max(4, (p / max) * 32);
                  const w = 160 / sparkline.points.length - 2;
                  return (
                    <rect
                      key={i}
                      x={i * (160 / sparkline.points.length) + 1}
                      y={40 - h}
                      width={w}
                      height={h}
                      rx={2}
                    />
                  );
                })}
              </g>
            ) : (
              <path
                d={buildKpiLinePath(sparkline.points)}
                fill="none"
                stroke={accent ? "var(--color-ink)" : "var(--color-primary)"}
                strokeWidth={accent ? 2.5 : 2}
              />
            )}
          </svg>
        </div>
      ) : null}
    </div>
  );
}
