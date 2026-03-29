"use client";

import Image from "next/image";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { StatCard } from "@/components/portal/apple/stat-card";
import { AppleCard } from "@/components/portal/apple/apple-card";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import type { TournamentPlanWithStudent } from "@/modules/tournament-planner/types";
import type { GoalType, PlanLevel } from "@/modules/tournament-planner/types";
import { PLAN_LEVEL_CONFIG } from "@/modules/tournament-planner/constants";
import { GoalTypeBadge } from "@/modules/tournament-planner/components/GoalTypeBadge";
import { Trophy, Users, Calendar, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";

interface ThisWeekClientProps {
  plans: TournamentPlanWithStudent[];
  weekStats: {
    totalPlayers: number;
    tournaments: number;
    registered: number;
    weekLabel: string;
  };
}

export function ThisWeekClient({ plans, weekStats }: ThisWeekClientProps) {
  // Group by tournament
  const byTournament = new Map<
    string,
    { tournament: TournamentPlanWithStudent["tournament"]; plans: TournamentPlanWithStudent[] }
  >();
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--apple-gray-50)] via-white to-[var(--apple-gold-50)]/30 -m-6 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--apple-gold-400)] to-[var(--apple-gold-600)] flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-[var(--apple-gray-950)] to-[var(--apple-gray-700)] bg-clip-text text-transparent">
              Denne uken
            </h1>
            <p className="text-sm text-[var(--apple-gray-500)]">{weekStats.weekLabel}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <BentoGrid gap="md" className="mb-8">
        <motion.div
          className="col-span-3 max-lg:col-span-3 max-md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <StatCard
            label="Spillere"
            value={weekStats.totalPlayers}
            icon={Users}
            iconColor="text-[var(--apple-gold-500)]"
            iconBg="bg-[var(--apple-gold-50)]"
            size="md"
          />
        </motion.div>

        <motion.div
          className="col-span-3 max-lg:col-span-3 max-md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <StatCard
            label="Turneringer"
            value={weekStats.tournaments}
            icon={Trophy}
            iconColor="text-purple-500"
            iconBg="bg-purple-50"
            size="md"
          />
        </motion.div>

        <motion.div
          className="col-span-3 max-lg:col-span-3 max-md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <StatCard
            label="Pameldt"
            value={weekStats.registered}
            icon={CheckCircle2}
            iconColor="text-green-500"
            iconBg="bg-green-50"
            size="md"
          />
        </motion.div>

        <motion.div
          className="col-span-3 max-lg:col-span-3 max-md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <StatCard
            label="Registreringsrate"
            value={`${registrationRate}%`}
            trend={registrationRate >= 80 ? registrationRate - 80 : undefined}
            icon={Clock}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
            size="md"
          />
        </motion.div>
      </BentoGrid>

      {/* Tournament Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <BentoCard
          span={12}
          title="Spillere i turnering"
          subtitle={`${plans.length} spillerplan${plans.length !== 1 ? "er" : ""}`}
          icon={Trophy}
          variant="glass"
        >
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--apple-gray-100)] flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-[var(--apple-gray-400)]" />
              </div>
              <p className="text-sm text-[var(--apple-gray-500)]">
                Ingen spillere i turnering denne uken
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(byTournament.values()).map(({ tournament, plans: tournamentPlans }, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  {/* Tournament Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--apple-gray-200)]/50">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--apple-gray-900)] truncate">
                        {tournament.name}
                      </h3>
                      <p className="text-xs text-[var(--apple-gray-500)]">
                        {format(new Date(tournament.startDate), "EEEE d. MMMM", { locale: nb })}
                      </p>
                    </div>
                    <AppleBadge variant="neutral" size="md">
                      {tournamentPlans.length} spiller{tournamentPlans.length !== 1 ? "e" : ""}
                    </AppleBadge>
                  </div>

                  {/* Players List */}
                  <div className="grid gap-3">
                    {tournamentPlans.map((plan, playerIndex) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * playerIndex }}
                      >
                        <AppleCard
                          variant="solid"
                          padding="sm"
                          hover
                          className="!rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            {plan.student.image ? (
                              <Image
                                src={plan.student.image}
                                alt=""
                                width={44}
                                height={44}
                                className="w-11 h-11 rounded-xl object-cover flex-shrink-0 ring-2 ring-white shadow-md"
                              />
                            ) : (
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ring-2 ring-white shadow-md"
                                style={{
                                  background:
                                    "linear-gradient(135deg, var(--apple-gold-400) 0%, var(--apple-gold-600) 100%)",
                                }}
                              >
                                {plan.student.name?.charAt(0) ?? "?"}
                              </div>
                            )}

                            {/* Player Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[var(--apple-gray-900)] truncate">
                                {plan.student.name ?? "Ukjent spiller"}
                              </p>
                              {plan.notes && (
                                <p className="text-xs text-[var(--apple-gray-500)] italic line-clamp-1 mt-0.5">
                                  {plan.notes}
                                </p>
                              )}
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <AppleBadge
                                variant={plan.isRegistered ? "success" : "error"}
                                size="sm"
                                dot
                              >
                                {plan.isRegistered ? "Pameldt" : "Ikke pameldt"}
                              </AppleBadge>
                              <AppleBadge variant="gold" size="sm">
                                {PLAN_LEVEL_CONFIG[plan.planLevel as PlanLevel]?.label}
                              </AppleBadge>
                              <GoalTypeBadge goalType={plan.goalType as GoalType} size="sm" />
                            </div>
                          </div>
                        </AppleCard>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </BentoCard>
      </motion.div>
    </div>
  );
}
