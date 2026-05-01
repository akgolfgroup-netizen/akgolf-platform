import { describe, it, expect, vi } from "vitest";
import { resolveCSTarget, getOrFallbackProfile } from "@/lib/portal/golf/clubspeed-resolver";
import { prisma } from "@/lib/portal/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    exerciseDefinition: {
      findUnique: vi.fn(),
    },
    clubSpeedProfile: {
      findUnique: vi.fn(),
    },
  },
}));

describe("resolveCSTarget — med profil", () => {
  it("bruker spillerens faktiske driver-carry", async () => {
    (prisma.exerciseDefinition.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "ex1",
      csTargetMin: null,
      csTargetMax: null,
      clubKey: "driver",
      distanceBucket: null,
    });
    (prisma.clubSpeedProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      userId: "u1",
      clubs: {
        driver: { carry: 240, total: 260 },
      },
    });

    const target = await resolveCSTarget("ex1", "u1", 12);
    expect(target).not.toBeNull();
    expect(target!.carryMin).toBeLessThan(240);
    expect(target!.carryMax).toBeGreaterThan(240);
  });
});

describe("resolveCSTarget — fallback til HCP", () => {
  it("hcp 15 gir fallback fra hcp_13_20-benchmark", async () => {
    (prisma.exerciseDefinition.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "ex1",
      csTargetMin: null,
      csTargetMax: null,
      clubKey: "driver",
      distanceBucket: null,
    });
    (prisma.clubSpeedProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const target = await resolveCSTarget("ex1", "u1", 15);
    expect(target).not.toBeNull();
    // hcp_13_20 driver carry = 210
    expect(target!.carryMin).toBeLessThanOrEqual(210);
    expect(target!.carryMax).toBeGreaterThanOrEqual(210);
  });

  it("hcp 3 gir fallback fra hcp_0_5-benchmark", async () => {
    (prisma.exerciseDefinition.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "ex1",
      csTargetMin: null,
      csTargetMax: null,
      clubKey: "driver",
      distanceBucket: null,
    });
    (prisma.clubSpeedProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const target = await resolveCSTarget("ex1", "u1", 3);
    expect(target).not.toBeNull();
    // hcp_0_5 driver carry = 250
    expect(target!.carryMin).toBeLessThanOrEqual(250);
    expect(target!.carryMax).toBeGreaterThanOrEqual(250);
  });
});

describe("getOrFallbackProfile", () => {
  it("returnerer eksisterende profil", async () => {
    const mockProfile = {
      id: "p1",
      userId: "u1",
      source: "TRACKMAN",
      clubs: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prisma.clubSpeedProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);

    const profile = await getOrFallbackProfile("u1", 15);
    expect(profile.id).toBe("p1");
    expect(profile.source).toBe("TRACKMAN");
  });

  it("returnerer fallback når ingen profil finnes", async () => {
    (prisma.clubSpeedProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const profile = await getOrFallbackProfile("u1", 15);
    expect(profile.source).toBe("HCP_FALLBACK");
    expect(profile.id).toBe("fallback");
  });
});
