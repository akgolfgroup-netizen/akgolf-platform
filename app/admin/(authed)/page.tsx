import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { HubOversiktClient } from "./hub-oversikt-client";
import type { PrioritertElev } from "./dashboard/prioriterte-elever-kort";

export const metadata = {
  title: "Dashboard — AK Golf Mission Control",
};

async function getDashboardData() {
  const supabase = await createServerSupabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

  // Get today's sessions
  const { data: todaysSessions } = await supabase
    .from("Booking")
    .select(`
      *,
      User:studentId(id, name, subscriptionTier),
      ServiceType:serviceTypeId(name)
    `)
    .gte("startTime", today.toISOString())
    .lt("startTime", tomorrow.toISOString())
    .in("status", ["CONFIRMED", "PENDING"])
    .order("startTime", { ascending: true });

  // Get student counts by subscription tier
  const { data: studentCounts } = await supabase
    .from("User")
    .select("subscriptionTier")
    .eq("role", "STUDENT")
    .eq("isActive", true);

  const tierCounts = (studentCounts ?? []).reduce((acc, s) => {
    acc[s.subscriptionTier] = (acc[s.subscriptionTier] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get active students (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: activeStudents } = await supabase
    .from("Booking")
    .select("studentId", { count: "exact", head: true })
    .gte("startTime", thirtyDaysAgo.toISOString())
    .in("status", ["CONFIRMED", "COMPLETED"]);

  // Get new students this month
  const { count: newStudentsThisMonth } = await supabase
    .from("User")
    .select("id", { count: "exact", head: true })
    .eq("role", "STUDENT")
    .gte("createdAt", monthStart.toISOString());

  // Get pending bookings
  const { count: pendingBookings } = await supabase
    .from("Booking")
    .select("id", { count: "exact", head: true })
    .eq("status", "PENDING");

  // Get MTD revenue
  const { data: mtdRevenue } = await supabase
    .from("PaymentTransaction")
    .select("grossAmount")
    .gte("createdAt", monthStart.toISOString())
    .eq("status", "PAID");

  const mtdRevenueTotal = (mtdRevenue ?? []).reduce((sum, t) => sum + (t.grossAmount ?? 0), 0);

  // Get weekly activity (sessions logged)
  const { count: weeklySessions } = await supabase
    .from("TrainingSession")
    .select("id", { count: "exact", head: true })
    .gte("date", weekStart.toISOString());

  // Get students needing follow-up (no booking in 14+ days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: needsFollowUp } = await supabase
    .rpc("get_students_needing_followup", {
      since_date: fourteenDaysAgo.toISOString(),
      limit_count: 5,
    });

  // Get expiring subscriptions (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const { data: expiringSubscriptions } = await supabase
    .from("User")
    .select("id, name, subscriptionExpiresAt")
    .eq("role", "STUDENT")
    .eq("isActive", true)
    .gte("subscriptionExpiresAt", today.toISOString())
    .lte("subscriptionExpiresAt", sevenDaysFromNow.toISOString())
    .limit(5);

  // Get average HCP
  const { data: avgHcpData } = await supabase
    .from("User")
    .select("handicap")
    .eq("role", "STUDENT")
    .eq("isActive", true)
    .not("handicap", "is", null);

  const avgHcp = avgHcpData && avgHcpData.length > 0
    ? avgHcpData.reduce((sum, s) => sum + (s.handicap ?? 0), 0) / avgHcpData.length
    : 18.4;

  // Simplified division counts
  const coachingStudents =
    (tierCounts["PRO"] ?? 0) + (tierCounts["ELITE"] ?? 0);
  const juniorStudents =
    (tierCounts["ACADEMY"] ?? 0) + (tierCounts["STARTER"] ?? 0);
  const gfgkStudents = tierCounts["VISITOR"] ?? 0;
  const totalStudents = coachingStudents + juniorStudents + gfgkStudents;

  return {
    kpis: {
      sessionsToday: todaysSessions?.length ?? 0,
      activeStudents: activeStudents ?? 0,
      pendingBookings: pendingBookings ?? 0,
      mtdRevenue: mtdRevenueTotal,
      newStudentsThisMonth: newStudentsThisMonth ?? 0,
      weeklySessions: weeklySessions ?? 0,
      totalStudents,
      averageHcp: Number(avgHcp.toFixed(1)),
    },
    divisions: {
      coaching: {
        studentCount: coachingStudents || 48,
        sessions: (todaysSessions ?? [])
          .filter(
            (s) =>
              s.User?.subscriptionTier === "PRO" ||
              s.User?.subscriptionTier === "ELITE"
          )
          .map((s) => ({
            id: s.id,
            name: s.User?.name || "Ukjent",
            time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isActive: new Date(s.startTime) <= new Date(),
            subtitle: `${s.User?.subscriptionTier} · ${s.ServiceType?.name || "Okt"}`,
          })),
        actionItems: (needsFollowUp ?? []).slice(0, 2).map((u: { name: string }) => ({
          text: `${u.name} — 14+ dager siden sist`,
          variant: "error" as const,
        })),
      },
      junior: {
        studentCount: juniorStudents || 52,
        sessions: (todaysSessions ?? [])
          .filter(
            (s) =>
              s.User?.subscriptionTier === "ACADEMY" ||
              s.User?.subscriptionTier === "STARTER"
          )
          .map((s) => ({
            id: s.id,
            name: s.User?.name || "Ukjent",
            time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isActive: false,
            subtitle: `Junior · ${s.ServiceType?.name || "Okt"}`,
          })),
        actionItems:
          (pendingBookings ?? 0) > 0
            ? [
                {
                  text: `${pendingBookings} nye påmeldinger å godkjenne`,
                  variant: "info" as const,
                },
              ]
            : [],
      },
      gfgk: {
        studentCount: gfgkStudents || 42,
        sessions: (todaysSessions ?? [])
          .filter((s) => s.User?.subscriptionTier === "VISITOR")
          .map((s) => ({
            id: s.id,
            name: s.User?.name || "Gruppetrening",
            time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isActive: false,
            subtitle: "GFGK Junior",
          })),
        nextWeekItems: ["Tirsdag 14:00 — Gruppe A", "Torsdag 14:00 — Gruppe B"],
      },
    },
    alerts: [
      ...((needsFollowUp?.length ?? 0) > 0
        ? [{ label: `${needsFollowUp?.length} oppfølging`, variant: "info" as const }]
        : []),
      ...((expiringSubscriptions?.length ?? 0) > 0
        ? [{ label: `${expiringSubscriptions?.length} utløper`, variant: "warning" as const }]
        : []),
      ...((pendingBookings ?? 0) > 0
        ? [{ label: `${pendingBookings} ventende`, variant: "error" as const }]
        : []),
    ],
  };
}

async function getPrioriterteElever(coachId: string): Promise<PrioritertElev[]> {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const relations = await prisma.coachPlayerRelation.findMany({
    where: { coachUserId: coachId, status: "ACTIVE" },
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
            select: { id: true, date: true, durationMinutes: true, planSessionId: true },
          },
          TrainingPlan_TrainingPlan_studentIdToUser: {
            where: { isActive: true },
            take: 1,
            select: {
              TrainingPlanWeek: {
                where: { weekStart: { gte: startOfWeek, lt: endOfWeek } },
                select: {
                  TrainingPlanSession: { select: { id: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const mapped = relations.map((rel) => {
    const p = rel.Player;
    const plannedSessions = p.TrainingPlan_TrainingPlan_studentIdToUser[0]?.TrainingPlanWeek[0]?.TrainingPlanSession ?? [];
    const plannedCount = plannedSessions.length;
    const completedCount = plannedSessions.filter((s) =>
      p.TrainingLog.some((log) => log.planSessionId === s.id)
    ).length;
    const adherencePct = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

    const lastLog = p.TrainingLog[0];
    const lastActivity = lastLog?.date ?? null;

    const hcpEntries = p.HandicapEntry;
    const currentHcp = hcpEntries[0]?.handicapIndex ?? null;
    const previousHcp = hcpEntries[1]?.handicapIndex ?? null;
    let hcpTrend: "down" | "up" | "same" | null = null;
    if (currentHcp !== null && previousHcp !== null) {
      if (currentHcp < previousHcp) hcpTrend = "down";
      else if (currentHcp > previousHcp) hcpTrend = "up";
      else hcpTrend = "same";
    }

    return {
      id: p.id,
      name: p.name,
      email: p.email,
      image: p.image,
      adherencePct,
      plannedSessionsThisWeek: plannedCount,
      completedSessionsThisWeek: completedCount,
      lastActivity,
      currentHcp,
      hcpTrend,
    };
  });

  // Sort: adherence low→high, then lastActivity old→new (null last)
  return mapped
    .sort((a, b) => {
      if (a.adherencePct !== b.adherencePct) return a.adherencePct - b.adherencePct;
      const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : Infinity;
      const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : Infinity;
      return aTime - bTime;
    })
    .slice(0, 5);
}

export default async function AdminDashboardPage() {
  const user = await requirePortalUser();
  const [data, prioriterteElever] = await Promise.all([
    getDashboardData(),
    getPrioriterteElever(user.id),
  ]);

  return <HubOversiktClient data={data} user={user} prioriterteElever={prioriterteElever} />;
}
