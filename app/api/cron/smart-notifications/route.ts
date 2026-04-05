import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyCronAuth } from "@/lib/cron-auth";
import { prisma } from "@/lib/portal/prisma";
import { createNotification } from "@/lib/portal/notifications";
import type { NotificationType } from "@prisma/client";

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
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        role: { in: ["STUDENT", "ADMIN", "INSTRUCTOR"] },
      },
      select: {
        id: true,
        name: true,
      },
    });

    for (const user of users) {
      try {
        await processUserNotifications(user.id, user.name, todayStart, results);
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
  userId: string,
  type: NotificationType,
  todayStart: Date
): Promise<boolean> {
  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      type,
      createdAt: { gte: todayStart },
    },
    select: { id: true },
  });
  return existing !== null;
}

async function processUserNotifications(
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
  const lastLog = await prisma.trainingLog.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (lastLog && lastLog.date < sevenDaysAgo) {
    const daysInactive = Math.floor(
      (now.getTime() - lastLog.date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (!(await hasNotificationToday(userId, "TRAINING_REMINDER", todayStart))) {
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
  const logsLastWeek = await prisma.trainingLog.count({
    where: {
      userId,
      date: { gte: mondayLastWeek, lte: sundayLastWeek },
    },
  });

  const logsThisWeek = await prisma.trainingLog.count({
    where: {
      userId,
      date: { gte: mondayThisWeek },
    },
  });

  if (logsLastWeek >= 3 && logsThisWeek === 0) {
    if (!(await hasNotificationToday(userId, "TRAINING_REMINDER", todayStart))) {
      // Only send if we didn't already send an inactivity notification
      const alreadySent = await hasNotificationToday(userId, "TRAINING_REMINDER", todayStart);
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
  const latestRounds = await prisma.roundStats.findMany({
    where: { userId, sgTotal: { not: null } },
    orderBy: { date: "desc" },
    take: 10,
    select: {
      date: true,
      totalScore: true,
      sgTotal: true,
      courseName: true,
    },
  });

  if (latestRounds.length >= 3) {
    const latest = latestRounds[0];
    const previousRounds = latestRounds.slice(1);
    const avgSg =
      previousRounds.reduce((sum, r) => sum + (r.sgTotal ?? 0), 0) /
      previousRounds.length;

    // Only check rounds from the last 3 days to avoid re-notifying
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    if (
      latest.sgTotal !== null &&
      latest.sgTotal > avgSg + 0.5 &&
      latest.date > threeDaysAgo
    ) {
      if (!(await hasNotificationToday(userId, "GENERAL", todayStart))) {
        await createNotification({
          userId,
          type: "GENERAL",
          title: "Sterk runde",
          message: `${latest.totalScore ? `Score ${latest.totalScore}` : "Din siste runde"}${latest.courseName ? ` pa ${latest.courseName}` : ""} var over gjennomsnittet ditt. SG Total: ${latest.sgTotal.toFixed(1)} (snitt: ${avgSg.toFixed(1)}).`,
          linkUrl: "/portal/statistikk",
        });
        results.roundImprovement++;
      }
    }
  }

  // 4. TOURNAMENT APPROACHING: Tournament in next 7 days
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTournaments = await prisma.playerTournamentPlan.findMany({
    where: {
      studentId: userId,
      Tournament: {
        startDate: { gte: todayStart, lte: sevenDaysFromNow },
      },
    },
    include: {
      Tournament: { select: { name: true, startDate: true } },
    },
  });

  for (const tp of upcomingTournaments) {
    const daysUntil = Math.ceil(
      (tp.Tournament.startDate.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (
      !(await hasNotificationToday(
        userId,
        "TOURNAMENT_REMINDER",
        todayStart
      ))
    ) {
      await createNotification({
        userId,
        type: "TOURNAMENT_REMINDER",
        title: "Turnering snart",
        message: `${tp.Tournament.name} starter om ${daysUntil} ${daysUntil === 1 ? "dag" : "dager"}. Fokuser pa turneringsforberedelser.`,
        linkUrl: "/portal/turneringsplan",
      });
      results.tournamentApproaching++;
      break; // Max one tournament notification per day
    }
  }

  // 5. HANDICAP MILESTONE: Crossed a whole number
  const latestHandicaps = await prisma.handicapEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 2,
    select: { handicapIndex: true, date: true },
  });

  if (latestHandicaps.length >= 2) {
    const current = latestHandicaps[0];
    const previous = latestHandicaps[1];
    const currentWhole = Math.floor(current.handicapIndex);
    const previousWhole = Math.floor(previous.handicapIndex);

    // Only notify on improvement (lower handicap) crossing a whole number
    if (currentWhole < previousWhole) {
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      if (current.date > threeDaysAgo) {
        if (!(await hasNotificationToday(userId, "GENERAL", todayStart))) {
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
