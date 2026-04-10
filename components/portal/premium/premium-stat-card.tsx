"use client";

import * as React from "react";
import { motion, useSpring, useTransform, animate, useMotionValue } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

/**
 * PremiumStatCard — dashboard stat-kort med:
 * - Spotlight som følger muspekeren (radial gradient)
 * - Animert tall-counter (Framer Motion spring)
 * - Trend-indikator (opp/ned/flat) med brand-farger
 * - Glassmorphism og AK Golf-tokens
 *
 * Brukes på dashboard, statistikk, profil og sammenligning.
 */
interface PremiumStatCardProps {
  /** Label over tallet (f.eks. "Handicap", "Runder denne måneden") */
  label: string;
  /** Hovedverdien — kan være tall (animeres) eller streng (vises direkte) */
  value: number | string;
  /** Enhet etter tallet (f.eks. "%", "min", "runder") */
  unit?: string;
  /** Trend-endring i prosent eller antall — positiv = grønn, negativ = rød */
  trend?: number | null;
  /** Tekst for trend-kontekst (f.eks. "siste 30 dager") */
  trendLabel?: string;
  /** Omvendt trend-tolking: lavere er bedre (brukes for handicap, score, putts) */
  lowerIsBetter?: boolean;
  /** Ikon fra Lucide */
  icon?: LucideIcon;
  /** Desimaler å vise ved tall-animasjon */
  decimals?: number;
  /** Custom className */
  className?: string;
  /** Deaktiver spotlight (for ytelse på mange kort) */
  disableSpotlight?: boolean;
}

export function PremiumStatCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  lowerIsBetter = false,
  icon: Icon,
  decimals = 0,
  className,
  disableSpotlight = false,
}: PremiumStatCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = React.useState(false);

  // Animert tall-counter
  const isNumeric = typeof value === "number";
  const motionValue = useSpring(0, { damping: 40, stiffness: 80 });
  const display = useTransform(motionValue, (latest) =>
    decimals > 0
      ? latest.toFixed(decimals).replace(".", ",")
      : Math.round(latest).toLocaleString("nb-NO")
  );

  React.useEffect(() => {
    if (!isNumeric) return;
    const controls = animate(motionValue, value as number, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, motionValue, isNumeric]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || disableSpotlight) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  // Trend-beregning — lavere er bedre for handicap/score/putts
  const trendPositive = trend !== null && trend !== undefined
    ? lowerIsBetter ? trend < 0 : trend > 0
    : null;
  const trendFlat = trend === 0;
  const TrendIcon = trendFlat ? Minus : trendPositive ? TrendingUp : TrendingDown;
  const trendColor = trendFlat
    ? "var(--color-muted)"
    : trendPositive
      ? "var(--color-success)"
      : "var(--color-error)";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-[24px] bg-white p-6 border border-black/5 transition-all duration-300",
        "hover:border-[var(--color-primary)]/20 hover:shadow-[0_8px_32px_-12px_rgba(0,88,64,0.12)]",
        "hover:-translate-y-0.5 will-change-transform",
        className
      )}
    >
      {/* Spotlight — radial gradient som følger musen */}
      {!disableSpotlight && (
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 88, 64, 0.08), transparent 60%)`
            ),
          }}
        />
      )}

      {/* Gradient border on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(135deg, rgba(209, 248, 67, 0.0) 0%, rgba(0, 88, 64, 0.15) 50%, rgba(209, 248, 67, 0.0) 100%)",
          maskImage:
            "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Header: icon + label */}
      <div className="relative flex items-start justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          {label}
        </p>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
            <Icon className="h-[18px] w-[18px] text-[var(--color-primary)]" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative flex items-baseline gap-1.5 mb-3">
        {isNumeric ? (
          <motion.span className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
            {display}
          </motion.span>
        ) : (
          <span className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
            {value}
          </span>
        )}
        {unit && (
          <span className="text-lg font-semibold text-[var(--color-muted)]">
            {unit}
          </span>
        )}
      </div>

      {/* Trend footer */}
      {trend !== null && trend !== undefined && (
        <div className="relative flex items-center gap-1.5 text-xs">
          <div
            className="flex items-center justify-center rounded-full p-1"
            style={{ backgroundColor: `color-mix(in srgb, ${trendColor} 15%, transparent)` }}
          >
            <TrendIcon className="h-3 w-3" style={{ color: trendColor }} />
          </div>
          <span className="font-semibold" style={{ color: trendColor }}>
            {trend > 0 ? "+" : ""}
            {typeof trend === "number" ? trend.toFixed(decimals > 0 ? 1 : 0).replace(".", ",") : trend}
          </span>
          {trendLabel && (
            <span className="text-[var(--color-muted)]">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
