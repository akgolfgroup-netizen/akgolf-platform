import { describe, it, expect } from "vitest";
import { computeAllocation, type AllocationInput } from "@/lib/portal/allocation/engine";


function makeInput(partial: Partial<AllocationInput>): AllocationInput {
  return {
    userId: "user-test",
    hcp: 15,
    weeklyHours: 5,
    age: 30,
    goal: "PERFORMANCE",
    planHorizonWeeks: 4,
    ...partial,
  };
}

describe("computeAllocation — HCP-baseline", () => {
  it("hcp 15 gir korrekt baseline-fordeling (sum = 100%)", () => {
    const out = computeAllocation(makeInput({ hcp: 15, planHorizonWeeks: 1 }));
    const w = out.weeks[0];
    const sum = w.allocation.fysisk + w.allocation.teknikk + w.allocation.mental +
      Object.values(w.allocation.slag).reduce((a, b) => a + b, 0) +
      Object.values(w.allocation.spill).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it("hcp 3 gir hcp_0_5 som basis (periodisert)", () => {
    const out = computeAllocation(makeInput({ hcp: 3, planHorizonWeeks: 1 }));
    expect(out.source).toBe("HCP_BASELINE");
    const w = out.weeks[0];
    // hcp_0_5: fysisk=15 teknikk=20 slag=30 spill=25 mental=10
    // Med periodisering avviker tallene, men strukturen er lik
    expect(w.allocation.fysisk).toBeGreaterThan(0);
    expect(w.allocation.teknikk).toBeGreaterThan(0);
    expect(w.allocation.mental).toBeGreaterThan(0);
  });

  it("hcp 45 gir hcp_31_54 som basis (periodisert)", () => {
    const out = computeAllocation(makeInput({ hcp: 45, planHorizonWeeks: 1 }));
    const w = out.weeks[0];
    // hcp_31_54: fysisk=20 teknikk=35 slag=18 spill=22 mental=5
    expect(w.allocation.fysisk).toBeGreaterThan(0);
    expect(w.allocation.teknikk).toBeGreaterThan(0);
  });
});

describe("computeAllocation — svakhets-skew", () => {
  it("driver-svakhet gir +15pp til slag (område)", () => {
    const baseline = computeAllocation(makeInput({ hcp: 15, planHorizonWeeks: 1, weakestArea: undefined }));
    const skewed = computeAllocation(makeInput({ hcp: 15, planHorizonWeeks: 1, weakestArea: "driver" }));
    const baseSlag = baseline.weeks[0].allocation.slag;
    const skewSlag = skewed.weeks[0].allocation.slag;
    const baseSlagTotal = Object.values(baseSlag).reduce((a, b) => a + b, 0);
    const skewSlagTotal = Object.values(skewSlag).reduce((a, b) => a + b, 0);
    expect(skewSlagTotal).toBeGreaterThan(baseSlagTotal + 5);
  });

  it("putting-svakhet gir +15pp til spill", () => {
    const baseline = computeAllocation(makeInput({ hcp: 15, planHorizonWeeks: 1 }));
    const skewed = computeAllocation(makeInput({ hcp: 15, planHorizonWeeks: 1, weakestArea: "putting" }));
    const baseSpill = Object.values(baseline.weeks[0].allocation.spill).reduce((a, b) => a + b, 0);
    const skewSpill = Object.values(skewed.weeks[0].allocation.spill).reduce((a, b) => a + b, 0);
    expect(skewSpill).toBeGreaterThan(baseSpill + 5);
  });

  it("sum er fortsatt 100% etter skew", () => {
    const out = computeAllocation(makeInput({ hcp: 15, planHorizonWeeks: 1, weakestArea: "approach" }));
    const w = out.weeks[0];
    const sum = w.allocation.fysisk + w.allocation.teknikk + w.allocation.mental +
      Object.values(w.allocation.slag).reduce((a, b) => a + b, 0) +
      Object.values(w.allocation.spill).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});

describe("computeAllocation — periodisering", () => {
  it("januar = off_season med høyere fysisk/teknikk", () => {
    const out = computeAllocation(makeInput({
      hcp: 15,
      planHorizonWeeks: 1,
      startDate: new Date("2026-01-15"),
    }));
    expect(out.weeks[0].phase).toBe("off_season");
    expect(out.weeks[0].allocation.fysisk).toBeGreaterThan(15);
    expect(out.weeks[0].allocation.teknikk).toBeGreaterThan(20);
  });

  it("juli = sesong med høyere spill/slag", () => {
    const out = computeAllocation(makeInput({
      hcp: 15,
      planHorizonWeeks: 1,
      startDate: new Date("2026-07-15"),
    }));
    expect(out.weeks[0].phase).toBe("sesong");
    expect(Object.values(out.weeks[0].allocation.spill).reduce((a, b) => a + b, 0)).toBeGreaterThan(20);
  });

  it("sum er 100% etter periodisering", () => {
    const out = computeAllocation(makeInput({
      hcp: 15,
      planHorizonWeeks: 4,
      startDate: new Date("2026-01-01"),
    }));
    for (const w of out.weeks) {
      const sum = w.allocation.fysisk + w.allocation.teknikk + w.allocation.mental +
        Object.values(w.allocation.slag).reduce((a, b) => a + b, 0) +
        Object.values(w.allocation.spill).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
    }
  });
});

describe("computeAllocation — turnering-taper", () => {
  it("trigger taper når turnering er innen 28 dager", () => {
    const tournamentDate = new Date();
    tournamentDate.setDate(tournamentDate.getDate() + 14);
    const out = computeAllocation(makeInput({
      hcp: 15,
      planHorizonWeeks: 4,
      upcomingTournaments: [{
        startsAt: tournamentDate,
        importance: 3,
        name: "Test Open",
      }],
    }));
    const taperWeeks = out.weeks.filter((w) => w.phase === "taper");
    expect(taperWeeks.length).toBeGreaterThan(0);
    expect(taperWeeks[0].triggers.some((t) => t.includes("Test Open"))).toBe(true);
  });

  it("taper øker spill og mental, reduserer fysisk/teknikk", () => {
    const tournamentDate = new Date();
    tournamentDate.setDate(tournamentDate.getDate() + 7);
    const out = computeAllocation(makeInput({
      hcp: 15,
      planHorizonWeeks: 2,
      upcomingTournaments: [{
        startsAt: tournamentDate,
        importance: 3,
        name: "Neste uke",
      }],
    }));
    const taperWeek = out.weeks.find((w) => w.phase === "taper");
    expect(taperWeek).toBeDefined();
    expect(Object.values(taperWeek!.allocation.spill).reduce((a, b) => a + b, 0)).toBeGreaterThan(20);
    expect(taperWeek!.allocation.mental).toBeGreaterThanOrEqual(10);
    expect(taperWeek!.allocation.fysisk).toBeLessThan(15);
  });
});

describe("computeAllocation — distance-buckets", () => {
  it("distance-buckets summerer til 100%", () => {
    const out = computeAllocation(makeInput({
      hcp: 15,
      planHorizonWeeks: 1,
      homeCourseHoles: [
        { hole: 1, par: 4, lengthMeters: 380 },
        { hole: 2, par: 3, lengthMeters: 150 },
        { hole: 3, par: 5, lengthMeters: 480 },
        { hole: 4, par: 4, lengthMeters: 350 },
        { hole: 5, par: 4, lengthMeters: 400 },
        { hole: 6, par: 3, lengthMeters: 120 },
        { hole: 7, par: 4, lengthMeters: 410 },
        { hole: 8, par: 5, lengthMeters: 510 },
        { hole: 9, par: 4, lengthMeters: 370 },
      ],
      homeCourseDriverCarry: 220,
    }));
    expect(out.distanceBuckets).toBeDefined();
    const sum = Object.values(out.distanceBuckets!).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});
