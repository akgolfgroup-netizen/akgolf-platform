import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { createNotification } from "@/lib/portal/notifications";
import {
  generateWeeklyInsight,
  saveWeeklyInsight,
} from "@/lib/portal/ai/weekly-insights";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutter for AI-generering

/**
 * Cron job: runs every Monday at 06:00 UTC
 * Generates weekly AI insights for active users
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fourteenDaysAgo = subDays(now, 14);
  const sevenDaysAgo = subDays(now, 7);

  // Finn aktive brukere:
  // - Innlogget siste 14 dager
  // - Har minst 1 treningslogg siste 7 dager ELLER minst 1 runde siste 30 dager
  // - Ikke fått AI-innsikt denne uken
  const users = await prisma.user.findMany({
    where: {
      AND: [
        { isActive: true },
        { role: "STUDENT" },
        { lastActiveAt: { gte: fourteenDaysAgo } },
        // Har treningsdata
        {
          OR: [
            {
              TrainingLog: {
                some: { date: { gte: sevenDaysAgo } },
              },
            },
            {
              RoundStats: {
                some: { date: { gte: subDays(now, 30) } },
              },
            },
          ],
        },
        // Ikke generert nylig
        {
          OR: [
            { aiInsightGeneratedAt: null },
            { aiInsightGeneratedAt: { lt: sevenDaysAgo } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
    },
  });

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    try {
      const insight = await generateWeeklyInsight(user.id);

      if (!insight) {
        skipped++;
        continue;
      }

      // Lagre innsikt
      await saveWeeklyInsight(user.id, insight);

      // Opprett in-app notifikasjon
      await createNotification({
        userId: user.id,
        type: "AI_INSIGHT",
        title: "Ny ukentlig innsikt",
        message: insight.summary.slice(0, 100) + (insight.summary.length > 100 ? "..." : ""),
        linkUrl: "/portal/profil",
      });

      generated++;
    } catch (error) {
      console.error(`[AI Insights] Failed for user ${user.id}:`, error);
      errors++;
    }
  }

  console.log(
    `[AI Insights] Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`
  );

  return NextResponse.json({
    ok: true,
    generated,
    skipped,
    errors,
    timestamp: now.toISOString(),
  });
}
