"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

/**
 * AKActivityRings — Apple Watch-stil aktivitetsringer med AK Golf-farger.
 *
 * Tre konsentriske ringer:
 * - Trening (primary grønn) — ytre ring
 * - Coaching (accent lime) — midterste ring
 * - Spill/runder (success) — indre ring
 *
 * Bruk på dashboard, profil, eller treningsdagbok.
 */
interface ActivityRingData {
  label: string;
  /** Progress 0-100 */
  progress: number;
  /** Nåverdi (f.eks. 24) */
  current: number;
  /** Mål (f.eks. 30) */
  target: number;
  /** Enhet (f.eks. "økter", "min", "runder") */
  unit: string;
}

interface AKActivityRingsProps {
  training: ActivityRingData;
  coaching: ActivityRingData;
  rounds: ActivityRingData;
  /** Totalt størrelse i px (default 200) */
  size?: number;
  /** Vis detaljert info til høyre */
  showDetails?: boolean;
  /** Vertikal layout (ringer over info) */
  vertical?: boolean;
  className?: string;
}

// AK Golf brand-farger for ringene
const RING_COLORS = {
  training: {
    start: "#005840", // Primary
    end: "#00594C",
    hex: "#005840",
  },
  coaching: {
    start: "#D1F843", // Accent
    end: "#B8DD3C",
    hex: "#B8DD3C",
  },
  rounds: {
    start: "#2A7D5A", // Success
    end: "#4AA179",
    hex: "#2A7D5A",
  },
};

interface RingProps {
  data: ActivityRingData;
  ringSize: number;
  strokeWidth: number;
  colorKey: "training" | "coaching" | "rounds";
  delay: number;
}

function Ring({ data, ringSize, strokeWidth, colorKey, delay }: RingProps) {
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(data.progress, 0), 100);
  const offset = ((100 - clampedProgress) / 100) * circumference;
  const colors = RING_COLORS[colorKey];
  const gradientId = `ring-gradient-${colorKey}`;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        className="-rotate-90"
        role="img"
        aria-label={`${data.label}: ${clampedProgress.toFixed(0)} prosent`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.start, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.end, stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke={colors.hex}
          strokeOpacity={0.12}
          strokeWidth={strokeWidth}
        />

        {/* Animated progress ring */}
        <motion.circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.6,
            delay: delay + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${colors.hex}40)` }}
        />
      </svg>
    </motion.div>
  );
}

interface DetailRowProps {
  data: ActivityRingData;
  colorKey: "training" | "coaching" | "rounds";
  delay: number;
}

function DetailRow({ data, colorKey, delay }: DetailRowProps) {
  const color = RING_COLORS[colorKey].hex;
  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay + 0.4 }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        {data.label}
      </span>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-2xl font-bold tracking-tight" style={{ color }}>
          {data.current}
        </span>
        <span className="text-sm text-[var(--color-muted)]">
          / {data.target} {data.unit}
        </span>
      </div>
    </motion.div>
  );
}

export function AKActivityRings({
  training,
  coaching,
  rounds,
  size = 200,
  showDetails = true,
  vertical = false,
  className,
}: AKActivityRingsProps) {
  // Beregn ring-størrelser: ytre (trening), midt (coaching), indre (spill)
  const outerSize = size;
  const midSize = size - 40;
  const innerSize = size - 80;
  const strokeWidth = 14;

  return (
    <div
      className={cn(
        "flex gap-6",
        vertical ? "flex-col items-center" : "items-center",
        className
      )}
    >
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Ring
          data={training}
          ringSize={outerSize}
          strokeWidth={strokeWidth}
          colorKey="training"
          delay={0}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: 20 }}
        >
          <Ring
            data={coaching}
            ringSize={midSize}
            strokeWidth={strokeWidth}
            colorKey="coaching"
            delay={0.15}
          />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: 40 }}
        >
          <Ring
            data={rounds}
            ringSize={innerSize}
            strokeWidth={strokeWidth}
            colorKey="rounds"
            delay={0.3}
          />
        </div>
      </div>

      {showDetails && (
        <div className={cn("flex flex-col gap-4", vertical && "items-center")}>
          <DetailRow data={training} colorKey="training" delay={0} />
          <DetailRow data={coaching} colorKey="coaching" delay={0.1} />
          <DetailRow data={rounds} colorKey="rounds" delay={0.2} />
        </div>
      )}
    </div>
  );
}
