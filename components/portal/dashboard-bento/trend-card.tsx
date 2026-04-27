"use client";

interface TrendCardProps {
  current: number | null;
  trend: number | null;
  history: number[];
  yearLabel?: string;
}

function buildAreaPath(points: number[], width = 360, height = 130) {
  if (points.length === 0) return { line: "", area: "" };
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;
  const offsetX = 30;

  const line = points
    .map((p, i) => {
      const x = i * stepX + offsetX;
      const y = 30 + ((max - p) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastX = (points.length - 1) * stepX + offsetX;
  const lastY = 30 + ((max - points[points.length - 1]!) / range) * height;
  const firstX = offsetX;
  const area = `${line} L${lastX.toFixed(1)},${(30 + height + 20).toFixed(1)} L${firstX.toFixed(1)},${(30 + height + 20).toFixed(1)} Z`;

  return { line, area, lastX, lastY };
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
  const trendIsGood = trend !== null && trend < 0;

  return (
    <div
      className="col-span-12 lg:col-span-6 rounded-[22px] bg-white p-5"
      style={{
        boxShadow:
          "0 0 0 1px rgba(10, 31, 24, 0.05), 0 1px 2px rgba(10, 31, 24, 0.03), 0 6px 20px rgba(10, 31, 24, 0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ak-g-400,#7A8C85)]">
            Handicap · {yearLabel}
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-[-0.02em]">
            {current !== null ? current.toFixed(1) : "—"}{" "}
            <span className="text-[13px] font-medium text-[var(--ak-g-400,#7A8C85)]">
              aktiv
            </span>
          </h3>
        </div>
        {trend !== null ? (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: trendIsGood
                ? "var(--ak-success-soft, #E8F5EF)"
                : "var(--ak-warning-soft, #FDF4E4)",
              color: trendIsGood
                ? "var(--ak-success, #2A7D5A)"
                : "var(--ak-warning, #C48A32)",
            }}
          >
            {trendArrow} {Math.abs(trend).toFixed(1)} i år
          </span>
        ) : null}
      </div>

      {hasHistory ? (
        <svg viewBox="0 0 400 180" className="mt-2.5 block w-full">
          <defs>
            <linearGradient id="bento-gT" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#D1F843" stopOpacity="0.5" />
              <stop offset="1" stopColor="#D1F843" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="#ECF0EF" strokeWidth="1">
            <line x1="0" y1="30" x2="400" y2="30" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="130" x2="400" y2="130" />
          </g>
          <path d={line} fill="none" stroke="#0A1F18" strokeWidth="2.5" />
          <path d={area} fill="url(#bento-gT)" />
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
        <div className="mt-4 rounded-lg bg-[var(--ak-g-50,#F5F8F7)] p-4 text-sm text-[var(--ak-g-500,#5A6E66)]">
          Vi trenger flere handicap-registreringer for å vise utvikling.
        </div>
      )}
    </div>
  );
}
