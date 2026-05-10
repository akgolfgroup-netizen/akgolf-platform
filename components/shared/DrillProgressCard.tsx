import { cn } from "@/lib/utils";

interface DrillProgressCardProps {
  drillName: string;
  scores: Array<{ date: string; score: number }>;
  benchmarkScore?: number;
  currentScore: number;
  bestScore: number;
  totalAttempts: number;
  className?: string;
}

function Sparkline({
  scores,
  benchmarkScore,
}: {
  scores: Array<{ date: string; score: number }>;
  benchmarkScore?: number;
}) {
  if (scores.length < 2) return null;

  const width = 100;
  const height = 32;
  const padding = 2;

  const values = scores.map((s) => s.score);
  const allValues = benchmarkScore
    ? [...values, benchmarkScore]
    : values;
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x =
        padding + (i / (values.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const benchmarkY = benchmarkScore
    ? height -
      padding -
      ((benchmarkScore - min) / range) * (height - padding * 2)
    : null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className="flex-shrink-0"
    >
      {benchmarkY !== null && (
        <line
          x1={padding}
          y1={benchmarkY}
          x2={width - padding}
          y2={benchmarkY}
          stroke="#D1F843"
          strokeWidth={1}
          strokeDasharray="3 2"
        />
      )}
      <polyline
        points={points}
        stroke="#005840"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DrillProgressCard({
  drillName,
  scores,
  benchmarkScore,
  currentScore,
  bestScore,
  totalAttempts,
  className,
}: DrillProgressCardProps) {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E3DD",
        borderRadius: "20px",
        padding: "20px",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      {/* Header: name + sparkline */}
      <div className="flex items-center justify-between gap-3">
        <span
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#0A1F18",
          }}
        >
          {drillName}
        </span>
        <Sparkline scores={scores} benchmarkScore={benchmarkScore} />
      </div>

      {/* Current score */}
      <div className="flex items-baseline gap-3">
        <span
          style={{
            fontFamily:
              "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            fontSize: "24px",
            fontWeight: 500,
            color: "#0A1F18",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {currentScore}
        </span>

        {/* Best score with lime highlight */}
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
          style={{ backgroundColor: "rgba(209,248,67,0.25)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              color: "#5E5C57",
            }}
          >
            Beste:
          </span>
          <span
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              fontSize: "12px",
              fontWeight: 500,
              color: "#0A1F18",
            }}
          >
            {bestScore}
          </span>
        </span>
      </div>

      {/* Total attempts */}
      <span
        style={{
          fontFamily:
            "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          fontSize: "12px",
          color: "#9C9990",
        }}
      >
        {totalAttempts} forsok
      </span>
    </div>
  );
}
