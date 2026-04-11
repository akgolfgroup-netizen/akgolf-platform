"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import { NumberTicker } from "./number-ticker";

interface PlayerProfileCompactCardProps {
  name: string | null;
  tier: string;
  handicap?: number | null;
  trend?: number | null;
  memberSince?: string | null;
  roundsCount?: number;
  index?: number;
}

function getInitials(name: string | null): string {
  if (!name) return "AK";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function tierLabel(tier: string): string {
  const map: Record<string, string> = {
    VISITOR: "Gratis",
    ACADEMY: "Academy",
    STARTER: "Starter",
    PRO: "Pro",
    ELITE: "Elite",
  };
  return map[tier.toUpperCase()] ?? tier;
}

export function PlayerProfileCompactCard({
  name,
  tier,
  handicap,
  trend,
  memberSince,
  roundsCount = 0,
  index = 0,
}: PlayerProfileCompactCardProps) {
  const initials = getInitials(name);
  const trendValue = trend ?? null;
  const trendIsImprovement = trendValue !== null && trendValue < 0;
  const trendIsDecline = trendValue !== null && trendValue > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: EASE_ENTRANCE,
      }}
      className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-card"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-base font-semibold text-accent-cta">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-black">
            {name ?? "Spiller"}
          </p>
          <span className="mt-1 inline-flex items-center rounded-full border border-accent-cta/40 bg-accent-cta/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {tierLabel(tier)}
          </span>
        </div>
      </div>

      {/* Inline stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            HCP
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            {handicap !== null && handicap !== undefined ? (
              <NumberTicker
                value={handicap}
                decimalPlaces={1}
                delay={0.3}
                className="text-2xl font-semibold text-black tabular-nums"
              />
            ) : (
              <span className="text-2xl font-semibold text-black">—</span>
            )}
            {trendValue !== null && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[10px] font-semibold",
                  trendIsImprovement && "text-success",
                  trendIsDecline && "text-error",
                  !trendIsImprovement && !trendIsDecline && "text-muted",
                )}
              >
                {trendIsImprovement ? (
                  <TrendingDown className="h-3 w-3" />
                ) : trendIsDecline ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {Math.abs(trendValue).toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Runder
          </p>
          <NumberTicker
            value={roundsCount}
            delay={0.4}
            className="mt-1 block text-2xl font-semibold text-black tabular-nums"
          />
        </div>
      </div>
    </motion.div>
  );
}
