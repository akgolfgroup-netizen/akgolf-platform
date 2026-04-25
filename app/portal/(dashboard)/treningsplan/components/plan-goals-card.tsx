"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import type { PlanGoalsSummary } from "../actions";

interface Props {
  summary: PlanGoalsSummary | null;
}

const GOAL_TYPE_LABELS: Record<string, string> = {
  HCP: "Handicap",
  TOURNAMENT: "Turnering",
  SKILL: "Ferdighet",
  FITNESS: "Fysisk",
  DRIVER_SPEED: "Driver-hastighet",
  DRIVER_CARRY: "Driver-carry",
  OTHER: "Annet",
};

const GOAL_TYPE_ICONS: Record<string, string> = {
  HCP: "trending_down",
  TOURNAMENT: "emoji_events",
  SKILL: "sports_golf",
  FITNESS: "fitness_center",
  DRIVER_SPEED: "speed",
  DRIVER_CARRY: "straighten",
  OTHER: "flag",
};

export function PlanGoalsCard({ summary }: Props) {
  if (!summary || summary.totalCount === 0) {
    return null;
  }

  const visible = summary.goals.slice(0, 3);

  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
          Mål · {summary.achievedCount}/{summary.totalCount} oppnådd
        </p>
      </div>
      <div className="mt-3 space-y-3">
        {visible.map((g) => {
          const achieved = g.achievedAt !== null;
          const overdue =
            !achieved && g.daysRemaining !== null && g.daysRemaining < 0;
          return (
            <div
              key={g.id}
              className={cn(
                "rounded-xl border p-3",
                achieved
                  ? "border-success/30 bg-success/5"
                  : overdue
                    ? "border-error/30 bg-error/5"
                    : "border-outline-variant/30 bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Icon
                    name={GOAL_TYPE_ICONS[g.goalType] ?? "flag"}
                    size={16}
                    className={
                      achieved
                        ? "text-success"
                        : overdue
                          ? "text-error"
                          : "text-primary"
                    }
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-on-surface">
                      {g.title}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {GOAL_TYPE_LABELS[g.goalType] ?? g.goalType}
                      {g.targetDate && ` · ${g.targetDate}`}
                      {g.daysRemaining != null && !achieved && (
                        <span className={overdue ? "text-error" : ""}>
                          {" · "}
                          {overdue
                            ? `${Math.abs(g.daysRemaining)}d over frist`
                            : `${g.daysRemaining}d igjen`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {g.targetValue != null && (
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Mål
                    </p>
                    <p className="font-mono text-sm font-bold text-on-surface">
                      {g.targetValue}
                    </p>
                  </div>
                )}
              </div>

              {g.progressPct !== null && (
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        achieved
                          ? "bg-success"
                          : g.progressPct >= 75
                            ? "bg-primary"
                            : "bg-secondary-fixed"
                      )}
                      style={{ width: `${g.progressPct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-on-surface-variant">
                    {g.currentValue != null && (
                      <span>Nå: {g.currentValue}</span>
                    )}
                    <span className="font-mono font-bold text-on-surface">
                      {g.progressPct}%
                    </span>
                  </div>
                </div>
              )}

              {achieved && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-success">
                  ✓ Oppnådd
                </p>
              )}
            </div>
          );
        })}
        {summary.goals.length > 3 && (
          <p className="text-center text-[11px] text-on-surface-variant">
            +{summary.goals.length - 3} flere mål
          </p>
        )}
      </div>
    </div>
  );
}
