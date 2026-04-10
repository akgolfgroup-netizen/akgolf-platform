"use client";

import { useRouter } from "next/navigation";
import type { TournamentWithPlan, GoalType } from "@/modules/tournament-planner";
import { TournamentCard } from "@/modules/tournament-planner";
import { findPeriodForDate } from "@/modules/tournament-planner/constants";
import { Trophy } from "lucide-react";
import { PortalCard } from "@/components/portal/premium";

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
      <PortalCard
        padding="lg"
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Trophy className="h-6 w-6" />
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          Ingen turneringer lagt inn ennå.
        </p>
      </PortalCard>
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
