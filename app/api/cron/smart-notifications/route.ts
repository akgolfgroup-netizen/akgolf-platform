import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/portal/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron: Smarte varsler basert pa brukeraktivitet og prestasjoner.
 * Kjores daglig kl 08:00 (Europe/Oslo).
 *
 * Sjekker for:
 * 1. Inaktivitet — ingen trening pa 7+ dager
 * 2. Streak i fare — aktiv forrige uke, ingen trening denne uken
 * 3. Rundebedring — siste runde slatt gjennomsnittet
 * 4. Turnering narmer seg — turnering om 7 dager eller mindre
 * 5. Handicap-milepael — handicap krysset heltall
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const results = {
    inactivity: 0,
    streakAtRisk: 0,
    roundImprovement: 0,
    tournamentApproaching: 0,
    handicapMilestone: 0,
    errors: 0,
  };

  try {
    // Get all active users with recent activity data
    const { data: users, error: usersError } = await supabase
      .from("User")
      .select("id, name")
      .eq("isActive", true)
      .in("role", ["STUDENT", "ADMIN", "INSTRUCTOR"]);

    if (usersError) {
      throw usersError;
    }

    for (const user of (users ?? [])) {
      try {
        await processUserNotifications(supabase, user.id, user.name, todayStart, results);
      } catch (userError) {
        logger.error(
          `[smart-notifications] Feil for bruker ${user.id}:`,
          { error: userError instanceof Error ? userError.message : "Unknown" }
        );
        results.errors++;
      }
    }

    logger.info(`[smart-notifications] Fullfort`, { results });

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (error) {
    logger.error("[smart-notifications] Uventet feil:", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Intern feil i smart-notifications cron" },
      { status: 500 }
    );
  }
}

async function hasNotificationToday(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  type: string,
  todayStart: Date
): Promise<boolean> {
  const { data: existing, error } = await supabase
    .from("Notification")
    .select("id")
    .eq("userId", userId)
    .eq("type", type)
    .gte("createdAt", todayStart.toISOString())
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return existing !== null;
}

async function processUserNotifications(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  userName: string | null,
  todayStart: Date,
  results: {
    inactivity: number;
    streakAtRisk: number;
    roundImprovement: number;
    tournamentApproaching: number;
    handicapMilestone: number;
    errors: number;
  }
) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const mondayThisWeek = getMonday(now);
  const mondayLastWeek = new Date(mondayThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sundayLastWeek = new Date(mondayThisWeek.getTime() - 1);

  // 1. INACTIVITY: No training in 7+ days
  const { data: lastLog, error: logError } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (logError && logError.code !== "PGRST116") {
    throw logError;
  }

  if (lastLog && new Date(lastLog.date) < sevenDaysAgo) {
    const daysInactive = Math.floor(
      (now.getTime() - new Date(lastLog.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (!(await hasNotificationToday(supabase, userId, "TRAINING_REMINDER", todayStart))) {
      await createNotification({
        userId,
        type: "TRAINING_REMINDER",
        title: "Tid for trening",
        message: `Du har ikke trent pa ${daysInactive} dager. Regelmessig trening er avgjorende for fremgang.`,
        linkUrl: "/portal/dagbok",
      });
      results.inactivity++;
    }
  }

  // 2. STREAK AT RISK: Active last week, nothing this week
  const { count: logsLastWeek, error: lastWeekError } = await supabase
    .from("TrainingLog")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .gte("date", mondayLastWeek.toISOString())
    .lte("date", new Date(sundayLastWeek.getTime() + 86400000).toISOString());

  if (lastWeekError) {
    throw lastWeekError;
  }

  const { count: logsThisWeek, error: thisWeekError } = await supabase
    .from("TrainingLog")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .gte("date", mondayThisWeek.toISOString());

  if (thisWeekError) {
    throw thisWeekError;
  }

  if ((logsLastWeek ?? 0) >= 3 && (logsThisWeek ?? 0) === 0) {
    if (!(await hasNotificationToday(supabase, userId, "TRAINING_REMINDER", todayStart))) {
      // Only send if we didn't already send an inactivity notification
      const alreadySent = await hasNotificationToday(supabase, userId, "TRAINING_REMINDER", todayStart);
      if (!alreadySent) {
        await createNotification({
          userId,
          type: "TRAINING_REMINDER",
          title: "Treningsstreken er i fare",
          message: `Du trente ${logsLastWeek} ganger forrige uke, men har ingen okter denne uken enna. Hold momentumet oppe.`,
          linkUrl: "/portal/dagbok",
        });
        results.streakAtRisk++;
      }
    }
  }

  // 3. ROUND IMPROVEMENT: Latest round beat the average
  const { data: latestRounds, error: roundsError } = await supabase
    .from("RoundStats")
    .select("date, totalScore, sgTotal, courseName")
    .eq("userId", userId)
    .not("sgTotal", "is", null)
    .order("date", { ascending: false })
    .limit(10);

  if (roundsError) {
    throw roundsError;
  }

  if (latestRounds && latestRounds.length >= 3) {
    const latest = latestRounds[0];
    const previousRounds = latestRounds.slice(1);
    const avgSg =
      previousRounds.reduce((sum, r) => sum + ((r.sgTotal as number) ?? 0), 0) /
      previousRounds.length;

    // Only check rounds from the last 3 days to avoid re-notifying
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    if (
      latest.sgTotal !== null &&
      (latest.sgTotal as number) > avgSg + 0.5 &&
      new Date(latest.date) > threeDaysAgo
    ) {
      if (!(await hasNotificationToday(supabase, userId, "GENERAL", todayStart))) {
        await createNotification({
          userId,
          type: "GENERAL",
          title: "Sterk runde",
          message: `${latest.totalScore ? `Score ${latest.totalScore}` : "Din siste runde"}${latest.courseName ? ` pa ${latest.courseName}` : ""} var over gjennomsnittet ditt. SG Total: ${(latest.sgTotal as number).toFixed(1)} (snitt: ${avgSg.toFixed(1)}).`,
          linkUrl: "/portal/statistikk",
        });
        results.roundImprovement++;
      }
    }
  }

  // 4. TOURNAMENT APPROACHING: Tournament in next 7 days
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const { data: upcomingTournaments, error: tournamentError } = await supabase
    .from("PlayerTournamentPlan")
    .select(`
      id,
      Tournament (name, startDate)
    `)
    .eq("studentId", userId)
    .gte("Tournament.startDate", todayStart.toISOString())
    .lte("Tournament.startDate", sevenDaysFromNow.toISOString());

  if (tournamentError) {
    throw tournamentError;
  }

  for (const tp of (upcomingTournaments ?? [])) {
    const tournament = (tp as { Tournament?: { name?: string; startDate?: string } }).Tournament;
    if (!tournament?.startDate) continue;

    const daysUntil = Math.ceil(
      (new Date(tournament.startDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (
      !(await hasNotificationToday(supabase, userId, "TOURNAMENT_REMINDER", todayStart))
    ) {
      await createNotification({
        userId,
        type: "TOURNAMENT_REMINDER",
        title: "Turnering snart",
        message: `${tournament.name} starter om ${daysUntil} ${daysUntil === 1 ? "dag" : "dager"}. Fokuser pa turneringsforberedelser.`,
        linkUrl: "/portal/turneringsplan",
      });
      results.tournamentApproaching++;
      break; // Max one tournament notification per day
    }
  }

  // 5. HANDICAP MILESTONE: Crossed a whole number
  const { data: latestHandicaps, error: handicapError } = await supabase
    .from("HandicapEntry")
    .select("handicapIndex, date")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(2);

  if (handicapError) {
    throw handicapError;
  }

  if (latestHandicaps && latestHandicaps.length >= 2) {
    const current = latestHandicaps[0];
    const previous = latestHandicaps[1];
    const currentWhole = Math.floor(current.handicapIndex);
    const previousWhole = Math.floor(previous.handicapIndex);

    // Only notify on improvement (lower handicap) crossing a whole number
    if (currentWhole < previousWhole) {
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      if (new Date(current.date) > threeDaysAgo) {
        if (!(await hasNotificationToday(supabase, userId, "GENERAL", todayStart))) {
          await createNotification({
            userId,
            type: "GENERAL",
            title: "Nytt handicap-niva",
            message: `Handicapet ditt er na ${current.handicapIndex.toFixed(1)}. Du har gatt under ${previousWhole}.0 — sterkt jobbet.`,
            linkUrl: "/portal/statistikk",
          });
          results.handicapMilestone++;
        }
      }
    }
  }
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}
