"use client";

import { motion } from "framer-motion";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

interface CapacityGaugeProps {
  bookedHours: number;
  totalHours: number;
  label?: string;
}

export function CapacityGauge({
  bookedHours,
  totalHours,
  label = "Kapasitet",
}: CapacityGaugeProps) {
  const percentage = totalHours > 0 ? (bookedHours / totalHours) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);

  // Fargekode basert på belegg
  const getColor = () => {
    if (percentage > 95) return "var(--color-error)";
    if (percentage >= 80) return "var(--color-warning)";
    return "var(--color-success)";
  };

  const color = getColor();

  // SVG gauge parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-grey-200)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: EASE_ENTRANCE }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <p className="mt-2 text-xs font-medium text-[var(--color-grey-500)] uppercase tracking-wide">
        {label}
      </p>

      {/* Hours display */}
      <p className="text-sm text-[var(--color-grey-900)] font-medium mt-1">
        {bookedHours.toFixed(1)}t / {totalHours.toFixed(1)}t
      </p>
    </div>
  );
}
