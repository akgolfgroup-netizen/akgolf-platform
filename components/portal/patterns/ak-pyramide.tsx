"use client";

/**
 * AKPyramide — Pattern P-04 (v3.1)
 *
 * Horisontal 5-lags bar som viser AK-pyramiden:
 * FYS (fysisk), TEK (teknisk), SLAG (slag), SPILL (spill), TURN (turnering).
 *
 * Persistent i treningsplanlegger-sidemeny. Klikkbar for filtrering av øvelser.
 * Også brukt i dagbok for volum-fordeling (read-only).
 *
 * Kilde: /tmp/ak-golf-design/screens/plan.html linje med "pyr-card"
 */

import { cn } from "@/lib/utils";
import { MonoLabel } from "./mono-label";

export type PyramideLevel = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

interface PyramideData {
  level: PyramideLevel;
  percent: number; // 0-100
  value: string; // e.g. "3h" or "1.5h"
}

interface AKPyramideProps {
  data: PyramideData[];
  active?: PyramideLevel | null;
  onChange?: (level: PyramideLevel | null) => void;
  title?: string;
  subtitle?: string;
  className?: string;
  readOnly?: boolean;
}

const LEVEL_COLORS: Record<PyramideLevel, string> = {
  FYS: "var(--color-data-sage)",
  TEK: "var(--color-data-blue)",
  SLAG: "var(--color-data-amber)",
  SPILL: "var(--color-data-violet)",
  TURN: "var(--color-data-coral)",
};

const LEVEL_LABELS: Record<PyramideLevel, string> = {
  FYS: "FYS",
  TEK: "TEK",
  SLAG: "SLAG",
  SPILL: "SPILL",
  TURN: "TURN",
};

export function AKPyramide({
  data,
  active = null,
  onChange,
  title = "AK-Pyramiden",
  subtitle,
  className,
  readOnly = false,
}: AKPyramideProps) {
  const handleClick = (level: PyramideLevel) => {
    if (readOnly || !onChange) return;
    onChange(active === level ? null : level);
  };

  return (
    <div className={cn("rounded-xl bg-white p-5 shadow-card", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <MonoLabel size="xs" uppercase className="text-primary block">
              ◆ {title}
            </MonoLabel>
          )}
          {subtitle && (
            <div className="text-xs text-grey-500 mt-1">{subtitle}</div>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {data.map((item) => {
          const isActive = active === item.level;
          const isFaded = active !== null && !isActive;
          return (
            <button
              key={item.level}
              type="button"
              disabled={readOnly}
              onClick={() => handleClick(item.level)}
              className={cn(
                "w-full flex items-center gap-3 text-left rounded-lg px-1 py-1 -mx-1 transition-all",
                !readOnly && "hover:bg-grey-50 cursor-pointer",
                readOnly && "cursor-default",
                isFaded && "opacity-40"
              )}
              aria-pressed={isActive}
            >
              <span
                className={cn(
                  "text-[11px] font-bold tracking-[0.1em] w-11 shrink-0",
                  isActive ? "text-primary" : "text-grey-700"
                )}
              >
                {LEVEL_LABELS[item.level]}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-grey-100 overflow-hidden relative">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isActive && "shadow-[0_0_12px_currentColor]"
                  )}
                  style={{
                    width: `${item.percent}%`,
                    background: LEVEL_COLORS[item.level],
                    color: LEVEL_COLORS[item.level],
                  }}
                />
              </div>
              <MonoLabel
                size="xs"
                className={cn(
                  "w-12 text-right shrink-0",
                  isActive ? "text-primary font-semibold" : "text-grey-500"
                )}
              >
                {item.value}
              </MonoLabel>
            </button>
          );
        })}
      </div>

      {!readOnly && onChange && (
        <div className="mt-4 pt-3 border-t border-grey-100 text-[11px] text-grey-500 leading-[1.5]">
          Klikk et niva for a filtrere biblioteket.
        </div>
      )}
    </div>
  );
}
