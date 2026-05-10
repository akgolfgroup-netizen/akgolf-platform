"use client";

import { cn } from "@/lib/utils";

interface PercentilDialProps {
  value: number;
  label?: string;
  size?: number;
  className?: string;
}

export function PercentilDial({
  value,
  label,
  size = 120,
  className,
}: PercentilDialProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Half-circle: arc from 180deg (left) to 0deg (right), open at bottom
  const startAngle = 180;
  const endAngle = 0;
  const totalSweep = 180;
  const fillSweep = (clampedValue / 100) * totalSweep;

  const polarToXY = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  };

  const start = polarToXY(startAngle);
  const end = polarToXY(endAngle);
  const fillEnd = polarToXY(startAngle - fillSweep);

  // Background track arc (full 180)
  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;

  // Fill arc
  const largeArc = fillSweep > 180 ? 1 : 0;
  const fillPath =
    clampedValue > 0
      ? `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`
      : "";

  const gradientId = `percentil-gradient-${size}-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={cn("inline-flex flex-col items-center", className)}
      style={{ width: size }}
    >
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        fill="none"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
          >
            <stop offset="0%" stopColor="#005840" />
            <stop offset="100%" stopColor="#D1F843" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d={trackPath}
          stroke="#EFEDE6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* Fill arc */}
        {fillPath && (
          <path
            d={fillPath}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Value text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="auto"
          style={{
            fontFamily:
              "var(--font-jetbrains-mono), JetBrains Mono, monospace",
            fontSize: size * 0.27,
            fontWeight: 700,
            fill: "#0A1F18",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(clampedValue)}
          <tspan
            style={{
              fontSize: size * 0.13,
              fontWeight: 500,
            }}
          >
            %
          </tspan>
        </text>
      </svg>

      {label && (
        <span
          className="mt-1 text-center"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#9C9990",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
