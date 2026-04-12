"use client";

import { AlertTriangle } from "lucide-react";
import { PremiumCard } from "./premium-card";

export interface SGFocusData {
  area: string;
  sgLoss: number;
  sgImpactPercent: number;
  priority: "critical" | "moderate" | "low";
  recommendations: string[];
  trainingHoursWeek: string;
  currentPeriod: string;
}

interface SGFocusCardProps {
  data: SGFocusData;
  delay?: number;
}

const PRIORITY_STYLES = {
  critical: {
    badgeBg: "bg-[var(--color-error-light)]",
    badgeText: "text-[var(--color-error-text)]",
    label: "Kritisk",
    recBg: "bg-[var(--color-error-light)]",
  },
  moderate: {
    badgeBg: "bg-[var(--color-warning-light)]",
    badgeText: "text-[var(--color-warning-text)]",
    label: "Moderat",
    recBg: "bg-[var(--color-warning-light)]",
  },
  low: {
    badgeBg: "bg-[var(--color-success-light)]",
    badgeText: "text-[var(--color-success-text)]",
    label: "Lav",
    recBg: "bg-[var(--color-success-light)]",
  },
};

export function SGFocusCard({ data, delay = 0 }: SGFocusCardProps) {
  const style = PRIORITY_STYLES[data.priority];

  return (
    <PremiumCard delay={delay}>
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[var(--color-primary)]" />
        <p className="text-[15px] font-semibold text-[var(--color-portal-text)]">
          Fokusomrade
        </p>
      </div>

      <div className="space-y-4">
        {/* Priority header */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
              Forbedringsprioritet
            </span>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${style.badgeBg} ${style.badgeText}`}>
              {style.label}
            </span>
          </div>
          <p className="text-xl font-bold text-[var(--color-portal-text)]">{data.area}</p>
          <p className="mt-0.5 text-xs text-[var(--color-portal-secondary)]">
            Taper {Math.abs(data.sgLoss).toFixed(2)} slag per runde &middot; {data.sgImpactPercent}% SG-innvirkning
          </p>
        </div>

        {/* Recommendations */}
        <div className={`rounded-xl p-3 ${style.recBg}`}>
          <p className="mb-2 text-xs font-semibold text-[var(--color-portal-text)]">
            Anbefalt trening:
          </p>
          <ul className="space-y-1">
            {data.recommendations.map((rec) => (
              <li key={rec} className="flex items-start gap-1.5 text-xs text-[var(--color-portal-secondary)]">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--color-portal-muted)]" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats footer */}
        <div className="grid grid-cols-2 gap-4 border-t border-black/[0.06] pt-3">
          <div>
            <p className="text-[10px] text-[var(--color-portal-muted)]">Treningstimer/uke</p>
            <p className="text-lg font-bold tabular-nums text-[var(--color-portal-text)]">
              {data.trainingHoursWeek}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--color-portal-muted)]">Gjeldende periode</p>
            <p className="text-lg font-bold text-[var(--color-portal-text)]">
              {data.currentPeriod}
            </p>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
