/**
 * Tester konflikt-detektorens overlappslogikk.
 * Bruker prisma-mock for å isolere tids-aritmetikken.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma BEFORE importing the module
vi.mock("@/lib/portal/prisma", () => ({
  prisma: {
    booking: { findMany: vi.fn() },
    trainingPlanSession: { findMany: vi.fn() },
  },
}));

import { detectSessionConflicts } from "@/lib/portal/training/conflict-detector";
import { prisma } from "@/lib/portal/prisma";

describe("detectSessionConflicts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returnerer ingen konflikt når ingen overlapp finnes", async () => {
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.trainingPlanSession.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const result = await detectSessionConflicts({
      userId: "user-1",
      date: "2026-04-27", // mandag
      startH: 10,
      startM: 0,
      durationMinutes: 60,
    });

    expect(result.hasConflict).toBe(false);
    expect(result.conflicts).toHaveLength(0);
  });

  it("rapporterer booking-konflikt når tider overlapper", async () => {
    const bookingStart = new Date("2026-04-27T10:30:00");
    const bookingEnd = new Date("2026-04-27T11:30:00");

    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: "b1",
        startTime: bookingStart,
        endTime: bookingEnd,
        ServiceType: { name: "Performance" },
      },
    ]);
    (prisma.trainingPlanSession.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const result = await detectSessionConflicts({
      userId: "user-1",
      date: "2026-04-27",
      startH: 10,
      startM: 0,
      durationMinutes: 60, // 10:00-11:00 overlapper med 10:30-11:30
    });

    expect(result.hasConflict).toBe(true);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].kind).toBe("BOOKING");
    expect(result.conflicts[0].title).toBe("Performance");
  });

  it("ignorerer booking som slutter før øktstart", async () => {
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: "b1",
        startTime: new Date("2026-04-27T08:00:00"),
        endTime: new Date("2026-04-27T09:00:00"),
        ServiceType: { name: "Tidlig" },
      },
    ]);
    (prisma.trainingPlanSession.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const result = await detectSessionConflicts({
      userId: "user-1",
      date: "2026-04-27",
      startH: 10,
      startM: 0,
      durationMinutes: 60,
    });

    expect(result.hasConflict).toBe(false);
  });

  it("rapporterer konflikt fra eksisterende treningsøkt", async () => {
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.trainingPlanSession.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: "s1",
        title: "Putting",
        durationMinutes: 60,
        exercises: [{ _startH: 10, _startM: 30 }],
      },
    ]);

    const result = await detectSessionConflicts({
      userId: "user-1",
      date: "2026-04-27",
      startH: 10,
      startM: 0,
      durationMinutes: 60,
    });

    expect(result.hasConflict).toBe(true);
    expect(result.conflicts[0].kind).toBe("TRAINING_SESSION");
    expect(result.conflicts[0].title).toBe("Putting");
  });

  it("ekskluderer angitt sessionId fra konfliktsjekk", async () => {
    (prisma.booking.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await detectSessionConflicts({
      userId: "user-1",
      date: "2026-04-27",
      startH: 10,
      startM: 0,
      durationMinutes: 60,
      excludeSessionId: "s1",
    });

    const where = (prisma.trainingPlanSession.findMany as ReturnType<typeof vi.fn>).mock.calls[0][0].where;
    expect(where.NOT).toEqual({ id: "s1" });
  });
});
