"use client";

import { Users, TrendingUp, ClipboardCheck, AlertTriangle } from "lucide-react";
import type { CoachingBoardGroupHealth } from "../actions";

interface GroupHealthSectionProps {
  health: CoachingBoardGroupHealth;
}

function formatTrend(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

export function GroupHealthSection({ health }: GroupHealthSectionProps) {
  const dist = health.distributionAvg;
  const bars = [
    { key: "onCourse", label: "Banegolf", value: dist.onCourse, color: "var(--color-warning)" },
    { key: "skillTechnical", label: "Ferdighet", value: dist.skillTechnical, color: "var(--color-primary)" },
    { key: "shortGame", label: "Kortspill", value: dist.shortGame, color: "var(--color-primary-alt)" },
    { key: "putting", label: "Putting", value: dist.putting, color: "var(--color-accent-cta)" },
    { key: "physicalMental", label: "Fysisk/mental", value: dist.physicalMental, color: "var(--color-ai)" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          icon={<Users className="h-4 w-4" />}
          label="Spillere i dag"
          value={health.totalPlayers.toString()}
          sublabel="under oppfølging"
        />
        <KpiCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="USI-trend 30d"
          value={formatTrend(health.avgUsiChange30d)}
          sublabel="gruppesnitt"
          tone={health.avgUsiChange30d >= 0 ? "success" : "warning"}
        />
        <KpiCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Banegolf-overvekt"
          value={health.courseHeavyCount.toString()}
          sublabel=">60% på bane"
          tone={health.courseHeavyCount > 0 ? "warning" : "default"}
        />
        <KpiCard
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="Tester mangler"
          value={health.missingTestsCount.toString()}
          sublabel="siste 90d"
          tone={health.missingTestsCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="rounded-xl border border-[var(--hg-border-subtle)] bg-[var(--hg-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--hg-text)] mb-1">
          Treningsfordeling gruppen
        </h3>
        <p className="text-[11px] text-[var(--hg-text-muted)] mb-4">
          Gjennomsnittlig tidsbruk siste 30 dager på tvers av spillerne.
        </p>
        <div className="space-y-2">
          {bars.map((b) => (
            <div key={b.key} className="flex items-center gap-3">
              <span className="w-28 text-xs text-[var(--hg-text-secondary)]">
                {b.label}
              </span>
              <div className="flex-1 h-[6px] rounded-full bg-[var(--hg-surface-raised)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round(b.value * 100)}%`,
                    background: b.color,
                  }}
                />
              </div>
              <span className="w-12 text-right text-xs tabular-nums text-[var(--hg-text)]">
                {Math.round(b.value * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "success" | "warning";
}

function KpiCard({ icon, label, value, sublabel, tone = "default" }: KpiCardProps) {
  const valueColor =
    tone === "success"
      ? "text-data-sage"
      : tone === "warning"
        ? "text-warning-text"
        : "text-[var(--hg-text)]";
  return (
    <div className="rounded-xl border border-[var(--hg-border-subtle)] bg-[var(--hg-surface)] p-4">
      <div className="flex items-center gap-2 text-[var(--hg-text-muted)]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>
      <div className={`mt-2 text-2xl font-bold tabular-nums ${valueColor}`}>
        {value}
      </div>
      {sublabel && (
        <div className="text-[11px] text-[var(--hg-text-muted)] mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}
