/**
 * Per-trening RSVP for gruppe-økter (Fase H).
 *
 * Spilleren ser kommende gruppe-økter hen er medlem i, og kan si "ja" eller
 * "nei" til hver enkelt forekomst. Default = "GOING" (ingen handling = forventet
 * deltakelse). "DECLINED" skjuler økten fra spillerens treningsplan-visning.
 */

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { expandGroupSession } from "./group-rrule";

export type RSVPStatus = "GOING" | "DECLINED" | "PENDING";

export interface UpcomingGroupSessionItem {
  sessionId: string;
  occurrenceDate: string; // YYYY-MM-DD
  groupId: string;
  groupName: string;
  title: string;
  description: string | null;
  start: Date;
  end: Date;
  locationId: string | null;
  locationName: string | null;
  isCancelled: boolean;
  rsvpStatus: RSVPStatus;
  rsvpNote: string | null;
}

function isoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Hent alle kommende gruppe-økter for en spiller mellom `from` og `to`.
 * Inkluderer RSVP-status der spilleren har respondert.
 *
 * Default-status er "GOING" hvis ingen RSVP-rad finnes — spilleren forventes
 * å delta inntil de aktivt sier nei.
 */
export async function getUpcomingGroupSessionsForUser(
  userId: string,
  from: Date,
  to: Date,
): Promise<UpcomingGroupSessionItem[]> {
  // 1. Hent alle grupper spilleren er medlem av
  const memberships = await prisma.groupMembership.findMany({
    where: { userId },
    select: { groupId: true },
  });
  const groupIds = memberships.map((m) => m.groupId);
  if (groupIds.length === 0) return [];

  // 2. Hent alle aktive sesjoner i disse gruppene
  const sessions = await prisma.groupSession.findMany({
    where: { groupId: { in: groupIds }, isActive: true },
    include: {
      Group: { select: { id: true, name: true } },
      Location: { select: { id: true, name: true } },
    },
  });

  // 3. Ekspander hver sesjon mot vinduet
  const items: UpcomingGroupSessionItem[] = [];
  for (const s of sessions) {
    const expanded = await expandGroupSession(s.id, from, to);
    if (!expanded) continue;
    for (const occ of expanded.occurrences) {
      items.push({
        sessionId: s.id,
        occurrenceDate: isoDate(occ.scheduledStart),
        groupId: s.Group.id,
        groupName: s.Group.name,
        title: s.title,
        description: s.description,
        start: occ.start,
        end: occ.end,
        locationId: occ.locationId,
        locationName: s.Location?.name ?? null,
        isCancelled: occ.isCancelled,
        rsvpStatus: "GOING",
        rsvpNote: null,
      });
    }
  }

  if (items.length === 0) return [];

  // 4. Hent eksisterende RSVPs i ett kall og merge
  const sessionIds = Array.from(new Set(items.map((i) => i.sessionId)));
  const rsvps = await prisma.groupSessionRSVP.findMany({
    where: {
      userId,
      sessionId: { in: sessionIds },
      occurrenceDate: { gte: from, lte: to },
    },
    select: {
      sessionId: true,
      occurrenceDate: true,
      status: true,
      note: true,
    },
  });

  const rsvpMap = new Map<string, { status: string; note: string | null }>();
  for (const r of rsvps) {
    const key = `${r.sessionId}::${isoDate(r.occurrenceDate)}`;
    rsvpMap.set(key, { status: r.status, note: r.note });
  }

  for (const item of items) {
    const key = `${item.sessionId}::${item.occurrenceDate}`;
    const rsvp = rsvpMap.get(key);
    if (rsvp) {
      item.rsvpStatus = (rsvp.status as RSVPStatus) ?? "GOING";
      item.rsvpNote = rsvp.note;
    }
  }

  // 5. Sorter kronologisk + filtrer ut avlyste hvis ønskelig
  return items.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Sett RSVP-status for en spiller på en spesifikk gruppe-økt-forekomst.
 * Upsert — oppretter eller oppdaterer.
 */
export async function setGroupSessionRSVP(input: {
  userId: string;
  sessionId: string;
  occurrenceDate: string; // YYYY-MM-DD
  status: RSVPStatus;
  note?: string;
}): Promise<void> {
  // Verifiser at spilleren er medlem av gruppen som sesjonen tilhører
  const session = await prisma.groupSession.findUnique({
    where: { id: input.sessionId },
    select: { groupId: true },
  });
  if (!session) throw new Error("Gruppe-økt ikke funnet");

  const isMember = await prisma.groupMembership.findFirst({
    where: { groupId: session.groupId, userId: input.userId },
    select: { id: true },
  });
  if (!isMember) {
    throw new Error("Du er ikke medlem av gruppen");
  }

  const date = new Date(`${input.occurrenceDate}T00:00:00.000Z`);

  await prisma.groupSessionRSVP.upsert({
    where: {
      sessionId_userId_occurrenceDate: {
        sessionId: input.sessionId,
        userId: input.userId,
        occurrenceDate: date,
      },
    },
    create: {
      id: randomUUID(),
      sessionId: input.sessionId,
      userId: input.userId,
      occurrenceDate: date,
      status: input.status,
      note: input.note ?? null,
    },
    update: {
      status: input.status,
      note: input.note ?? null,
      respondedAt: new Date(),
    },
  });

  revalidatePath("/portal/treningsplan");
  revalidatePath("/portal");
}
