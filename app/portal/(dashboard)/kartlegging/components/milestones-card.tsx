"use client";

/**
 * MilestonesCard — bruker VerticalTimeline-pattern (P-06).
 */

import { MonoLabel, VerticalTimeline } from "@/components/portal/patterns";
import type { MilestoneRow } from "../actions";
import type { TimelineItem } from "@/components/portal/patterns";

interface MilestonesCardProps {
  milestones: MilestoneRow[];
}

export function MilestonesCard({ milestones }: MilestonesCardProps) {
  const achieved = milestones.filter((m) => m.achieved).length;

  const items: TimelineItem[] = milestones.map((m) => ({
    id: m.id,
    time: m.achieved ? "OK" : `${Math.round(m.progress)}%`,
    title: m.label,
    meta: m.progressLabel,
    dotColor: m.achieved ? "sage" : m.progress > 50 ? "amber" : "muted",
    active: m.achieved,
  }));

  return (
    <div className="rounded-xl bg-white shadow-card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <MonoLabel size="xs" uppercase className="text-primary">
          Milepæler
        </MonoLabel>
        <span className="text-[11px] tabular-nums text-grey-400">
          {achieved}/{milestones.length} oppnådd
        </span>
      </div>

      <VerticalTimeline items={items} compact />
    </div>
  );
}
