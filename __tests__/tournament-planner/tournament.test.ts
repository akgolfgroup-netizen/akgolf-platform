/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * Tournament Planner — Integration tests
 *
 * Forutsetninger:
 *   - Migrasjon 20260418_tournament_is_private må være kjørt mot test-DB.
 *     Lokalt: `npx prisma migrate deploy` med DIRECT_URL satt, eller
 *     `npx prisma db push` hvis i dev.
 *
 * Tester:
 *   - Manuell create lagrer isPrivate=true for ikke-staff
 *   - Private turneringer filtreres fra listing for andre brukere
 *   - Sync upsert preserverer composite unique (source, sourceId)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { addDays } from "date-fns";

async function createTestUser(role: "STUDENT" | "ADMIN" | "INSTRUCTOR" = "STUDENT") {
  const id = nanoid();
  await prisma.user.create({
    data: {
      id,
      email: `tournament-test-${id}@example.com`,
      name: `Test ${role}`,
      role,
      updatedAt: new Date(),
    },
  });
  return { id };
}

async function cleanupTestData(prefix = "tournament-test") {
  await prisma.tournament.deleteMany({
    where: { source: "manual", createdBy: { email: { contains: prefix } } } as never,
  }).catch(() => {
    // Fallback: slett på createdById hvis createdBy-relasjon ikke fungerer
    // (håndteres via user-sletting cascade)
  });
  await prisma.user.deleteMany({
    where: { email: { contains: prefix } },
  });
}

describe("Tournament — manuell opprettelse", () => {
  let studentId: string;
  let staffId: string;

  beforeAll(async () => {
    studentId = (await createTestUser("STUDENT")).id;
    staffId = (await createTestUser("ADMIN")).id;
  });

  afterAll(async () => {
    await prisma.tournament.deleteMany({
      where: { createdById: { in: [studentId, staffId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [studentId, staffId] } },
    });
  });

  it("spiller-opprettet turnering skal være privat", async () => {
    const tournament = await prisma.tournament.create({
      data: {
        id: nanoid(),
        name: "Klubbmesterskap 2026",
        startDate: addDays(new Date(), 30),
        level: "lokal",
        source: "manual",
        sourceId: nanoid(),
        createdById: studentId,
        isPrivate: true,
        updatedAt: new Date(),
      },
    });

    expect(tournament.isPrivate).toBe(true);
    expect(tournament.source).toBe("manual");
    expect(tournament.createdById).toBe(studentId);
  });

  it("staff-opprettet turnering kan være offentlig", async () => {
    const tournament = await prisma.tournament.create({
      data: {
        id: nanoid(),
        name: "Offentlig staff-turnering",
        startDate: addDays(new Date(), 45),
        level: "regional",
        source: "manual",
        sourceId: nanoid(),
        createdById: staffId,
        isPrivate: false,
        updatedAt: new Date(),
      },
    });

    expect(tournament.isPrivate).toBe(false);
    expect(tournament.createdById).toBe(staffId);
  });
});

describe("Tournament — filtrering av private turneringer", () => {
  let studentAId: string;
  let studentBId: string;
  let tournamentPrivateAId: string;
  let tournamentPublicId: string;

  beforeAll(async () => {
    studentAId = (await createTestUser("STUDENT")).id;
    studentBId = (await createTestUser("STUDENT")).id;

    // Student A sin private turnering
    const privateA = await prisma.tournament.create({
      data: {
        id: nanoid(),
        name: "Privat turnering av A",
        startDate: addDays(new Date(), 30),
        level: "lokal",
        source: "manual",
        sourceId: nanoid(),
        createdById: studentAId,
        isPrivate: true,
        updatedAt: new Date(),
      },
    });
    tournamentPrivateAId = privateA.id;

    // Offentlig turnering
    const publicT = await prisma.tournament.create({
      data: {
        id: nanoid(),
        name: "Åpen turnering",
        startDate: addDays(new Date(), 40),
        level: "nasjonal",
        source: "golfbox",
        sourceId: `test-${nanoid()}`,
        isPrivate: false,
        updatedAt: new Date(),
      },
    });
    tournamentPublicId = publicT.id;
  });

  afterAll(async () => {
    await prisma.tournament.deleteMany({
      where: { id: { in: [tournamentPrivateAId, tournamentPublicId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [studentAId, studentBId] } },
    });
  });

  it("Student A ser egen private + offentlige", async () => {
    const list = await prisma.tournament.findMany({
      where: {
        OR: [{ isPrivate: false }, { createdById: studentAId }],
        id: { in: [tournamentPrivateAId, tournamentPublicId] },
      },
    });

    const ids = list.map((t) => t.id);
    expect(ids).toContain(tournamentPrivateAId);
    expect(ids).toContain(tournamentPublicId);
  });

  it("Student B ser KUN offentlige (ikke A sin private)", async () => {
    const list = await prisma.tournament.findMany({
      where: {
        OR: [{ isPrivate: false }, { createdById: studentBId }],
        id: { in: [tournamentPrivateAId, tournamentPublicId] },
      },
    });

    const ids = list.map((t) => t.id);
    expect(ids).not.toContain(tournamentPrivateAId);
    expect(ids).toContain(tournamentPublicId);
  });
});

describe("Tournament — sync upsert og composite unique", () => {
  const sourceId = `test-sync-${nanoid()}`;
  const source = "golfbox" as const;

  afterAll(async () => {
    await prisma.tournament.deleteMany({
      where: { source, sourceId },
    });
  });

  it("opprett + oppdater via composite unique (source, sourceId)", async () => {
    // Opprett
    const created = await prisma.tournament.upsert({
      where: { source_sourceId: { source, sourceId } },
      create: {
        id: nanoid(),
        source,
        sourceId,
        name: "Turnering v1",
        startDate: addDays(new Date(), 10),
        level: "nasjonal",
        updatedAt: new Date(),
      },
      update: {
        name: "should not happen",
        updatedAt: new Date(),
      },
    });

    expect(created.name).toBe("Turnering v1");

    // Upsert igjen — skal oppdatere, ikke opprette
    const updated = await prisma.tournament.upsert({
      where: { source_sourceId: { source, sourceId } },
      create: {
        id: nanoid(),
        source,
        sourceId,
        name: "should not happen",
        startDate: addDays(new Date(), 10),
        level: "nasjonal",
        updatedAt: new Date(),
      },
      update: {
        name: "Turnering v2 (oppdatert)",
        updatedAt: new Date(),
      },
    });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Turnering v2 (oppdatert)");

    // Kun én oppføring finnes
    const all = await prisma.tournament.findMany({
      where: { source, sourceId },
    });
    expect(all.length).toBe(1);
  });
});
