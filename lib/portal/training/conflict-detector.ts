/**
 * Konfliktdeteksjon for treningsøkter.
 *
 * Sjekker om en planlagt økt overlapper med:
 * - eksisterende coachingbookinger (Booking)
 * - andre planlagte treningsøkter (TrainingPlanSession)
 *
 * Returnerer en advarselstruktur — caller bestemmer om de blokkerer
 * eller bare viser advarsel. Default er kun advarsel.
 */

import { prisma } from "@/lib/portal/prisma";
import { startOfISOWeek } from "date-fns";

export type ConflictKind = "BOOKING" | "TRAINING_SESSION";

export interface ConflictDetail {
  kind: ConflictKind;
  title: string;
  startTime: Date;
  endTime: Date;
  /** Lett-leselig melding for UI */
  message: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: ConflictDetail[];
}

interface DetectInput {
  userId: string;
  /** YYYY-MM-DD */
  date: string;
  startH: number;
  startM: number;
  durationMinutes: number;
  /** Hvis vi redigerer en eksisterende økt, ekskluder den fra sjekken */
  excludeSessionId?: string;
}

/**
 * Bygg DateTime-objekt fra dato + time/minutt.
 */
function buildDateTime(dateStr: string, h: number, m: number): Date {
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * To intervaller overlapper hvis [a.start, a.end) snitter [b.start, b.end).
 */
function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export async function detectSessionConflicts(
  input: DetectInput
): Promise<ConflictResult> {
  const start = buildDateTime(input.date, input.startH, input.startM);
  const end = new Date(start.getTime() + input.durationMinutes * 60_000);

  // 1) Coachingbookinger samme dag
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [{ studentId: input.userId }, { instructorId: input.userId }],
      startTime: { gte: dayStart, lte: dayEnd },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      ServiceType: { select: { name: true } },
    },
  });

  const conflicts: ConflictDetail[] = [];

  for (const b of bookings) {
    if (overlaps(start, end, b.startTime, b.endTime)) {
      const time = `${b.startTime.toTimeString().slice(0, 5)}-${b.endTime
        .toTimeString()
        .slice(0, 5)}`;
      conflicts.push({
        kind: "BOOKING",
        title: b.ServiceType?.name ?? "Coachingbooking",
        startTime: b.startTime,
        endTime: b.endTime,
        message: `Du har en coachingbooking ${time} samme dag.`,
      });
    }
  }

  // 2) Andre planlagte treningsøkter samme uke + dag
  const weekStart = startOfISOWeek(start);
  const day = start.getDay();
  const dayOfWeek = day === 0 ? 7 : day;

  const sessions = await prisma.trainingPlanSession.findMany({
    where: {
      ...(input.excludeSessionId ? { NOT: { id: input.excludeSessionId } } : {}),
      dayOfWeek,
      TrainingPlanWeek: {
        weekStart: weekStart,
        TrainingPlan: { studentId: input.userId, isActive: true },
      },
    },
    select: {
      id: true,
      title: true,
      durationMinutes: true,
      exercises: true,
    },
  });

  for (const s of sessions) {
    // Hent start-tid fra exercises-metadata
    const meta = Array.isArray(s.exercises)
      ? (s.exercises as Record<string, unknown>[]).find(
          (e) => e._startH !== undefined
        )
      : null;
    const sH = meta?._startH != null ? Number(meta._startH) : 9;
    const sM = meta?._startM != null ? Number(meta._startM) : 0;
    const sStart = buildDateTime(input.date, sH, sM);
    const sEnd = new Date(
      sStart.getTime() + (s.durationMinutes ?? 60) * 60_000
    );

    if (overlaps(start, end, sStart, sEnd)) {
      const time = `${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}`;
      conflicts.push({
        kind: "TRAINING_SESSION",
        title: s.title,
        startTime: sStart,
        endTime: sEnd,
        message: `«${s.title}» er allerede planlagt kl. ${time} (${s.durationMinutes ?? 60} min).`,
      });
    }
  }

  return { hasConflict: conflicts.length > 0, conflicts };
}
