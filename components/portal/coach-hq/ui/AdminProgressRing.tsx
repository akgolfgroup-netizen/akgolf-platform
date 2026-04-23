"use client";

import * as React from "react";

interface AdminProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showValue?: boolean;
  valueSuffix?: string;
}

export function AdminProgressRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  color = "var(--color-primary)",
  trackColor = "var(--color-muted)",
  label,
  showValue = true,
  valueSuffix = "%",
}: AdminProgressRingProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = max === 0 ? 0 : clamped / max;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);
  const displayValue =
    valueSuffix === "%" ? Math.round(percent * 100) : Math.round(clamped);

  return (
    <div
      className="inline-flex flex-col items-center justify-center gap-2"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? "Progresjon"}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeOpacity={0.25}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 400ms ease" }}
          />
        </svg>
        {showValue && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontSize: Math.max(14, size * 0.22),
              fontWeight: 600,
              color: "var(--color-text)",
            }}
          >
            {displayValue}
            <span style={{ fontSize: Math.max(10, size * 0.13), color: "var(--color-muted)" }}>
              {valueSuffix}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {label}
        </span>
      )}
    </div>
  );
}
