"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";

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

  // Get counts for each student
  const studentsWithCounts = await Promise.all(
    (students || []).map(async (student) => {
      const [{ count: bookingCount }, { count: coachingCount }] = await Promise.all([
        supabase.from("Booking").select("*", { count: "exact", head: true }).eq("studentId", student.id),
        supabase.from("CoachingSession").select("*", { count: "exact", head: true }).eq("studentId", student.id),
      ]);
      return {
        ...student,
        _count: { Booking: bookingCount ?? 0, CoachingSession: coachingCount ?? 0 },
      };
    })
  );

  return { students: studentsWithCounts, total: total ?? 0 };
}

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
      notionPageId,
      subscriptionTier
    `)
    .eq("id", studentId)
    .single();

  if (!student) return null;

  const [
    { data: bookings },
    { data: coachingSessions },
    { data: handicapEntries },
    { data: goals },
  ] = await Promise.all([
    supabase
      .from("Booking")
      .select(`
        id,
        startTime,
        endTime,
        status,
        amount,
        paymentStatus,
        ServiceType (name),
        Instructor (User (name))
      `)
      .eq("studentId", studentId)
      .order("startTime", { ascending: false })
      .limit(50),
    supabase
      .from("CoachingSession")
      .select(`
        id,
        sessionDate,
        primaryFocus,
        instructorNotes,
        aiSummary,
        aiKeyPoints,
        progressRating
      `)
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
  ]);

  return {
    ...student,
    Booking: bookings || [],
    CoachingSession: coachingSessions || [],
    HandicapEntry: handicapEntries || [],
    Goal: goals || [],
  };
}
