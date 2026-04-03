import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { WinBackDay3Email } from "@/lib/portal/email/templates/win-back-day3";
import { WinBackDay7Email } from "@/lib/portal/email/templates/win-back-day7";
import { WinBackDay14Email } from "@/lib/portal/email/templates/win-back-day14";
import { subDays, format } from "date-fns";
import { nb } from "date-fns/locale";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

/**
 * Cron job: runs daily at 09:00 UTC
 * Sends win-back emails to inactive users:
 * - Day 3: "Vi savner deg"
 * - Day 7: "Din streak venter"
 * - Day 14: "20% rabatt på Pro"
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const day3Threshold = subDays(now, 3);
  const day7Threshold = subDays(now, 7);
  const day14Threshold = subDays(now, 14);

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  let sent = 0;
  let errors = 0;

  // Get users who need win-back emails
  // Step 0: Users with no activity in 3+ days and winBackEmailStep = 0
  // Step 1: Users with no activity in 7+ days and winBackEmailStep = 1
  // Step 2: Users with no activity in 14+ days and winBackEmailStep = 2

  // Step 0 → 1: Day 3 email
  const step0Users = await prisma.user.findMany({
    where: {
      isActive: true,
      email: { not: null },
      role: "STUDENT",
      winBackEmailStep: 0,
      subscriptionTier: { in: ["VISITOR", "ACADEMY"] }, // Only free users
      lastActiveAt: { lt: day3Threshold },
    },
    select: { id: true, name: true, email: true, lastActiveAt: true },
    take: 50, // Process in batches
  });

  for (const user of step0Users) {
    if (!user.email) continue;

    try {
      // Get streak
      const streak = await getStreak(user.id);
      const lastActiveDate = user.lastActiveAt
        ? format(user.lastActiveAt, "d. MMMM", { locale: nb })
        : "en stund siden";

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Vi savner deg i treningsdagboken!",
        react: WinBackDay3Email({
          name: user.name || "Hei",
          lastActiveDate,
          streak,
        }),
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { winBackEmailStep: 1 },
      });

      sent++;
    } catch (error) {
      logger.error(`[Cron] Win-back day 3 failed for user ${user.id}:`, error);
      errors++;
    }
  }

  // Step 1 → 2: Day 7 email
  const step1Users = await prisma.user.findMany({
    where: {
      isActive: true,
      email: { not: null },
      role: "STUDENT",
      winBackEmailStep: 1,
      subscriptionTier: { in: ["VISITOR", "ACADEMY"] },
      lastActiveAt: { lt: day7Threshold },
    },
    select: { id: true, name: true, email: true },
    take: 50,
  });

  for (const user of step1Users) {
    if (!user.email) continue;

    try {
      const [totalSessions, bestStreak] = await Promise.all([
        prisma.trainingLog.count({ where: { userId: user.id } }),
        getBestStreak(user.id),
      ]);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Din treningsreise venter pa deg",
        react: WinBackDay7Email({
          name: user.name || "Hei",
          totalSessions,
          bestStreak,
        }),
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { winBackEmailStep: 2 },
      });

      sent++;
    } catch (error) {
      logger.error(`[Cron] Win-back day 7 failed for user ${user.id}:`, error);
      errors++;
    }
  }

  // Step 2 → 3: Day 14 email with discount
  const step2Users = await prisma.user.findMany({
    where: {
      isActive: true,
      email: { not: null },
      role: "STUDENT",
      winBackEmailStep: 2,
      subscriptionTier: { in: ["VISITOR", "ACADEMY"] },
      lastActiveAt: { lt: day14Threshold },
    },
    select: { id: true, name: true, email: true },
    take: 50,
  });

  for (const user of step2Users) {
    if (!user.email) continue;

    try {
      // Generate unique discount code
      const discountCode = `WINBACK-${nanoid(8).toUpperCase()}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "20% rabatt pa Pro — kun for deg!",
        react: WinBackDay14Email({
          name: user.name || "Hei",
          discountCode,
          discountPercent: 20,
        }),
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { winBackEmailStep: 3 }, // Done with sequence
      });

      sent++;
    } catch (error) {
      logger.error(`[Cron] Win-back day 14 failed for user ${user.id}:`, error);
      errors++;
    }
  }

  // Reset users who have become active again
  const activeAgain = await prisma.user.updateMany({
    where: {
      winBackEmailStep: { gt: 0 },
      lastActiveAt: { gte: day3Threshold },
    },
    data: { winBackEmailStep: 0 },
  });

  logger.info(
    `[Cron] Win-back: ${sent} emails sent, ${errors} errors, ${activeAgain.count} users reset`
  );

  return NextResponse.json({
    ok: true,
    sent,
    errors,
    reset: activeAgain.count,
    timestamp: now.toISOString(),
  });
}

async function getStreak(userId: string): Promise<number> {
  const logs = await prisma.trainingLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  if (logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0])),
  ]
    .sort()
    .reverse();

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

async function getBestStreak(userId: string): Promise<number> {
  const logs = await prisma.trainingLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  if (logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0])),
  ].sort();

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);

    if (diff === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return bestStreak;
}
