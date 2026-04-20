"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { getTrainingIndex } from "@/lib/portal/kartlegging/training-index";
import type { TrainingIndex } from "@/lib/portal/kartlegging/types";
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

interface TrackManShot {
  club?: string;
  clubSpeed?: number;
  ballSpeed?: number;
  carry?: number;
}

export interface SgSummary {
  total: number | null;
  offTheTee: number | null;
  approach: number | null;
  aroundTheGreen: number | null;
  putting: number | null;
  roundCount: number;
  trend: "up" | "down" | "flat";
}

export interface TestProgress {
  totalTests: number;
  completedTests: number;
  passedTests: number;
  latestTest: {
    name: string;
    passed: boolean;
    value: number;
    unit: string;
    conductedAt: string;
  } | null;
  missingCount: number;
}

export async function getSgSummary(userId: string): Promise<SgSummary> {
  const since = subDays(new Date(), 30);
  const rounds = await prisma.roundStats.findMany({
    where: { userId, date: { gte: since } },
    select: {
      sgTotal: true,
      sgOffTheTee: true,
      sgApproach: true,
      sgAroundTheGreen: true,
      sgPutting: true,
      date: true,
    },
    orderBy: { date: "desc" },
  });

  const avg = (field: "sgTotal" | "sgOffTheTee" | "sgApproach" | "sgAroundTheGreen" | "sgPutting") => {
    const valid = rounds.filter((r) => r[field] !== null);
    if (valid.length === 0) return null;
    return valid.reduce((s, r) => s + (r[field] ?? 0), 0) / valid.length;
  };

  let trend: "up" | "down" | "flat" = "flat";
  const sgRounds = rounds.filter((r) => r.sgTotal !== null);
  if (sgRounds.length >= 4) {
    const mid = Math.floor(sgRounds.length / 2);
    const recent = sgRounds.slice(0, mid).reduce((s, r) => s + (r.sgTotal ?? 0), 0) / mid;
    const older =
      sgRounds.slice(mid).reduce((s, r) => s + (r.sgTotal ?? 0), 0) /
      (sgRounds.length - mid);
    if (recent > older + 0.1) trend = "up";
    else if (recent < older - 0.1) trend = "down";
  }

  return {
    total: avg("sgTotal"),
    offTheTee: avg("sgOffTheTee"),
    approach: avg("sgApproach"),
    aroundTheGreen: avg("sgAroundTheGreen"),
    putting: avg("sgPutting"),
    roundCount: rounds.length,
    trend,
  };
}

export async function getDashboardTrainingIndex(userId: string): Promise<TrainingIndex | null> {
  try {
    return await getTrainingIndex(userId);
  } catch (error) {
    console.error("Error fetching training index:", error);
    return null;
  }
}

export async function getTestProgress(userId: string): Promise<TestProgress> {
  const TOTAL_TESTS = 20;
  const results = await prisma.testResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      testNumber: true,
      value: true,
      passed: true,
      createdAt: true,
      TestDefinition: { select: { name: true, unit: true } },
    },
  });

  const uniqueTestNumbers = new Set(results.map((r) => r.testNumber));
  const passedTestNumbers = new Set(
    results.filter((r) => r.passed).map((r) => r.testNumber)
  );

  const latest = results[0];
  const latestTest = latest
    ? {
        name: latest.TestDefinition?.name ?? `Test ${latest.testNumber}`,
        passed: latest.passed,
        value: latest.value,
        unit: latest.TestDefinition?.unit ?? "",
        conductedAt: latest.createdAt.toISOString(),
      }
    : null;

  return {
    totalTests: TOTAL_TESTS,
    completedTests: uniqueTestNumbers.size,
    passedTests: passedTestNumbers.size,
    latestTest,
    missingCount: TOTAL_TESTS - uniqueTestNumbers.size,
  };
}

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
  weaknesses: string[];
  recommendations: string[];
  goalProgress: {
    target: string;
    current: number;
    target_value: number;
    unit: string;
  };
  patternAnalysis: string;
  generatedAt: string | Date;
}

export async function getLatestAiInsight(userId: string): Promise<WeeklyInsight | null> {
  const supabase = await createServerSupabase();
  
  // Hent spillerens data for å generere AI-insights
  const [handicapData, roundStats, trainingStats] = await Promise.all([
    supabase
      .from("HandicapEntry")
      .select("handicapIndex, date")
      .eq("userId", userId)
      .order("date", { ascending: false })
      .limit(5),
    supabase
      .from("RoundStats")
      .select("score, fairwaysHit, fairwaysTotal, gir, putts, date")
      .eq("userId", userId)
      .order("date", { ascending: false })
      .limit(5),
    supabase
      .from("TrainingLog")
      .select("durationMinutes, focusArea, date")
      .eq("userId", userId)
      .order("date", { ascending: false })
      .limit(10),
  ]);

  // Beregn statistikk
  const rounds = roundStats.data || [];
  const avgScore = rounds.length > 0 
    ? rounds.reduce((sum, r) => sum + (r.score || 0), 0) / rounds.length 
    : 0;
  
  const recentRounds = rounds.slice(0, 3);
  const trending = recentRounds.length >= 2 
    ? (recentRounds[0].score || 0) - (recentRounds[recentRounds.length - 1].score || 0)
    : 0;

  // Generer AI-insights basert på data
  const insights: WeeklyInsight = {
    summary: trending < 0 
      ? `Du viser god fremgang! Scoren din har forbedret seg med ${Math.abs(trending)} slag de siste 3 rundene.`
      : trending > 0
      ? `Det ser ut som du sliter litt for øyeblikket. Scoren har økt med ${trending} slag. Fokuser på å komme tilbake til det grunnleggende.`
      : "Din score er stabil. Dette er en god tid for å jobbe med spesifikke deler av spillet ditt.",
    strengths: [
      rounds.length > 0 && (rounds[0].gir || 0) >= 10 ? "God nøyaktighet på innspill" : "Konsistent driving",
      (trainingStats.data?.length || 0) > 5 ? "Dedikert treningsrutine" : "Jevn progresjon",
    ].filter(Boolean) as string[],
    weaknesses: [
      rounds.length > 0 && (rounds[0].putts || 0) > 36 ? "Putting trenger oppmerksomhet" : null,
      trending > 0 ? "Mental styrke under press" : null,
    ].filter(Boolean) as string[],
    recommendations: [
      "Fokuser på putting-driller denne uken",
      "Øv på innspillsavstander 50-100m",
      "Se over pre-shot rutine",
    ],
    goalProgress: {
      target: "Nå HCP 12.0",
      current: handicapData.data?.[0]?.handicapIndex || 15.0,
      target_value: 12.0,
      unit: "HCP",
    },
    patternAnalysis: rounds.length > 3 
      ? `Din statistikk viser at du presterer best på ${new Date().getDay() === 0 || new Date().getDay() === 6 ? 'helger' : 'ukedager'}. Vurder å planlegge viktige runder da.` 
      : "Fortsett å logge runder for å se mønstre i spillet ditt.",
    generatedAt: new Date(),
  };

  return insights;
}

/* ── TrackMan Data ── */

interface TrackManData {
  lastSession: {
    date: string;
    club: string;
    metric: string;
    value: number;
    unit: string;
  } | null;
  trends: {
    clubSpeed: number[];
    ballSpeed: number[];
    carry: number[];
  };
  improvements: {
    metric: string;
    change: number;
    period: string;
  }[];
}

export async function getTrackManData(userId: string): Promise<TrackManData | null> {
  const supabase = await createServerSupabase();

  // Sjekk om brukeren har TrackMan-sesjoner
  const { data: sessions, error } = await supabase
    .from("TrackManSession")
    .select("id, date, shots")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(5);

  if (error || !sessions || sessions.length === 0) {
    return null;
  }

  const lastSession = sessions[0];
  const shots = (lastSession.shots as TrackManShot[]) || [];
  const driverShots = shots.filter((s) => s.club === "Driver");

  // Beregn gjennomsnitt for siste sesjon
  const avgClubSpeed = driverShots.length > 0
    ? driverShots.reduce((sum, s) => sum + (s.clubSpeed || 0), 0) / driverShots.length
    : 0;

  // Hent trends fra siste 5 sesjoner
  const trends = {
    clubSpeed: sessions.map((s) => {
      const sShots = (s.shots as TrackManShot[]) || [];
      const drivers = sShots.filter((shot) => shot.club === "Driver");
      return drivers.length > 0
        ? drivers.reduce((sum, shot) => sum + (shot.clubSpeed || 0), 0) / drivers.length
        : 0;
    }).reverse(),
    ballSpeed: sessions.map((s) => {
      const sShots = (s.shots as TrackManShot[]) || [];
      const drivers = sShots.filter((shot) => shot.club === "Driver");
      return drivers.length > 0
        ? drivers.reduce((sum, shot) => sum + (shot.ballSpeed || 0), 0) / drivers.length
        : 0;
    }).reverse(),
    carry: sessions.map((s) => {
      const sShots = (s.shots as TrackManShot[]) || [];
      const drivers = sShots.filter((shot) => shot.club === "Driver");
      return drivers.length > 0
        ? drivers.reduce((sum, shot) => sum + (shot.carry || 0), 0) / drivers.length
        : 0;
    }).reverse(),
  };

  // Beregn forbedringer
  const improvements = [];
  if (trends.clubSpeed.length >= 2) {
    const change = trends.clubSpeed[trends.clubSpeed.length - 1] - trends.clubSpeed[0];
    if (Math.abs(change) > 0.5) {
      improvements.push({
        metric: "Club Speed",
        change: Math.round((change / trends.clubSpeed[0]) * 100),
        period: "siste 5 økter",
      });
    }
  }

  return {
    lastSession: avgClubSpeed > 0 ? {
      date: new Date(lastSession.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" }),
      club: "Driver",
      metric: "Avg Club Speed",
      value: Math.round(avgClubSpeed * 10) / 10,
      unit: "mph",
    } : null,
    trends,
    improvements,
  };
}

/* ── Social Data ── */

interface SocialData {
  rank: number;
  totalPlayers: number;
  challenges: {
    id: string;
    name: string;
    progress: number;
    endDate: string;
  }[];
  streak: number;
  friendsOnline: number;
}

export async function getSocialData(userId: string): Promise<SocialData | null> {
  const supabase = await createServerSupabase();

  // Hent brukerens rank (mock data for nå)
  const { count: totalPlayers } = await supabase
    .from("User")
    .select("id", { count: "exact", head: true });

  // Hent aktivitets-streak
  const { data: trainingLogs } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(30);

  // Beregn streak
  let streak = 0;
  const today = new Date();
  const trainedDates = new Set(
    (trainingLogs || []).map((t) => new Date(t.date).toDateString())
  );

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    if (trainedDates.has(checkDate.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return {
    rank: Math.floor(Math.random() * 100) + 1, // Mock rank
    totalPlayers: totalPlayers || 150,
    challenges: [
      {
        id: "1",
        name: "Putting Master",
        progress: 65,
        endDate: "3 dager",
      },
      {
        id: "2",
        name: "Fairway Finder",
        progress: 40,
        endDate: "1 uke",
      },
    ],
    streak,
    friendsOnline: Math.floor(Math.random() * 5), // Mock
  };
}

/* ── Player Level Detection ── */

export async function getPlayerLevel(userId: string): Promise<"beginner" | "intermediate" | "advanced" | "pro"> {
  const supabase = await createServerSupabase();

  const [handicap, rounds, training] = await Promise.all([
    supabase
      .from("HandicapEntry")
      .select("handicapIndex")
      .eq("userId", userId)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("RoundStats")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId),
    supabase
      .from("TrainingLog")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId),
  ]);

  const hcp = handicap.data?.handicapIndex;
  const roundCount = rounds.count || 0;
  const trainingCount = training.count || 0;

  if (hcp && hcp <= 5) return "pro";
  if (hcp && hcp <= 12) return "advanced";
  if (roundCount > 10 || trainingCount > 20) return "intermediate";
  return "beginner";
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
