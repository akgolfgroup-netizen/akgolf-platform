"use client";

import { Check } from "lucide-react";
import type { MilestoneRow } from "../actions";

interface MilestonesCardProps {
  milestones: MilestoneRow[];
}

export function MilestonesCard({ milestones }: MilestonesCardProps) {
  const achieved = milestones.filter((m) => m.achieved).length;

  return (
    <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          Milepæler
        </span>
        <span className="text-[11px] tabular-nums text-portal-muted">
          {achieved}/{milestones.length} oppnådd
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {milestones.map((m) => (
          <div key={m.id}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 ${
                    m.achieved
                      ? "bg-success text-white"
                      : "bg-portal-hover text-portal-muted"
                  }`}
                >
                  {m.achieved && <Check className="w-3 h-3" />}
                </div>
                <span
                  className={`text-sm ${
                    m.achieved
                      ? "text-portal-text font-medium"
                      : "text-portal-secondary"
                  }`}
                >
                  {m.label}
                </span>
              </div>
              <span className="text-xs tabular-nums text-portal-muted">
                {m.progressLabel}
              </span>
            </div>
            {!m.achieved && (
              <div className="mt-1.5 ml-7 h-[3px] rounded-full bg-portal-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
