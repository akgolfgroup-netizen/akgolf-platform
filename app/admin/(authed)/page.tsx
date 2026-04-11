import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { HubOversiktClient } from "./hub-oversikt-client";

export const metadata = {
  title: "Hub — Oversikt | AK Golf Mission Control",
};

async function getHubData(_userId: string) {
  const supabase = await createServerSupabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

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
    .from("User")
    .select("id", { count: "exact", head: true })
    .eq("role", "STUDENT")
    .eq("isActive", true)
    .gte("Booking.startTime", thirtyDaysAgo.toISOString());

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

  // Simplified division counts
  const coachingStudents =
    (tierCounts["PRO"] ?? 0) + (tierCounts["ELITE"] ?? 0);
  const juniorStudents =
    (tierCounts["ACADEMY"] ?? 0) + (tierCounts["STARTER"] ?? 0);
  const gfgkStudents = tierCounts["VISITOR"] ?? 0;

  return {
    kpis: {
      sessionsToday: todaysSessions?.length ?? 0,
      activeStudents: activeStudents ?? 0,
      pendingBookings: pendingBookings ?? 0,
      mtdRevenue: mtdRevenueTotal,
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
                  text: `${pendingBookings} nye pameldinger a godkjenne`,
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
        ? [{ label: `${needsFollowUp?.length} oppfolging`, variant: "info" as const }]
        : []),
      ...((expiringSubscriptions?.length ?? 0) > 0
        ? [{ label: `${expiringSubscriptions?.length} utloper`, variant: "warning" as const }]
        : []),
      ...((pendingBookings ?? 0) > 0
        ? [{ label: `${pendingBookings} ventende`, variant: "error" as const }]
        : []),
    ],
  };
}

export default async function HubOversiktPage() {
  const user = await requirePortalUser();
  const data = await getHubData(user.id);

  return <HubOversiktClient data={data} user={user} />;
}
