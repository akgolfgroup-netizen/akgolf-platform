import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { DagensFokusClient } from "./dagens-fokus-client";

export const metadata = {
  title: "Dagens fokus — AK Golf CoachHQ",
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

  // Today's sessions
  const { data: todaysSessions } = await supabase
    .from("Booking")
    .select(
      `
      *,
      User:studentId(id, name, subscriptionTier),
      ServiceType:serviceTypeId(name)
    `,
    )
    .gte("startTime", today.toISOString())
    .lt("startTime", tomorrow.toISOString())
    .in("status", ["CONFIRMED", "PENDING"])
    .order("startTime", { ascending: true });

  // Active students (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: activeStudents } = await supabase
    .from("Booking")
    .select("studentId", { count: "exact", head: true })
    .gte("startTime", thirtyDaysAgo.toISOString())
    .in("status", ["CONFIRMED", "COMPLETED"]);

  // Pending bookings
  const { count: pendingBookings } = await supabase
    .from("Booking")
    .select("id", { count: "exact", head: true })
    .eq("status", "PENDING");

  // MTD revenue
  const { data: mtdRevenue } = await supabase
    .from("PaymentTransaction")
    .select("grossAmount")
    .gte("createdAt", monthStart.toISOString())
    .eq("status", "PAID");

  const mtdRevenueTotal = (mtdRevenue ?? []).reduce(
    (sum, t) => sum + (t.grossAmount ?? 0),
    0,
  );

  // Weekly sessions
  const { count: weeklySessions } = await supabase
    .from("TrainingSession")
    .select("id", { count: "exact", head: true })
    .gte("date", weekStart.toISOString());

  const sessionsToday = todaysSessions?.length ?? 0;

  // Map sessions to divisions
  const map = (rows: typeof todaysSessions, filterFn: (r: { User?: { subscriptionTier?: string } | null }) => boolean, subtitleFn: (r: { User?: { subscriptionTier?: string } | null; ServiceType?: { name?: string } | null }) => string) =>
    (rows ?? [])
      .filter(filterFn)
      .map((s) => ({
        id: s.id as string,
        name: (s.User?.name as string) ?? "Ukjent",
        time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isActive: new Date(s.startTime) <= new Date(),
        subtitle: subtitleFn(s),
      }));

  return {
    kpis: {
      sessionsToday,
      activeStudents: activeStudents ?? 0,
      pendingBookings: pendingBookings ?? 0,
      mtdRevenue: mtdRevenueTotal,
      weeklySessions: weeklySessions ?? 0,
    },
    divisions: {
      coaching: {
        studentCount: 0,
        sessions: map(
          todaysSessions,
          (r) => r.User?.subscriptionTier === "PRO" || r.User?.subscriptionTier === "ELITE",
          (s) => `${s.User?.subscriptionTier} · ${s.ServiceType?.name ?? "Økt"}`,
        ),
        actionItems: [],
      },
      junior: {
        studentCount: 0,
        sessions: map(
          todaysSessions,
          (r) => r.User?.subscriptionTier === "ACADEMY" || r.User?.subscriptionTier === "STARTER",
          (s) => `Junior · ${s.ServiceType?.name ?? "Økt"}`,
        ),
        actionItems: [],
      },
      gfgk: {
        studentCount: 0,
        sessions: map(
          todaysSessions,
          (r) => r.User?.subscriptionTier === "VISITOR",
          () => "GFGK Junior",
        ),
      },
    },
  };
}

export default async function AdminDashboardPage() {
  const user = await requirePortalUser();
  const data = await getDashboardData();

  return <DagensFokusClient data={data} user={user} />;
}
