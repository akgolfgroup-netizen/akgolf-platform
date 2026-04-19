"use client";


import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import type { TournamentWithPlan, GoalType } from "@/modules/tournament-planner";
import { TournamentCard } from "@/modules/tournament-planner";
import { findPeriodForDate } from "@/modules/tournament-planner/constants";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";

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
      <PremiumCard padding="lg">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-on-surface">
            <Icon name="emoji_events" className="h-6 w-6" />
          </div>
          <p className="text-sm text-outline">
            Ingen turneringer lagt inn ennå.
          </p>
        </div>
      </PremiumCard>
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
