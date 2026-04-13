"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";

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
// getStudentProfile — henter enkeltprofil med all relatert data
// ---------------------------------------------------------------------------

export async function getStudentProfile(studentId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  const supabase = await createServerSupabase();

  const { data: student } = await supabase
    .from("User")
    .select(`
      id,
      name,
      email,
      phone,
      image,
      createdAt,
      lastActiveAt,
      isActive,
      notionPageId,
      subscriptionTier
    `)
    .eq("id", studentId)
    .single();

  if (!student) return null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: bookings },
    { data: upcomingBookings },
    { data: coachingSessions },
    { data: handicapEntries },
    { data: goals },
    { data: activePlan },
    { data: roundStats },
    { count: monthlyBookingsCount },
  ] = await Promise.all([
    supabase
      .from("Booking")
      .select(`
        id, startTime, endTime, status, amount, paymentStatus,
        ServiceType (name),
        Instructor (User (name))
      `)
      .eq("studentId", studentId)
      .in("status", ["CONFIRMED", "COMPLETED"])
      .lt("startTime", now.toISOString())
      .order("startTime", { ascending: false })
      .limit(20),
    supabase
      .from("Booking")
      .select(`
        id, startTime, endTime, status,
        ServiceType (name),
        Instructor (User (name))
      `)
      .eq("studentId", studentId)
      .in("status", ["CONFIRMED", "PENDING"])
      .gte("startTime", now.toISOString())
      .order("startTime", { ascending: true })
      .limit(5),
    supabase
      .from("CoachingSession")
      .select("id, sessionDate, primaryFocus, instructorNotes, aiSummary, progressRating")
      .eq("studentId", studentId)
      .order("sessionDate", { ascending: false })
      .limit(20),
    supabase
      .from("HandicapEntry")
      .select("id, date, handicapIndex, source")
      .eq("userId", studentId)
      .order("date", { ascending: true })
      .limit(24),
    supabase
      .from("Goal")
      .select("id, title, description, targetDate, status, targetValue, currentValue")
      .eq("userId", studentId)
      .in("status", ["ACTIVE", "COMPLETED", "PAUSED"])
      .order("createdAt", { ascending: false })
      .limit(10),
    supabase
      .from("TrainingPlan")
      .select("id, title, periodType, startDate, endDate")
      .eq("studentId", studentId)
      .eq("isActive", true)
      .order("createdAt", { ascending: false })
      .limit(1),
    supabase
      .from("RoundStats")
      .select("userId, totalScore, date")
      .eq("userId", studentId)
      .order("date", { ascending: false })
      .limit(20),
    supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .eq("studentId", studentId)
      .in("status", ["CONFIRMED", "COMPLETED"])
      .gte("startTime", monthStart),
  ]);

  const scores = (roundStats ?? [])
    .map((r) => r.totalScore)
    .filter((s): s is number => s !== null);
  const avgScore =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  const latestHcp =
    handicapEntries && handicapEntries.length > 0
      ? handicapEntries[handicapEntries.length - 1].handicapIndex
      : null;

  const totalCompleted = (bookings ?? []).length;
  const attended = (bookings ?? []).filter((b) => b.status === "COMPLETED").length;
  const attendanceRate =
    totalCompleted > 0 ? Math.round((attended / totalCompleted) * 100) : 0;

  return {
    ...student,
    handicap: latestHcp,
    category: scoreToCategory(avgScore),
    attendanceRate,
    sessionsThisMonth: monthlyBookingsCount ?? 0,
    totalSessions: totalCompleted,
    Booking: bookings ?? [],
    UpcomingBooking: upcomingBookings ?? [],
    CoachingSession: coachingSessions ?? [],
    HandicapEntry: handicapEntries ?? [],
    Goal: goals ?? [],
    ActivePlan: activePlan?.[0] ?? null,
  };
}

// ---------------------------------------------------------------------------
// updateCoachingNotes
// ---------------------------------------------------------------------------

export async function updateCoachingNotes(
  sessionId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ingen tilgang" };
  }

  const supabase = await createServerSupabase();

  try {
    await supabase
      .from("CoachingSession")
      .update({ instructorNotes: notes })
      .eq("id", sessionId);

    revalidatePath("/admin/elever");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke oppdatere notater" };
  }
}
