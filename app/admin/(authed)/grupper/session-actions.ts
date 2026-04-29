"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { expandGroupSession, type ExpandedGroupSession } from "@/lib/booking-v2/group-rrule";

export interface GroupSessionRow {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  locationId: string | null;
  startTime: Date;
  endTime: Date;
  recurrenceRule: string | null;
  recurrenceUntil: Date | null;
  isActive: boolean;
}

async function requireStaff() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

/**
 * Sjekk at innlogget bruker er ADMIN, eller at gruppens coach er den innloggede brukeren.
 */
async function assertCanEditGroup(groupId: string) {
  const user = await requireStaff();
  if (user.role === "ADMIN") return;
  const group = await prisma.trainingGroup.findUnique({
    where: { id: groupId },
    select: { coachId: true },
  });
  if (!group || group.coachId !== user.id) {
    throw new Error("Kun gruppens coach kan redigere økter");
  }
}

export async function listGroupSessions(groupId: string): Promise<GroupSessionRow[]> {
  await requireStaff();
  return prisma.groupSession.findMany({
    where: { groupId },
    orderBy: { startTime: "asc" },
  });
}

export interface CreateGroupSessionInput {
  groupId: string;
  title: string;
  description?: string;
  locationId?: string;
  /** ISO-streng — første økt-start */
  startTime: string;
  /** ISO-streng — første økt-slutt */
  endTime: string;
  /** RRULE-streng (uten DTSTART). F.eks. "FREQ=WEEKLY;BYDAY=TU" */
  recurrenceRule?: string;
  /** ISO-dato — siste tillatte dato (valgfri) */
  recurrenceUntil?: string;
}

export async function createGroupSession(
  input: CreateGroupSessionInput,
): Promise<{ id: string }> {
  await assertCanEditGroup(input.groupId);

  if (!input.title.trim()) throw new Error("Tittel kreves");
  const start = new Date(input.startTime);
  const end = new Date(input.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Ugyldig dato/tid");
  }
  if (end <= start) throw new Error("Slutt må være etter start");

  const id = randomUUID();
  await prisma.groupSession.create({
    data: {
      id,
      groupId: input.groupId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      locationId: input.locationId || null,
      startTime: start,
      endTime: end,
      recurrenceRule: input.recurrenceRule?.trim() || null,
      recurrenceUntil: input.recurrenceUntil
        ? new Date(input.recurrenceUntil)
        : null,
      isActive: true,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/grupper");
  updateTag("group-sessions");
  return { id };
}

export async function updateGroupSession(input: {
  id: string;
  title?: string;
  description?: string | null;
  locationId?: string | null;
  startTime?: string;
  endTime?: string;
  recurrenceRule?: string | null;
  recurrenceUntil?: string | null;
  isActive?: boolean;
}): Promise<void> {
  const session = await prisma.groupSession.findUnique({
    where: { id: input.id },
    select: { groupId: true },
  });
  if (!session) throw new Error("Økt ikke funnet");
  await assertCanEditGroup(session.groupId);

  await prisma.groupSession.update({
    where: { id: input.id },
    data: {
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.description !== undefined && {
        description: input.description?.trim() || null,
      }),
      ...(input.locationId !== undefined && { locationId: input.locationId }),
      ...(input.startTime && { startTime: new Date(input.startTime) }),
      ...(input.endTime && { endTime: new Date(input.endTime) }),
      ...(input.recurrenceRule !== undefined && {
        recurrenceRule: input.recurrenceRule?.trim() || null,
      }),
      ...(input.recurrenceUntil !== undefined && {
        recurrenceUntil: input.recurrenceUntil
          ? new Date(input.recurrenceUntil)
          : null,
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/grupper");
  updateTag("group-sessions");
}

export async function deleteGroupSession(sessionId: string): Promise<void> {
  const session = await prisma.groupSession.findUnique({
    where: { id: sessionId },
    select: { groupId: true },
  });
  if (!session) return;
  await assertCanEditGroup(session.groupId);

  await prisma.groupSession.delete({ where: { id: sessionId } });
  revalidatePath("/admin/grupper");
  updateTag("group-sessions");
}

/**
 * Avlys eller flytt EN enkelt forekomst (uten å påvirke serien).
 * Lager/oppdaterer GroupSessionOccurrence.
 */
export async function setOccurrenceOverride(input: {
  sessionId: string;
  /** ISO-dato (YYYY-MM-DD) — den opprinnelige planlagte datoen */
  originalDate: string;
  isCancelled?: boolean;
  overrideStartTime?: string | null;
  overrideEndTime?: string | null;
  overrideLocationId?: string | null;
  note?: string | null;
}): Promise<void> {
  const session = await prisma.groupSession.findUnique({
    where: { id: input.sessionId },
    select: { groupId: true },
  });
  if (!session) throw new Error("Økt ikke funnet");
  await assertCanEditGroup(session.groupId);

  const date = new Date(`${input.originalDate}T00:00:00.000Z`);

  await prisma.groupSessionOccurrence.upsert({
    where: {
      sessionId_originalDate: {
        sessionId: input.sessionId,
        originalDate: date,
      },
    },
    create: {
      id: randomUUID(),
      sessionId: input.sessionId,
      originalDate: date,
      isCancelled: input.isCancelled ?? false,
      overrideStartTime: input.overrideStartTime
        ? new Date(input.overrideStartTime)
        : null,
      overrideEndTime: input.overrideEndTime
        ? new Date(input.overrideEndTime)
        : null,
      overrideLocationId: input.overrideLocationId ?? null,
      note: input.note ?? null,
    },
    update: {
      ...(input.isCancelled !== undefined && {
        isCancelled: input.isCancelled,
      }),
      ...(input.overrideStartTime !== undefined && {
        overrideStartTime: input.overrideStartTime
          ? new Date(input.overrideStartTime)
          : null,
      }),
      ...(input.overrideEndTime !== undefined && {
        overrideEndTime: input.overrideEndTime
          ? new Date(input.overrideEndTime)
          : null,
      }),
      ...(input.overrideLocationId !== undefined && {
        overrideLocationId: input.overrideLocationId,
      }),
      ...(input.note !== undefined && { note: input.note }),
    },
  });

  revalidatePath("/admin/grupper");
  updateTag("group-sessions");
}

/**
 * Hent ekspandert sesjon for et datovindu — brukes av kalendervisning.
 */
export async function getExpandedGroupSessions(input: {
  groupId: string;
  from: string;
  to: string;
}): Promise<ExpandedGroupSession[]> {
  await requireStaff();
  const sessions = await prisma.groupSession.findMany({
    where: { groupId: input.groupId, isActive: true },
    select: { id: true },
  });
  const fromDate = new Date(input.from);
  const toDate = new Date(input.to);

  const expanded = await Promise.all(
    sessions.map((s) => expandGroupSession(s.id, fromDate, toDate)),
  );
  return expanded.filter((s): s is ExpandedGroupSession => s !== null);
}
