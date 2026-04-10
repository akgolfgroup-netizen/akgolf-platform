"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import {
  subDays,
  startOfDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday as isTodayFn,
} from "date-fns";
import { nb } from "date-fns/locale";

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

/* ── Handicap History (siste 6 entries) ── */

export async function getHandicapHistory(userId: string): Promise<number[]> {
  const supabase = await createServerSupabase();

  const { data: entries, error } = await supabase
    .from("HandicapEntry")
    .select("handicapIndex")
    .eq("userId", userId)
    .order("date", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error fetching handicap history:", error);
    return [];
  }

  return (entries ?? []).map((e) => e.handicapIndex as number);
}

/* ── Week Rings Data ── */

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

export async function getWeekRingsData(userId: string): Promise<{
  days: WeekDay[];
  weekStart: string;
}> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const supabase = await createServerSupabase();

  // Hent treningslogger og bookinger for uken
  const [trainingResult, bookingResult] = await Promise.all([
    supabase
      .from("TrainingLog")
      .select("date")
      .eq("userId", userId)
      .gte("date", weekStart.toISOString())
      .lte("date", weekEnd.toISOString()),
    supabase
      .from("Booking")
      .select("startTime")
      .eq("studentId", userId)
      .in("status", ["CONFIRMED", "COMPLETED"])
      .gte("startTime", weekStart.toISOString())
      .lte("startTime", weekEnd.toISOString()),
  ]);

  const trainedDates = new Set(
    (trainingResult.data ?? []).map((t) =>
      format(new Date(t.date as string), "yyyy-MM-dd")
    )
  );
  const coachingDates = new Set(
    (bookingResult.data ?? []).map((b) =>
      format(new Date(b.startTime as string), "yyyy-MM-dd")
    )
  );

  const days: WeekDay[] = daysInWeek.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayIndex = day.getDay(); // 0=sun, 6=sat
    const isRest = dayIndex === 0; // Soendag = hviledag
    const trained = trainedDates.has(dateStr) || coachingDates.has(dateStr);
    const hasCoaching = coachingDates.has(dateStr);

    return {
      dayLabel: format(day, "EEE", { locale: nb }).slice(0, 2).toUpperCase(),
      dateNumber: day.getDate(),
      trained,
      hasCoaching,
      isToday: isTodayFn(day),
      isRest,
      completionPercent: trained ? 100 : isRest ? 100 : 0,
    };
  });

  const weekLabel = `${format(weekStart, "d.", { locale: nb })} - ${format(weekEnd, "d. MMMM", { locale: nb })}`;

  return { days, weekStart: weekLabel };
}

/* ── Daily Checklist Items ── */

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
}

export async function getDailyChecklist(userId: string): Promise<ChecklistItem[]> {
  const supabase = await createServerSupabase();
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Sjekk om det er logget trening i dag
  const { count: trainingCount } = await supabase
    .from("TrainingLog")
    .select("id", { count: "exact", head: true })
    .eq("userId", userId)
    .gte("date", today.toISOString())
    .lt("date", tomorrow.toISOString());

  // Sjekk om det er logget runde i dag
  const { count: roundCount } = await supabase
    .from("RoundStats")
    .select("id", { count: "exact", head: true })
    .eq("userId", userId)
    .gte("date", today.toISOString())
    .lt("date", tomorrow.toISOString());

  // Sjekk om brukeren har en booking i dag
  const { count: bookingCount } = await supabase
    .from("Booking")
    .select("id", { count: "exact", head: true })
    .eq("studentId", userId)
    .in("status", ["CONFIRMED", "COMPLETED"])
    .gte("startTime", today.toISOString())
    .lt("startTime", tomorrow.toISOString());

  const hasTraining = (trainingCount ?? 0) > 0;
  const hasRound = (roundCount ?? 0) > 0;
  const hasBooking = (bookingCount ?? 0) > 0;

  return [
    {
      id: "log-training",
      label: "Logg treningsokt",
      completed: hasTraining,
      href: "/portal/dagbok",
    },
    {
      id: "check-plan",
      label: "Sjekk treningsplan",
      completed: false, // Statisk, krever mer avansert sporing
      href: "/portal/treningsplan",
    },
    {
      id: "log-round",
      label: "Registrer runde",
      completed: hasRound,
      href: "/portal/statistikk/ny-runde",
    },
    ...(hasBooking
      ? [
          {
            id: "attend-coaching",
            label: "Coaching-time i dag",
            completed: true,
            href: "/portal/bookinger",
          },
        ]
      : []),
  ];
}

/* ── Achievements Data ── */

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress?: number;
}

export async function getAchievements(userId: string): Promise<{
  achievements: Achievement[];
  totalAchievements: number;
}> {
  const supabase = await createServerSupabase();

  // Hent statistikk for a beregne achievements
  const [trainingResult, roundResult, bookingResult] = await Promise.all([
    supabase
      .from("TrainingLog")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId),
    supabase
      .from("RoundStats")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId),
    supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .eq("studentId", userId)
      .eq("status", "COMPLETED"),
  ]);

  const totalTraining = trainingResult.count ?? 0;
  const totalRounds = roundResult.count ?? 0;
  const totalCoaching = bookingResult.count ?? 0;

  const allAchievements: Achievement[] = [
    {
      id: "first-session",
      name: "Forste okt",
      description: "Logg din forste treningsokt",
      icon: "Target",
      rarity: "common",
      unlockedAt: totalTraining >= 1 ? "Opplast" : undefined,
      progress: totalTraining >= 1 ? 100 : 0,
    },
    {
      id: "first-round",
      name: "Forste runde",
      description: "Registrer din forste golfrunde",
      icon: "Trophy",
      rarity: "common",
      unlockedAt: totalRounds >= 1 ? "Opplast" : undefined,
      progress: totalRounds >= 1 ? 100 : 0,
    },
    {
      id: "coaching-start",
      name: "Under veiledning",
      description: "Fullfør din forste coachingtime",
      icon: "Star",
      rarity: "common",
      unlockedAt: totalCoaching >= 1 ? "Opplast" : undefined,
      progress: totalCoaching >= 1 ? 100 : 0,
    },
    {
      id: "dedicated-10",
      name: "Dedikert",
      description: "Logg 10 treningsokter",
      icon: "Flame",
      rarity: "rare",
      unlockedAt: totalTraining >= 10 ? "Opplast" : undefined,
      progress: totalTraining >= 10 ? 100 : Math.round((totalTraining / 10) * 100),
    },
    {
      id: "rounds-10",
      name: "Erfaren spiller",
      description: "Registrer 10 runder",
      icon: "Award",
      rarity: "rare",
      unlockedAt: totalRounds >= 10 ? "Opplast" : undefined,
      progress: totalRounds >= 10 ? 100 : Math.round((totalRounds / 10) * 100),
    },
    {
      id: "coaching-5",
      name: "Fast elev",
      description: "Fullfør 5 coaching-timer",
      icon: "Zap",
      rarity: "rare",
      unlockedAt: totalCoaching >= 5 ? "Opplast" : undefined,
      progress: totalCoaching >= 5 ? 100 : Math.round((totalCoaching / 5) * 100),
    },
    {
      id: "training-50",
      name: "Jernvilje",
      description: "Logg 50 treningsokter",
      icon: "Crown",
      rarity: "epic",
      unlockedAt: totalTraining >= 50 ? "Opplast" : undefined,
      progress: totalTraining >= 50 ? 100 : Math.round((totalTraining / 50) * 100),
    },
    {
      id: "rounds-50",
      name: "Veteran",
      description: "Registrer 50 runder",
      icon: "Medal",
      rarity: "legendary",
      unlockedAt: totalRounds >= 50 ? "Opplast" : undefined,
      progress: totalRounds >= 50 ? 100 : Math.round((totalRounds / 50) * 100),
    },
  ];

  return {
    achievements: allAchievements,
    totalAchievements: allAchievements.length,
  };
}
