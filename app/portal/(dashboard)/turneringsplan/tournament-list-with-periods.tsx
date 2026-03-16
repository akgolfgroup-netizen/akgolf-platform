"use client";

import { useRouter } from "next/navigation";
import type { TournamentWithPlan, GoalType } from "@/modules/tournament-planner";
import { TournamentCard } from "@/modules/tournament-planner";
import { findPeriodForDate } from "@/modules/tournament-planner/constants";
import { Trophy } from "lucide-react";

interface Period {
  periodType: string;
  startDate: Date;
  endDate: Date;
}

interface TournamentListWithPeriodsProps {
  tournaments: TournamentWithPlan[];
  studentId: string;
  periods: Period[];
}

export function TournamentListWithPeriods({
  tournaments,
  studentId,
  periods,
}: TournamentListWithPeriodsProps) {
  const router = useRouter();

  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Trophy className="w-10 h-10 text-[var(--color-border)] mb-3" />
        <p className="text-sm text-[var(--color-gold-muted)]">
          Ingen turneringer lagt inn ennå.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tournaments.map((t) => {
        const periodInfo = findPeriodForDate(periods, new Date(t.startDate));
        return (
          <TournamentCard
            key={t.id}
            tournament={t}
            studentId={studentId}
            onPlanUpdated={() => router.refresh()}
            periodLabel={periodInfo?.label}
            suggestedGoalType={periodInfo?.suggestedGoalType as GoalType | undefined}
          />
        );
      })}
    </div>
  );
}
