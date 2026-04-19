"use client";

import type { TrainingIndex } from "@/lib/portal/kartlegging";

interface TrainingIndexCardProps {
  index: TrainingIndex;
}

export function TrainingIndexCard({ index }: TrainingIndexCardProps) {
  const [recMin, recMax] = index.recommendedSummer;
  const weeklyStatus =
    index.weeklyHours < recMin
      ? "Under anbefalt"
      : index.weeklyHours > recMax
        ? "Over anbefalt"
        : "OK";

  const rows = [
    {
      label: "Timer/uke",
      value: `${index.weeklyHours.toFixed(1)} t`,
      sublabel: weeklyStatus,
    },
    {
      label: "Planfølging",
      value: `${index.planAdherencePct}%`,
      sublabel: index.planAdherencePct >= 85 ? "Utmerket" : index.planAdherencePct >= 70 ? "OK" : "Lav",
    },
    {
      label: "Effektivitet",
      value: `+${index.sgPerHourPerMonth.toFixed(3)} SG/t/mnd`,
      sublabel:
        index.sgPerHourPerMonth >= 0.08
          ? "God"
          : index.sgPerHourPerMonth >= 0.04
            ? "OK"
            : "Lav",
    },
  ];

  return (
    <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        Treningsindeks
      </span>

      <div className="mt-3 divide-y divide-portal-border-subtle">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between py-2.5"
          >
            <div>
              <div className="text-sm text-portal-secondary">{r.label}</div>
              <div className="text-[11px] text-portal-muted">{r.sublabel}</div>
            </div>
            <span className="text-sm font-semibold tabular-nums text-portal-text">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
