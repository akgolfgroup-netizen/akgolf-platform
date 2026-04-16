"use client";

import Image from "next/image";
import { GoalTypeBadge } from "./GoalTypeBadge";
import { PLAN_LEVEL_CONFIG } from "../constants";
import type { GoalType, PlanLevel } from "../types";

interface PlayerPlan {
  id: string;
  planLevel: string;
  goalType: string;
  notes: string | null;
  student: { id: string; name: string | null; image: string | null };
}

interface TournamentPlayerListProps {
  plans: PlayerPlan[];
}

export function TournamentPlayerList({ plans }: TournamentPlayerListProps) {
  if (plans.length === 0) return null;

  return (
    <div className="ml-6 mt-1 mb-2 space-y-1">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex items-center gap-3 p-2.5 bg-[var(--color-bg)] border border-[var(--color-grey-200)] rounded-lg"
        >
          {plan.student.image ? (
            <Image
              src={plan.student.image}
              alt=""
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6B7280 0%, #374151 100%)" }}
            >
              {plan.student.name?.charAt(0) ?? "?"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--color-grey-900)] truncate">
              {plan.student.name ?? "Ukjent"}
            </p>
            {plan.notes && (
              <p className="text-[10px] text-[var(--color-grey-400)] italic line-clamp-1">
                {plan.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] font-medium text-[var(--color-grey-900)]">
              {PLAN_LEVEL_CONFIG[plan.planLevel as PlanLevel]?.label}
            </span>
            <GoalTypeBadge goalType={plan.goalType as GoalType} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
