"use client";

/**
 * TrainingIndexCard — 3 rader (timer/uke, planfølging, effektivitet).
 * Bruker design-system tokens.
 */

import { MonoLabel } from "@/components/portal/patterns";
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
        : "På nivå";
  const planStatus =
    index.planAdherencePct >= 85
      ? "Utmerket"
      : index.planAdherencePct >= 70
        ? "OK"
        : "Lav";
  const effStatus =
    index.sgPerHourPerMonth >= 0.08
      ? "God"
      : index.sgPerHourPerMonth >= 0.04
        ? "OK"
        : "Lav";

  const rows = [
    {
      label: "Timer/uke",
      value: `${index.weeklyHours.toFixed(1)} t`,
      sublabel: weeklyStatus,
    },
    {
      label: "Planfølging",
      value: `${index.planAdherencePct}%`,
      sublabel: planStatus,
    },
    {
      label: "Effektivitet",
      value: `+${index.sgPerHourPerMonth.toFixed(3)}`,
      sublabel: `SG/t/mnd · ${effStatus}`,
    },
  ];

  return (
    <div className="rounded-xl bg-white shadow-card p-5">
      <MonoLabel size="xs" uppercase className="text-grey-400 block">
        Treningsindeks
      </MonoLabel>

      <div className="mt-3 divide-y divide-grey-100">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between py-3"
          >
            <div>
              <div className="text-sm text-grey-700 font-medium">{r.label}</div>
              <div className="text-[11px] text-grey-400 mt-0.5">{r.sublabel}</div>
            </div>
            <span className="text-sm font-semibold tabular-nums text-grey-900">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
