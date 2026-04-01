"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import type { TournamentWithPlan } from "../types";
import { PLAN_LEVEL_CONFIG, TOURNAMENT_LEVEL_CONFIG } from "../constants";
import { GoalTypeBadge } from "./GoalTypeBadge";
import { PlanTournamentSheet } from "./PlanTournamentSheet";

interface TournamentCardProps {
  tournament: TournamentWithPlan;
  studentId: string;
  onPlanUpdated?: () => void;
  periodLabel?: string;
  suggestedGoalType?: "prestasjon" | "utvikling" | "trening";
}

export function TournamentCard({
  tournament,
  studentId,
  onPlanUpdated,
  periodLabel,
  suggestedGoalType,
}: TournamentCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const plan = tournament.playerPlan;
  const levelConfig = TOURNAMENT_LEVEL_CONFIG[tournament.level as keyof typeof TOURNAMENT_LEVEL_CONFIG];

  return (
    <>
      <div className="bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-xl p-4 hover:border-[var(--color-grey-900)]/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-grey-200)] text-[var(--color-grey-400)]">
                {levelConfig?.label ?? tournament.level}
              </span>
              {plan && <GoalTypeBadge goalType={plan.goalType as "prestasjon" | "utvikling" | "trening"} size="sm" />}
              {plan && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  plan.isRegistered
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-[var(--color-grey-200)] text-[var(--color-grey-400)]"
                }`}>
                  {plan.isRegistered ? "Påmeldt" : "Ikke påmeldt"}
                </span>
              )}
              {tournament.series && (
                <span className="text-[10px] text-[var(--color-grey-400)]/60">
                  {tournament.series}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-[var(--color-grey-900)] text-sm truncate">
              {tournament.name}
            </h3>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs text-[var(--color-grey-400)]">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {format(new Date(tournament.startDate), "d. MMMM yyyy", { locale: nb })}
                  {tournament.endDate &&
                    ` – ${format(new Date(tournament.endDate), "d. MMMM", { locale: nb })}`}
                </span>
                {periodLabel && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-grey-400)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-grey-900)]" />
                    {periodLabel}
                  </span>
                )}
              </div>
              {(tournament.course || tournament.location) && (
                <div className="flex items-center gap-2 text-xs text-[var(--color-grey-400)]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{tournament.course ?? tournament.location}</span>
                </div>
              )}
              {plan?.notes && (
                <p className="text-xs text-[var(--color-grey-400)] italic line-clamp-2 mt-1">
                  {plan.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {tournament.externalUrl && (
              <a
                href={tournament.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-[var(--color-grey-200)] transition-colors text-[var(--color-grey-400)]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {plan ? (
              <div className="text-right">
                <p className="text-xs font-medium text-[var(--color-grey-900)]">
                  {PLAN_LEVEL_CONFIG[plan.planLevel as "A" | "B" | "C"].label}
                </p>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="text-[10px] text-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] mt-0.5"
                >
                  Endre
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSheetOpen(true)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-grey-900)]/30 text-[var(--color-grey-900)] hover:bg-[var(--color-grey-900)]/10 transition-colors"
              >
                Min plan
              </button>
            )}
          </div>
        </div>
      </div>

      <PlanTournamentSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        tournament={tournament}
        studentId={studentId}
        existingPlan={plan}
        suggestedGoalType={suggestedGoalType}
        currentPeriod={periodLabel}
        onSaved={() => {
          setSheetOpen(false);
          onPlanUpdated?.();
        }}
      />
    </>
  );
}
