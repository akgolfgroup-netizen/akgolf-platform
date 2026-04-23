"use server";

import { prisma } from "@/lib/portal/prisma";
import { requireAuth } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ElevOversiktRow {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  adherencePct: number;
  plannedSessionsThisWeek: number;
  completedSessionsThisWeek: number;
  lastActivity: Date | null;
  lastActivityText: string;
  currentHcp: number | null;
  hcpTrend: "down" | "up" | "same" | null; // down = bedre (lavere HCP)
  weeklyHours: number; // timer siste 7 dager
  hasActivePlan: boolean;
}

// ---------------------------------------------------------------------------
// Hent elev-oversikt for innlogget coach
// ---------------------------------------------------------------------------

export async function getElevOversikt(): Promise<ElevOversiktRow[]> {
  const authUserId = await requireAuth();
  const coach = await prisma.user.findUnique({ where: { id: authUserId } });
  if (!coach || !isStaff(coach.role)) throw new Error("Unauthorized");

  const now = new Date();

  // Denne uken: mandag 00:00 → neste mandag 00:00
  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  // Siste 7 dager for aktivitetsberegning
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const relations = await prisma.coachPlayerRelation.findMany({
    where: { coachUserId: coach.id, status: "ACTIVE" },
    include: {
      Player: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          HandicapEntry: { orderBy: { date: "desc" }, take: 2 },
          TrainingLog: {
            where: { date: { gte: sevenDaysAgo } },
            orderBy: { date: "desc" },
            select: {
              id: true,
              date: true,
              durationMinutes: true,
              planSessionId: true,
            },
          },
          TrainingPlan_TrainingPlan_studentIdToUser: {
            where: { isActive: true },
            take: 1,
            select: {
              id: true,
              TrainingPlanWeek: {
                where: {
                  weekStart: { gte: startOfWeek, lt: endOfWeek },
                },
                select: {
                  id: true,
                  TrainingPlanSession: {
                    select: { id: true, dayOfWeek: true, title: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return relations.map((rel) => {
    const p = rel.Player;

    // --- Adherence ---
    const activePlan = p.TrainingPlan_TrainingPlan_studentIdToUser[0];
    const plannedSessions = activePlan?.TrainingPlanWeek[0]?.TrainingPlanSession ?? [];
    const plannedCount = plannedSessions.length;
    const completedCount = plannedSessions.filter((session) =>
      p.TrainingLog.some((log) => log.planSessionId === session.id)
    ).length;
    const adherencePct = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

    // --- Siste aktivitet ---
    const lastLog = p.TrainingLog[0];
    const lastActivity = lastLog?.date ?? null;

    // --- HCP trend ---
    const hcpEntries = p.HandicapEntry;
    const currentHcp = hcpEntries[0]?.handicapIndex ?? null;
    const previousHcp = hcpEntries[1]?.handicapIndex ?? null;
    let hcpTrend: "down" | "up" | "same" | null = null;
    if (currentHcp !== null && previousHcp !== null) {
      if (currentHcp < previousHcp) hcpTrend = "down";
      else if (currentHcp > previousHcp) hcpTrend = "up";
      else hcpTrend = "same";
    }

    // --- Weekly hours ---
    const weeklyMinutes = p.TrainingLog.reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0);
    const weeklyHours = Math.round((weeklyMinutes / 60) * 10) / 10;

    return {
      id: p.id,
      name: p.name,
      email: p.email,
      image: p.image,
      adherencePct,
      plannedSessionsThisWeek: plannedCount,
      completedSessionsThisWeek: completedCount,
      lastActivity,
      lastActivityText: formatLastActivity(lastActivity),
      currentHcp,
      hcpTrend,
      weeklyHours,
      hasActivePlan: !!activePlan,
    };
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLastActivity(date: Date | null): string {
  if (!date) return "Aldri";
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "1 dag siden";
  if (diffDays < 7) return `${diffDays} dager siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
  return `${Math.floor(diffDays / 30)} mnd siden`;
}
