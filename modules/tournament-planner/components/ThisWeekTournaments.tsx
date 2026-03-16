"use client";

import type { TournamentPlanWithStudent } from "../types";
import type { GoalType, PlanLevel } from "../types";
import { GoalTypeBadge } from "./GoalTypeBadge";
import { PLAN_LEVEL_CONFIG } from "../constants";
import { Trophy, Calendar } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface ThisWeekTournamentsProps {
  plans: TournamentPlanWithStudent[];
}

export function ThisWeekTournaments({ plans }: ThisWeekTournamentsProps) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Trophy className="w-10 h-10 text-[var(--color-border)] mb-3" />
        <p className="text-sm text-[var(--color-gold-muted)]">
          Ingen spillere i turnering denne uken
        </p>
      </div>
    );
  }

  // Group by tournament
  const byTournament = new Map<string, { tournament: TournamentPlanWithStudent["tournament"]; plans: TournamentPlanWithStudent[] }>();
  for (const plan of plans) {
    const existing = byTournament.get(plan.tournamentId);
    if (existing) {
      existing.plans.push(plan);
    } else {
      byTournament.set(plan.tournamentId, {
        tournament: plan.tournament,
        plans: [plan],
      });
    }
  }

  return (
    <div className="space-y-6">
      {Array.from(byTournament.values()).map(({ tournament, plans: tournamentPlans }) => (
        <div key={tournament.id}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[var(--color-gold)]" />
            <h3 className="font-semibold text-[var(--color-snow)] text-sm">
              {tournament.name}
            </h3>
            <span className="text-xs text-[var(--color-gold-muted)]">
              {format(new Date(tournament.startDate), "d. MMMM", { locale: nb })}
            </span>
          </div>

          <div className="space-y-1.5">
            {tournamentPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-3 p-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl"
              >
                {/* Avatar */}
                {plan.student.image ? (
                  <img
                    src={plan.student.image}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[var(--color-bg-deep)] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #c9a96e 0%, #B8975C 100%)" }}
                  >
                    {plan.student.name?.charAt(0) ?? "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-snow)] truncate">
                    {plan.student.name ?? "Ukjent spiller"}
                  </p>
                  {plan.notes && (
                    <p className="text-xs text-[var(--color-gold-muted)] italic line-clamp-1 mt-0.5">
                      {plan.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    plan.isRegistered ? "bg-green-400" : "bg-red-400/60"
                  }`} title={plan.isRegistered ? "Påmeldt" : "Ikke påmeldt"} />
                  <span className="text-xs font-medium text-[var(--color-gold)]">
                    {PLAN_LEVEL_CONFIG[plan.planLevel as PlanLevel]?.label}
                  </span>
                  <GoalTypeBadge goalType={plan.goalType as GoalType} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
