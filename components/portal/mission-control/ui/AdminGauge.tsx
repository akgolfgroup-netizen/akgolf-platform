"use client";

import * as React from "react";

interface AdminGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  warningThreshold?: number;
  errorThreshold?: number;
  valueSuffix?: string;
}

export function AdminGauge({
  value,
  max = 100,
  size = 180,
  strokeWidth = 16,
  label,
  warningThreshold = 0.7,
  errorThreshold = 0.9,
  valueSuffix = "%",
}: AdminGaugeProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = max === 0 ? 0 : clamped / max;

  const color =
    percent >= errorThreshold
      ? "var(--color-error)"
      : percent >= warningThreshold
        ? "var(--color-warning)"
        : "var(--color-primary)";

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI;
  const endAngle = 0;
  const currentAngle = startAngle - percent * Math.PI;

  const arcPath = (angleStart: number, angleEnd: number) => {
    const x1 = cx + radius * Math.cos(angleStart);
    const y1 = cy - radius * Math.sin(angleStart);
    const x2 = cx + radius * Math.cos(angleEnd);
    const y2 = cy - radius * Math.sin(angleEnd);
    const largeArc = Math.abs(angleStart - angleEnd) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const displayValue =
    valueSuffix === "%" ? Math.round(percent * 100) : Math.round(clamped);

  const height = size / 2 + strokeWidth + 24;

  return (
    <div
      className="inline-flex flex-col items-center"
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? "Kapasitet"}
    >
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="var(--color-muted)"
          strokeOpacity={0.25}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {percent > 0 && (
          <path
            d={arcPath(startAngle, currentAngle)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: "all 400ms ease" }}
          />
        )}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          style={{
            fontSize: size * 0.22,
            fontWeight: 600,
            fill: "var(--color-text)",
          }}
        >
          {displayValue}
          <tspan style={{ fontSize: size * 0.12, fill: "var(--color-muted)" }}>
            {valueSuffix}
          </tspan>
        </text>
      </svg>
      {label && (
        <span className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          {label}
        </span>
      )}
    </div>
  );
}
