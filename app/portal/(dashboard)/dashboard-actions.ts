"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { subDays, startOfDay } from "date-fns";

export async function getDashboardStats(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const supabase = await createServerSupabase();

  const [bookingResult, roundStatsResult] = await Promise.all([
    supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .eq("studentId", userId)
      .eq("status", "COMPLETED")
      .gte("startTime", thirtyDaysAgo.toISOString()),
    supabase
      .from("RoundStats")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId)
      .gte("date", thirtyDaysAgo.toISOString()),
  ]);

  if (bookingResult.error) {
    console.error("Error fetching booking stats:", bookingResult.error);
  }
  if (roundStatsResult.error) {
    console.error("Error fetching round stats:", roundStatsResult.error);
  }

  const sessionsCount = bookingResult.count ?? 0;
  const roundsCount = roundStatsResult.count ?? 0;

  return { sessionsCount, roundsCount };
}

export async function getHandicapData(userId: string) {
  const supabase = await createServerSupabase();

  const { data: entries, error } = await supabase
    .from("HandicapEntry")
    .select("handicapIndex, date")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(2);

  if (error) {
    console.error("Error fetching handicap data:", error);
    return { current: null, trend: null };
  }

  const current = entries?.[0]?.handicapIndex ?? null;
  const previous = entries?.[1]?.handicapIndex ?? null;
  const trend =
    current !== null && previous !== null ? current - previous : null;

  return { current, trend };
}

export async function getNextBooking(userId: string) {
  const supabase = await createServerSupabase();
  const today = startOfDay(new Date()).toISOString();

  const { data: booking, error } = await supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      Instructor (
        id,
        User (
          name
        )
      ),
      ServiceType (
        name,
        duration
      )
    `)
    .eq("studentId", userId)
    .eq("status", "CONFIRMED")
    .gte("startTime", today)
    .order("startTime", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching next booking:", error);
    return null;
  }

  if (!booking) return null;

  // Type assertion for nested relations
  const instructor = booking.Instructor as { User?: { name?: string } } | null;
  const serviceType = booking.ServiceType as { name?: string; duration?: number } | null;

  return {
    id: booking.id,
    instructorName: instructor?.User?.name ?? "Instruktør",
    serviceName: serviceType?.name ?? "Coaching",
    duration: serviceType?.duration ?? 60,
    startTime: booking.startTime,
  };
}

export async function getCoachInsight(userId: string) {
  const supabase = await createServerSupabase();

  const { data: session, error } = await supabase
    .from("CoachingSession")
    .select("aiSummary, aiFocusAreas, primaryFocus, sessionDate")
    .eq("studentId", userId)
    .order("sessionDate", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching coach insight:", error);
    return null;
  }

  const aiFocusAreas = session?.aiFocusAreas as string[] | null;

  if (!aiFocusAreas?.length && !session?.aiSummary) return null;

  return {
    focusAreas: aiFocusAreas,
    primaryFocus: session?.primaryFocus,
    summary: session?.aiSummary,
    date: session?.sessionDate,
  };
}

interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: string | Date;
}

export async function getLatestAiInsight(userId: string): Promise<WeeklyInsight | null> {
  const supabase = await createServerSupabase();

  // TODO: AI-insights felt (latestAiInsight, aiInsightGeneratedAt) mangler i Supabase.
  // Når disse feltene er migrert fra Prisma til Supabase, oppdater denne spørringen.
  // Midlertidig returneres null.

  console.warn("getLatestAiInsight: AI-insights tabell/felt mangler i Supabase for userId:", userId);

  // Kommentert ut frem til feltene er tilgjengelige:
  // const { data: user, error } = await supabase
  //   .from("User")
  //   .select("latestAiInsight, aiInsightGeneratedAt")
  //   .eq("id", userId)
  //   .single();
  //
  // if (error || !user?.latestAiInsight || !user.aiInsightGeneratedAt) {
  //   return null;
  // }
  //
  // const insight = user.latestAiInsight as {
  //   summary?: string;
  //   strengths?: string[];
  //   improvements?: string[];
  //   focusTip?: string;
  // };
  //
  // return {
  //   summary: insight.summary ?? "",
  //   strengths: insight.strengths ?? [],
  //   improvements: insight.improvements ?? [],
  //   focusTip: insight.focusTip ?? "",
  //   generatedAt: user.aiInsightGeneratedAt,
  // };

  return null;
}
