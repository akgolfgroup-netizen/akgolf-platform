"use client";

import Image from "next/image";
import {
  Trophy,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";

interface Tournament {
  id: string;
  name: string;
  startDate: Date;
}

interface TournamentPlan {
  id: string;
  tournamentId: string;
  tournament: Tournament;
  student: {
    id: string;
    name: string | null;
    image: string | null;
  };
  isRegistered: boolean;
  planLevel: string;
  goalType: string;
  notes?: string | null;
}

interface ThisWeekClientProps {
  plans: TournamentPlan[];
  weekStats: {
    totalPlayers: number;
    tournaments: number;
    registered: number;
    weekLabel: string;
  };
}

const PLAN_LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  A: { label: "Plan A", color: "#d2f000" },
  B: { label: "Plan B", color: "#00d2ff" },
  C: { label: "Plan C", color: "#7A8C85" },
};

const GOAL_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  WIN: { label: "Seier", color: "#005840" },
  TOP3: { label: "Topp 3", color: "#d2f000" },
  TOP10: { label: "Topp 10", color: "#007AFF" },
  CUT: { label: "Cut", color: "#7A8C85" },
  EXPERIENCE: { label: "Erfaring", color: "#C48A32" },
};

export function ThisWeekClient({ plans, weekStats }: ThisWeekClientProps) {
  const { toggle } = useMCSidebar();

  // Group by tournament
  const byTournament = new Map<string, { tournament: Tournament; plans: TournamentPlan[] }>();
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

  const registrationRate = weekStats.totalPlayers > 0
    ? Math.round((weekStats.registered / weekStats.totalPlayers) * 100)
    : 0;

  return (
    <>
      <MCTopbar
        title="Denne uken"
        subtitle={`Turneringsplaner for ${weekStats.weekLabel}`}
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Spillere"
            value={weekStats.totalPlayers}
            icon={Users}
          />
          <HGStatCard
            label="Turneringer"
            value={weekStats.tournaments}
            icon={Trophy}
          />
          <HGStatCard
            label="Påmeldt"
            value={weekStats.registered}
            icon={CheckCircle2}
          />
          <HGStatCard
            label="Registreringsrate"
            value={`${registrationRate}%`}
            trend={registrationRate >= 80 ? { value: registrationRate - 80, direction: "up" } : undefined}
            icon={Clock}
          />
        </div>

        {/* Tournament Cards */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <h3 className="hg-section-title">Spillere i turnering</h3>
            <span className="text-sm text-[var(--hg-text-muted)]">
              {plans.length} spillerplan{plans.length !== 1 ? "er" : ""}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--hg-surface-raised)] flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-[var(--hg-text-muted)]" />
              </div>
              <p className="text-sm text-[var(--hg-text-muted)]">
                Ingen spillere i turnering denne uken
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-8">
              {Array.from(byTournament.values()).map(({ tournament, plans: tournamentPlans }, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Tournament Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--hg-border)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--hg-primary)] to-[var(--hg-primary-muted)] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[var(--hg-bg)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--hg-text)] truncate">
                        {tournament.name}
                      </h3>
                      <p className="text-xs text-[var(--hg-text-muted)]">
                        {format(new Date(tournament.startDate), "EEEE d. MMMM", { locale: nb })}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                      {tournamentPlans.length} spiller{tournamentPlans.length !== 1 ? "e" : ""}
                    </span>
                  </div>

                  {/* Players List */}
                  <div className="space-y-3">
                    {tournamentPlans.map((plan) => {
                      const planLevel = PLAN_LEVEL_CONFIG[plan.planLevel] || { label: plan.planLevel, color: "#7A8C85" };
                      const goalType = GOAL_TYPE_CONFIG[plan.goalType] || { label: plan.goalType, color: "#7A8C85" };
                      
                      return (
                        <div
                          key={plan.id}
                          className="hg-card p-3 flex items-center gap-4"
                        >
                          {/* Avatar */}
                          {plan.student.image ? (
                            <Image
                              src={plan.student.image}
                              alt=""
                              width={44}
                              height={44}
                              className="w-11 h-11 rounded-xl object-cover ring-2 ring-[var(--hg-surface-raised)]"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-[var(--hg-text)] bg-[var(--hg-surface-raised)]">
                              {plan.student.name?.charAt(0) ?? "?"}
                            </div>
                          )}

                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--hg-text)] truncate">
                              {plan.student.name ?? "Ukjent spiller"}
                            </p>
                            {plan.notes && (
                              <p className="text-xs text-[var(--hg-text-muted)] italic truncate mt-0.5">
                                {plan.notes}
                              </p>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              plan.isRegistered 
                                ? "text-[var(--hg-success)] bg-[var(--hg-success)]/10" 
                                : "text-[var(--hg-error)] bg-[var(--hg-error)]/10"
                            )}>
                              {plan.isRegistered ? "Påmeldt" : "Ikke påmeldt"}
                            </span>
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full text-[var(--hg-bg)]"
                              style={{ backgroundColor: planLevel.color }}
                            >
                              {planLevel.label}
                            </span>
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full text-[var(--hg-bg)]"
                              style={{ backgroundColor: goalType.color }}
                            >
                              {goalType.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
