"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin, isStaff } from "@/lib/portal/rbac";

// ─── Types ────────────────────────────────────────────────

export type CoachKPIs = {
  activeStudentCount: number;
  avgHcpImprovement: number;
  trainingAdherence: number;
  topFocusArea: string | null;
  totalRevenueThisMonth: number;
  totalBookingsThisMonth: number;
};

export type StudentOverviewRow = {
  id: string;
  name: string | null;
  image: string | null;
  latestHandicap: number | null;
  handicapChange3m: number | null;
  lastTrainingDate: string | null;
  planAdherence: { completed: number; total: number };
  biggestSGGap: string | null;
  nextBooking: string | null;
};

// ─── Coach KPIs ───────────────────────────────────────────

export async function getCoachKPIs(): Promise<CoachKPIs> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();
  const now = new Date();
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count: activeStudentCount } = await supabase
    .from("User")
    .select("id", { count: "exact", head: true })
    .eq("role", "STUDENT")
    .eq("isActive", true);

  const { count: totalBookingsThisMonth } = await supabase
    .from("Booking")
    .select("id", { count: "exact", head: true })
    .gte("startTime", startOfMonth.toISOString())
    .in("status", ["CONFIRMED", "COMPLETED"]);

  const { data: revData } = await supabase
    .from("PaymentTransaction")
    .select("grossAmount")
    .eq("status", "PAID")
    .gte("paidAt", startOfMonth.toISOString());

  const totalRevenueThisMonth = (revData ?? []).reduce(
    (sum, r) => sum + (r.grossAmount ?? 0),
    0
  );

  return {
    activeStudentCount: activeStudentCount ?? 0,
    avgHcpImprovement: 0,
    trainingAdherence: 0,
    topFocusArea: null,
    totalRevenueThisMonth,
    totalBookingsThisMonth: totalBookingsThisMonth ?? 0,
  };
}

// ─── Student Overview ─────────────────────────────────────

export async function getStudentOverview(): Promise<StudentOverviewRow[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();
  const now = new Date();

  const { data: students } = await supabase
    .from("User")
    .select("id, name, image")
    .eq("role", "STUDENT")
    .eq("isActive", true)
    .order("name")
    .limit(100);

  if (!students?.length) return [];

  const rows: StudentOverviewRow[] = [];

  for (const s of students) {
    const { data: hcpEntries } = await supabase
      .from("HandicapEntry")
      .select("handicapIndex, date")
      .eq("userId", s.id)
      .order("date", { ascending: false })
      .limit(2);

    const latestHandicap = hcpEntries?.[0]?.handicapIndex ?? null;
    const previousHandicap = hcpEntries?.[1]?.handicapIndex ?? null;
    const handicapChange3m =
      latestHandicap !== null && previousHandicap !== null
        ? Number((latestHandicap - previousHandicap).toFixed(1))
        : null;

    const { data: lastLog } = await supabase
      .from("TrainingLog")
      .select("date")
      .eq("userId", s.id)
      .order("date", { ascending: false })
      .limit(1);

    const { data: nextBook } = await supabase
      .from("Booking")
      .select("startTime")
      .eq("studentId", s.id)
      .in("status", ["CONFIRMED", "PENDING"])
      .gte("startTime", now.toISOString())
      .order("startTime")
      .limit(1);

    rows.push({
      id: s.id,
      name: s.name,
      image: s.image ?? null,
      latestHandicap,
      handicapChange3m,
      lastTrainingDate: lastLog?.[0]?.date ?? null,
      planAdherence: { completed: 0, total: 0 },
      biggestSGGap: null,
      nextBooking: nextBook?.[0]?.startTime ?? null,
    });
  }

  return rows;
}

// ─── Legacy (kept for compatibility) ──────────────────────

export async function getRevenueAnalytics(period: "week" | "month" | "year") {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();

  return {
    revenue: [] as number[],
    labels: [] as string[],
  };
}

export async function getStudentMetrics() {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();

  return {
    activeStudents: 0,
    newStudents: 0,
    churnRate: 0,
  };
}
