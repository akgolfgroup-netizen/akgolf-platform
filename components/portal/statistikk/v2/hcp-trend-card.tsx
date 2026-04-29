"use client";

interface HcpTrendCardProps {
  current: number | null;
  trendPerWeek: number;
  history: number[];
  forecast30d: number | null;
  forecast90d: number | null;
}

function buildAreaPath(points: number[], width = 360, height = 130) {
  if (points.length === 0) return { line: "", area: "", lastX: 0, lastY: 0 };
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;
  const offsetX = 30;

  const line = points
    .map((p, i) => {
      const x = i * stepX + offsetX;
      // Reversert: lavere HCP = høyere på y-aksen
      const y = 30 + ((p - min) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastIdx = points.length - 1;
  const lastX = lastIdx * stepX + offsetX;
  const lastY = 30 + ((points[lastIdx]! - min) / range) * height;
  const firstX = offsetX;
  const area = `${line} L${lastX.toFixed(1)},${(30 + height + 20).toFixed(1)} L${firstX.toFixed(1)},${(30 + height + 20).toFixed(1)} Z`;

  return { line, area, lastX, lastY };
}

/**
 * Handicap-trendkort fra dashboard-bento-mønster.
 * Brand Guide V2.0 hvitt kort med lime accent-prikk på siste punkt.
 */
export function HcpTrendCard({
  current,
  trendPerWeek,
  history,
  forecast30d,
  forecast90d,
}: HcpTrendCardProps) {
  const hasHistory = history.length >= 2;
  const { line, area, lastX, lastY } = hasHistory
    ? buildAreaPath(history)
    : { line: "", area: "", lastX: 0, lastY: 0 };

  const trendIsGood = trendPerWeek < 0;
  const trendArrow = trendPerWeek < 0 ? "▼" : trendPerWeek > 0 ? "▲" : "—";

  return (
    <section
      className="col-span-12 lg:col-span-5 rounded-2xl border bg-card p-6"
      style={{
        borderColor: "var(--color-line, #E4EAE6)",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
          >
            Handicap · 6 mnd
          </div>
          <h3
            className="mt-1.5 font-inter-tight text-[22px] font-bold tracking-[-0.025em]"
            style={{ color: "var(--color-ink, #0A1F18)" }}
          >
            {current !== null ? current.toFixed(1) : "—"}
            <span
              className="ml-2 text-[14px] font-medium"
              style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
            >
              aktiv
            </span>
          </h3>
        </div>
        {hasHistory ? (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: trendIsGood
                ? "rgba(42, 125, 90, 0.12)"
                : "rgba(196, 138, 50, 0.14)",
              color: trendIsGood
                ? "var(--color-success, #2A7D5A)"
                : "var(--color-warning, #C48A32)",
            }}
          >
            <span aria-hidden="true">{trendArrow}</span>{" "}
            {Math.abs(trendPerWeek).toFixed(2)}/uke
          </span>
        ) : null}
      </div>

      {hasHistory ? (
        <svg viewBox="0 0 400 180" className="mt-3 block w-full">
          <defs>
            <linearGradient id="hcp-trend-gT" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#D1F843" stopOpacity="0.5" />
              <stop offset="1" stopColor="#D1F843" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="#ECF0EF" strokeWidth="1">
            <line x1="0" y1="30" x2="400" y2="30" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="130" x2="400" y2="130" />
          </g>
          <path d={area} fill="url(#hcp-trend-gT)" />
          <path d={line} fill="none" stroke="#0A1F18" strokeWidth="2.5" />
          <circle
            cx={lastX}
            cy={lastY}
            r={5}
            fill="#D1F843"
            stroke="#0A1F18"
            strokeWidth={2}
          />
        </svg>
      ) : (
        <div
          className="mt-3 rounded-lg p-4 text-sm"
          style={{
            background: "var(--color-surface-soft, #EDF1EE)",
            color: "var(--color-ink-muted, #5C6B62)",
          }}
        >
          Vi trenger flere handicap-registreringer for å vise utvikling.
        </div>
      )}

      {forecast30d !== null || forecast90d !== null ? (
        <div
          className="mt-3 grid grid-cols-2 gap-2 border-t pt-3"
          style={{ borderColor: "var(--color-line-soft, #EDF1EE)" }}
        >
          <ForecastCell
            label="Prognose 30d"
            value={forecast30d}
          />
          <ForecastCell
            label="Prognose 90d"
            value={forecast90d}
          />
        </div>
      ) : null}
    </section>
  );
}

function ForecastCell({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div>
      <div
        className="font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
        style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
      >
        {label}
      </div>
      <div
        className="mt-0.5 text-base font-bold tabular-nums tracking-[-0.02em]"
        style={{
          color: "var(--color-ink, #0A1F18)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value !== null ? value.toFixed(1) : "—"}
      </div>
    </div>
  );
}
