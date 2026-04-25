import { NextRequest, NextResponse } from "next/server";
import { startOfISOWeek, endOfISOWeek } from "date-fns";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { createNotification } from "@/lib/portal/notifications/create";
import { NotificationType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Cron job: treningspåminnelser
 *
 * Kjøres to ganger per dag:
 * - Morgen (07:00 UTC, ?mode=morning): påminnelse om dagens planlagte økter
 * - Kveld  (19:00 UTC, ?mode=evening): påminnelse om ubesvarte gårsdagsøkter
 *
 * Deduplicate via linkUrl for å unngå dobbel-sending.
 */
export async function GET(req: NextRequest) {
  // Auth via CRON_SECRET
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "morning";

  if (mode === "morning") {
    return await sendMorningReminders();
  }
  if (mode === "evening") {
    return await sendEveningReminders();
  }

  return NextResponse.json({ error: "Ukjent mode" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

/**
 * Morgenpåminnelse: dagens planlagte økter som ikke er logget ennå.
 */
async function sendMorningReminders() {
  const now = new Date();
  const weekStart = startOfISOWeek(now);
  const weekEnd = endOfISOWeek(now);
  const day = now.getDay();
  const dayOfWeek = day === 0 ? 7 : day;

  // Finn alle aktive planer + dagens økter
  const sessions = await prisma.trainingPlanSession.findMany({
    where: {
      dayOfWeek,
      TrainingPlanWeek: {
        weekStart: { gte: weekStart, lte: weekEnd },
        TrainingPlan: { isActive: true },
      },
    },
    select: {
      id: true,
      title: true,
      durationMinutes: true,
      focusArea: true,
      exercises: true,
      TrainingPlanWeek: {
        select: {
          id: true,
          restDays: true,
          TrainingPlan: { select: { studentId: true } },
        },
      },
      TrainingLog: {
        where: { date: { gte: startOfDay(now), lte: endOfDay(now) } },
        select: { id: true },
      },
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const s of sessions) {
    // Skipp hvis allerede logget i dag
    if (s.TrainingLog.length > 0) {
      skipped++;
      continue;
    }

    // Skipp hvis dagen er markert som hviledag
    if (s.TrainingPlanWeek.restDays.includes(dayOfWeek)) {
      skipped++;
      continue;
    }

    const userId = s.TrainingPlanWeek.TrainingPlan.studentId;
    const linkUrl = `/portal/treningsplan/${s.id}`;

    // Dedup: ikke send hvis vi allerede har sendt for samme link i dag
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: NotificationType.TRAINING_REMINDER,
        linkUrl,
        createdAt: { gte: startOfDay(now) },
      },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    // Hent start-tid fra exercises-metadata
    const meta = Array.isArray(s.exercises)
      ? (s.exercises as Record<string, unknown>[]).find(
          (e) => e._startH !== undefined
        )
      : null;
    const sH = meta?._startH != null ? Number(meta._startH) : 9;
    const sM = meta?._startM != null ? Number(meta._startM) : 0;
    const time = `${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}`;

    await createNotification({
      userId,
      type: NotificationType.TRAINING_REMINDER,
      title: "Treningsøkt i dag",
      message: `${s.title} kl. ${time} (${s.durationMinutes ?? 60} min)`,
      linkUrl,
    });
    sent++;
  }

  logger.info(
    `[training-reminders] morning: sent=${sent} skipped=${skipped}`
  );

  return NextResponse.json({
    ok: true,
    mode: "morning",
    sent,
    skipped,
    total: sessions.length,
    timestamp: now.toISOString(),
  });
}

/**
 * Kveldspåminnelse: gårsdagens planlagte økter som ikke ble logget.
 */
async function sendEveningReminders() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekStart = startOfISOWeek(yesterday);
  const weekEnd = endOfISOWeek(yesterday);
  const day = yesterday.getDay();
  const dayOfWeek = day === 0 ? 7 : day;

  const sessions = await prisma.trainingPlanSession.findMany({
    where: {
      dayOfWeek,
      TrainingPlanWeek: {
        weekStart: { gte: weekStart, lte: weekEnd },
        TrainingPlan: { isActive: true },
      },
    },
    select: {
      id: true,
      title: true,
      TrainingPlanWeek: {
        select: {
          restDays: true,
          TrainingPlan: { select: { studentId: true } },
        },
      },
      TrainingLog: {
        where: {
          date: { gte: startOfDay(yesterday), lte: endOfDay(yesterday) },
        },
        select: { id: true },
      },
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const s of sessions) {
    if (s.TrainingLog.length > 0) {
      skipped++;
      continue;
    }
    if (s.TrainingPlanWeek.restDays.includes(dayOfWeek)) {
      skipped++;
      continue;
    }

    const userId = s.TrainingPlanWeek.TrainingPlan.studentId;
    const linkUrl = `/portal/dagbok?from=${s.id}`;

    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: NotificationType.TRAINING_REMINDER,
        linkUrl,
        createdAt: { gte: startOfDay(now) },
      },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await createNotification({
      userId,
      type: NotificationType.TRAINING_REMINDER,
      title: "Logg gårsdagens økt",
      message: `Husk å logge «${s.title}» i treningsdagboka.`,
      linkUrl,
    });
    sent++;
  }

  logger.info(
    `[training-reminders] evening: sent=${sent} skipped=${skipped}`
  );

  return NextResponse.json({
    ok: true,
    mode: "evening",
    sent,
    skipped,
    total: sessions.length,
    timestamp: now.toISOString(),
  });
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
