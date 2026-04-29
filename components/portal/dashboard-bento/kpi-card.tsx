// Server Component — KPI-kort med statisk SVG-sparkline, ingen interaktivitet.

export interface KpiChange {
  text: string;
  direction: "up" | "down" | "flat";
  /** true = framgang (gront tekst), false = tilbakegang (rod), undefined = noytral */
  isGood?: boolean;
}

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  /**
   * Endring sammenlignet med forrige periode. Grupper alle endringsfelt-prop
   * i ett objekt for a unnga "parameter sprawl" og holde KpiCard-API lett.
   */
  change?: KpiChange;
  contextLabel?: string;
  sparkline?: { points: number[]; type?: "line" | "bars" };
  accent?: boolean;
}

// Sparkline-bygger spesialisert for KPI: y-padding 3px topp/bunn for at
// linjen ikke skal klippes mot kantene. Ulik nok fra svg-path-utils til at
// lokal definisjon er enklere enn config.
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
      ? "var(--ak-success, #2A7D5A)"
      : change?.isGood === false
        ? "var(--ak-error, #B84233)"
        : "var(--ak-g-500, #5A6E66)";

  const cardBg = accent
    ? { background: "linear-gradient(160deg, #D1F843, #c4e83a)" }
    : { background: "#fff" };

  const labelColor = accent
    ? "rgba(10, 31, 24, 0.6)"
    : "var(--ak-g-400, #7A8C85)";

  const valueColor = "var(--ak-g-900, #0A1F18)";

  const muted = accent ? "rgba(10, 31, 24, 0.6)" : "var(--ak-g-400, #7A8C85)";

  return (
    <div
      className="col-span-6 lg:col-span-3 flex min-h-[140px] flex-col gap-2.5 rounded-[18px] p-[18px]"
      style={{
        ...cardBg,
        boxShadow: accent
          ? "none"
          : "0 0 0 1px rgba(10, 31, 24, 0.05), 0 1px 2px rgba(10, 31, 24, 0.03), 0 6px 20px rgba(10, 31, 24, 0.05)",
      }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: labelColor }}
      >
        {label}
      </div>
      <div
        className="text-[36px] font-semibold leading-none tracking-[-0.03em] tabular-nums"
        style={{ color: valueColor, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
        {unit ? (
          <span
            className="ml-1 text-[13px] font-medium"
            style={{ color: muted }}
          >
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
                ? {
                    background: "rgba(10, 31, 24, 0.1)",
                    color: "var(--ak-g-900, #0A1F18)",
                  }
                : { color: changeColor }
            }
          >
            {arrowMeta ? (
              <span aria-label={arrowMeta.label}>{arrowMeta.glyph} </span>
            ) : null}
            {change.text}
          </span>
          {contextLabel ? (
            <span style={{ color: muted }}>{contextLabel}</span>
          ) : null}
        </div>
      ) : null}
      {sparkline && sparkline.points.length > 0 ? (
        <div className="mt-auto">
          <svg
            viewBox="0 0 160 40"
            preserveAspectRatio="none"
            className="block h-10 w-full"
          >
            {sparkline.type === "bars" ? (
              <g fill={accent ? "#0A1F18" : "var(--ak-data-coral, #E85D4E)"}>
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
                stroke={accent ? "#0A1F18" : "var(--ak-primary, #005840)"}
                strokeWidth={accent ? 2.5 : 2}
              />
            )}
          </svg>
        </div>
      ) : null}
    </div>
  );
}
