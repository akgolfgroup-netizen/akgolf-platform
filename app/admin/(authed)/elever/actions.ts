"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StudentRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subscriptionTier: string;
  isActive: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  handicap: number | null;
  category: string | null;
  lastBookingDate: string | null;
  nextBookingDate: string | null;
  hasActivePlan: boolean;
  sessionsThisMonth: number;
  totalBookings: number;
}

export interface StudentListData {
  students: StudentRow[];
  total: number;
  stats: {
    total: number;
    active: number;
    newThisMonth: number;
    atRisk: number;
  };
}

// ---------------------------------------------------------------------------
// A-K kategori basert på snittscore
// ---------------------------------------------------------------------------

function scoreToCategory(avgScore: number | null): string | null {
  if (avgScore === null || avgScore === undefined) return null;
  if (avgScore < 68) return "A";
  if (avgScore <= 72) return "B";
  if (avgScore <= 74) return "C";
  if (avgScore <= 76) return "D";
  if (avgScore <= 78) return "E";
  if (avgScore <= 80) return "F";
  if (avgScore <= 85) return "G";
  if (avgScore <= 90) return "H";
  if (avgScore <= 95) return "I";
  if (avgScore <= 108) return "J";
  return "K";
}

// ---------------------------------------------------------------------------
// fetchStudents — henter alle elever med relatert data
// ---------------------------------------------------------------------------

export async function fetchStudents(
  query = "",
  page = 1
): Promise<StudentListData> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { students: [], total: 0, stats: { total: 0, active: 0, newThisMonth: 0, atRisk: 0 } };
  }

  const supabase = await createServerSupabase();
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  // Hent studenter
  let baseQuery = supabase
    .from("User")
    .select("id, name, email, phone, subscriptionTier, isActive, lastActiveAt, createdAt", {
      count: "exact",
    })
    .eq("role", "STUDENT")
    .order("name", { ascending: true });

  if (query) {
    baseQuery = baseQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data: rawStudents, count: total } = await baseQuery
    .range(skip, skip + pageSize - 1);

  if (!rawStudents || rawStudents.length === 0) {
    // Hent stats uansett
    const statsResult = await getStudentStats(supabase);
    return { students: [], total: total ?? 0, stats: statsResult };
  }

  const studentIds = rawStudents.map((s) => s.id);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Parallelle spørringer for relatert data
  const [
    { data: handicaps },
    { data: roundStats },
    { data: lastBookings },
    { data: nextBookings },
    { data: activePlans },
    { data: monthlyBookings },
    statsResult,
  ] = await Promise.all([
    // Siste handicap per student
    supabase
      .from("HandicapEntry")
      .select("userId, handicapIndex, date")
      .in("userId", studentIds)
      .order("date", { ascending: false }),
    // Snittscorer for A-K kategori
    supabase
      .from("RoundStats")
      .select("userId, totalScore")
      .in("userId", studentIds)
      .order("date", { ascending: false })
      .limit(200),
    // Siste gjennomførte booking per student
    supabase
      .from("Booking")
      .select("studentId, startTime")
      .in("studentId", studentIds)
      .in("status", ["CONFIRMED", "COMPLETED"])
      .lt("startTime", now.toISOString())
      .order("startTime", { ascending: false }),
    // Neste kommende booking per student
    supabase
      .from("Booking")
      .select("studentId, startTime")
      .in("studentId", studentIds)
      .in("status", ["CONFIRMED", "PENDING"])
      .gte("startTime", now.toISOString())
      .order("startTime", { ascending: true }),
    // Aktive treningsplaner
    supabase
      .from("TrainingPlan")
      .select("studentId")
      .in("studentId", studentIds)
      .eq("isActive", true),
    // Bookinger denne måneden
    supabase
      .from("Booking")
      .select("studentId")
      .in("studentId", studentIds)
      .in("status", ["CONFIRMED", "COMPLETED"])
      .gte("startTime", monthStart),
    // Statistikk
    getStudentStats(supabase),
  ]);

  // Bygg oppslagsmaps
  const handicapMap = new Map<string, number>();
  for (const h of handicaps ?? []) {
    if (!handicapMap.has(h.userId)) {
      handicapMap.set(h.userId, h.handicapIndex);
    }
  }

  const scoreMap = new Map<string, number[]>();
  for (const r of roundStats ?? []) {
    if (r.totalScore !== null) {
      const arr = scoreMap.get(r.userId) ?? [];
      arr.push(r.totalScore);
      scoreMap.set(r.userId, arr);
    }
  }

  const lastBookingMap = new Map<string, string>();
  for (const b of lastBookings ?? []) {
    if (!lastBookingMap.has(b.studentId)) {
      lastBookingMap.set(b.studentId, b.startTime);
    }
  }

  const nextBookingMap = new Map<string, string>();
  for (const b of nextBookings ?? []) {
    if (!nextBookingMap.has(b.studentId)) {
      nextBookingMap.set(b.studentId, b.startTime);
    }
  }

  const activePlanSet = new Set<string>();
  for (const p of activePlans ?? []) {
    activePlanSet.add(p.studentId);
  }

  const monthlyCountMap = new Map<string, number>();
  for (const b of monthlyBookings ?? []) {
    monthlyCountMap.set(b.studentId, (monthlyCountMap.get(b.studentId) ?? 0) + 1);
  }

  // Bygg rader
  const students: StudentRow[] = rawStudents.map((s) => {
    const scores = scoreMap.get(s.id);
    const avgScore =
      scores && scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      subscriptionTier: s.subscriptionTier,
      isActive: s.isActive,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      handicap: handicapMap.get(s.id) ?? null,
      category: scoreToCategory(avgScore),
      lastBookingDate: lastBookingMap.get(s.id) ?? null,
      nextBookingDate: nextBookingMap.get(s.id) ?? null,
      hasActivePlan: activePlanSet.has(s.id),
      sessionsThisMonth: monthlyCountMap.get(s.id) ?? 0,
      totalBookings: 0, // Beregnes ikke her for ytelse
    };
  });

  return { students, total: total ?? 0, stats: statsResult };
}

// ---------------------------------------------------------------------------
// Stats-aggregering
// ---------------------------------------------------------------------------

async function getStudentStats(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>
) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  const [
    { count: totalCount },
    { count: activeCount },
    { count: newCount },
    { data: atRiskUsers },
  ] = await Promise.all([
    supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("role", "STUDENT"),
    supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("role", "STUDENT")
      .eq("isActive", true),
    supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("role", "STUDENT")
      .gte("createdAt", monthStart),
    supabase
      .from("User")
      .select("id", { count: "exact" })
      .eq("role", "STUDENT")
      .eq("isActive", true)
      .lt("lastActiveAt", thirtyDaysAgo),
  ]);

  return {
    total: totalCount ?? 0,
    active: activeCount ?? 0,
    newThisMonth: newCount ?? 0,
    atRisk: atRiskUsers?.length ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Legacy — brukt av components/portal/admin/student-list.tsx
// ---------------------------------------------------------------------------

export async function searchStudents(query: string, page = 1) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { students: [], total: 0 };
  }

  const supabase = await createServerSupabase();
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  let baseQuery = supabase
    .from("User")
    .select("*", { count: "exact" })
    .eq("role", "STUDENT");

  if (query) {
    baseQuery = baseQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data: students, count: total } = await baseQuery
    .order("name", { ascending: true })
    .range(skip, skip + pageSize - 1);

  const studentsWithCounts = await Promise.all(
    (students || []).map(async (student) => {
      const [{ count: bookingCount }, { count: coachingCount }] =
        await Promise.all([
          supabase
            .from("Booking")
            .select("*", { count: "exact", head: true })
            .eq("studentId", student.id),
          supabase
            .from("CoachingSession")
            .select("*", { count: "exact", head: true })
            .eq("studentId", student.id),
        ]);
      return {
        ...student,
        _count: {
          Booking: bookingCount ?? 0,
          CoachingSession: coachingCount ?? 0,
        },
      };
    }),
  );

  return { students: studentsWithCounts, total: total ?? 0 };
}
