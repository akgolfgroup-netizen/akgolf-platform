import { describe, it, expect } from "vitest";
import {
  levelGroupFromCategory,
  getHoursPerTenthSg,
  estimateHoursForSgDelta,
  applyOverlapFactor,
  getOverlapFactor,
  getEmpiricalShare,
  regularizeAllocation,
  getTableVersion,
  getStatus,
  getDisclaimers,
  type SgCategory,
  type LevelGroup,
} from "@/lib/portal/predictions/hours-per-sg-table";

describe("levelGroupFromCategory", () => {
  it("mapper K–G til KG", () => {
    ["K", "J", "I", "H", "G"].forEach((c) => {
      expect(levelGroupFromCategory(c)).toBe("KG");
    });
  });

  it("mapper F–D til FD", () => {
    ["F", "E", "D"].forEach((c) => {
      expect(levelGroupFromCategory(c)).toBe("FD");
    });
  });

  it("mapper C–B til CB", () => {
    expect(levelGroupFromCategory("C")).toBe("CB");
    expect(levelGroupFromCategory("B")).toBe("CB");
  });

  it("mapper A til A", () => {
    expect(levelGroupFromCategory("A")).toBe("A");
  });

  it("er case-insensitive", () => {
    expect(levelGroupFromCategory("a")).toBe("A");
    expect(levelGroupFromCategory(" b ")).toBe("CB");
  });

  it("kaster feil ved ukjent kategori", () => {
    expect(() => levelGroupFromCategory("X")).toThrow();
    expect(() => levelGroupFromCategory("")).toThrow();
  });
});

describe("getHoursPerTenthSg", () => {
  it("returnerer riktig estimat for APP/CB (Emil-eksempelet)", () => {
    // Fra metodologi-dokumentet seksjon 6.3: APP på C/B = 140 timer per +0.1
    const est = getHoursPerTenthSg("APP", "CB");
    expect(est.hours).toBe(140);
    expect(est.ci95Low).toBe(98);
    expect(est.ci95High).toBe(200);
  });

  it("returnerer riktig estimat for PUTT/KG (enkleste nivå)", () => {
    const est = getHoursPerTenthSg("PUTT", "KG");
    expect(est.hours).toBe(25);
    expect(est.ci95Low).toBeLessThan(est.hours);
    expect(est.ci95High).toBeGreaterThan(est.hours);
  });

  it("aksepterer kategori-bokstav i stedet for level-group", () => {
    // "C" skal mappes til "CB"
    const est1 = getHoursPerTenthSg("OTT", "C");
    const est2 = getHoursPerTenthSg("OTT", "CB");
    expect(est1).toEqual(est2);
  });

  it("diminishing returns: høyere nivå krever flere timer", () => {
    const categories: SgCategory[] = ["OTT", "APP", "ARG", "PUTT"];
    for (const cat of categories) {
      const kg = getHoursPerTenthSg(cat, "KG");
      const fd = getHoursPerTenthSg(cat, "FD");
      const cb = getHoursPerTenthSg(cat, "CB");
      const a = getHoursPerTenthSg(cat, "A");
      expect(fd.hours).toBeGreaterThan(kg.hours);
      expect(cb.hours).toBeGreaterThan(fd.hours);
      expect(a.hours).toBeGreaterThan(cb.hours);
    }
  });

  it("APP krever mer enn PUTT på alle nivåer", () => {
    const levels: LevelGroup[] = ["KG", "FD", "CB", "A"];
    for (const lvl of levels) {
      const app = getHoursPerTenthSg("APP", lvl);
      const putt = getHoursPerTenthSg("PUTT", lvl);
      expect(app.hours).toBeGreaterThan(putt.hours);
    }
  });

  it("CI-grenser er konsistente (low ≤ hours ≤ high)", () => {
    const categories: SgCategory[] = ["OTT", "APP", "ARG", "PUTT"];
    const levels: LevelGroup[] = ["KG", "FD", "CB", "A"];
    for (const cat of categories) {
      for (const lvl of levels) {
        const est = getHoursPerTenthSg(cat, lvl);
        expect(est.ci95Low).toBeLessThanOrEqual(est.hours);
        expect(est.hours).toBeLessThanOrEqual(est.ci95High);
      }
    }
  });
});

describe("estimateHoursForSgDelta", () => {
  it("returnerer 0 for ikke-positiv delta", () => {
    const est = estimateHoursForSgDelta("APP", "CB", 0);
    expect(est.hours).toBe(0);

    const neg = estimateHoursForSgDelta("APP", "CB", -0.5);
    expect(neg.hours).toBe(0);
  });

  it("skalerer lineært med deltaet (Emil APP +1.2 på CB)", () => {
    // APP/CB = 140 timer per +0.1. For +1.2 = 12 steg = 1680 timer
    const est = estimateHoursForSgDelta("APP", "CB", 1.2);
    expect(est.hours).toBeCloseTo(1680, 1);
    expect(est.ci95Low).toBeCloseTo(98 * 12, 1);
    expect(est.ci95High).toBeCloseTo(200 * 12, 1);
  });

  it("Emil OTT +0.6 på CB ≈ 600 timer", () => {
    const est = estimateHoursForSgDelta("OTT", "CB", 0.6);
    expect(est.hours).toBeCloseTo(600, 1);
  });

  it("Emil ARG +0.4 på B-nivå (= CB) ≈ 360 timer", () => {
    const est = estimateHoursForSgDelta("ARG", "B", 0.4);
    expect(est.hours).toBeCloseTo(360, 1);
  });
});

describe("overlap factor", () => {
  it("returnerer 0.55 som default", () => {
    expect(getOverlapFactor()).toBe(0.55);
  });

  it("applyOverlapFactor reduserer timer med 45%", () => {
    expect(applyOverlapFactor(100)).toBeCloseTo(55, 3);
    expect(applyOverlapFactor(2705)).toBeCloseTo(1487.75, 1);
  });
});

describe("empirical distribution (regularisering)", () => {
  it("gir standardisert PGA Tour-andel for APP", () => {
    // Fra metodologi 5.3: APP ≈ 46% av SG-forbedringen
    const share = getEmpiricalShare("APP");
    expect(share.mean).toBe(0.46);
    expect(share.stdDev).toBeGreaterThan(0);
  });

  it("empirical shares summerer til ~1.0", () => {
    const sum =
      getEmpiricalShare("OTT").mean +
      getEmpiricalShare("APP").mean +
      getEmpiricalShare("ARG").mean +
      getEmpiricalShare("PUTT").mean;
    expect(sum).toBeCloseTo(1.0, 2);
  });

  it("APP har høyest empirisk andel", () => {
    const shares: Record<SgCategory, number> = {
      OTT: getEmpiricalShare("OTT").mean,
      APP: getEmpiricalShare("APP").mean,
      ARG: getEmpiricalShare("ARG").mean,
      PUTT: getEmpiricalShare("PUTT").mean,
    };
    const max = Math.max(...Object.values(shares));
    expect(shares.APP).toBe(max);
  });
});

describe("regularizeAllocation", () => {
  it("ekstreme headroom dempes mot empirisk snitt", () => {
    // Hvis headroom sier 100% approach, skal final være mindre ekstrem
    const extreme: Record<SgCategory, number> = {
      OTT: 0,
      APP: 1.0,
      ARG: 0,
      PUTT: 0,
    };
    const result = regularizeAllocation(extreme);
    // APP dempes men forblir dominant
    expect(result.APP).toBeGreaterThan(0.5);
    expect(result.APP).toBeLessThan(1.0);
    // Andre kategorier får litt vekt
    expect(result.OTT).toBeGreaterThan(0);
    expect(result.PUTT).toBeGreaterThan(0);
  });

  it("resultatet summerer til 1.0 etter normalisering", () => {
    const headroom: Record<SgCategory, number> = {
      OTT: 0.3,
      APP: 0.4,
      ARG: 0.2,
      PUTT: 0.1,
    };
    const result = regularizeAllocation(headroom);
    const sum = result.OTT + result.APP + result.ARG + result.PUTT;
    expect(sum).toBeCloseTo(1.0, 3);
  });

  it("balansert headroom + regularisering = blandet fordeling", () => {
    const balanced: Record<SgCategory, number> = {
      OTT: 0.25,
      APP: 0.25,
      ARG: 0.25,
      PUTT: 0.25,
    };
    const result = regularizeAllocation(balanced);
    // Siden empirical APP = 0.46 og vekt 0.3, skal APP bli høyere enn 0.25
    expect(result.APP).toBeGreaterThan(0.25);
    // PUTT skal bli lavere enn 0.25 (empirical = 0.14)
    expect(result.PUTT).toBeLessThan(0.25);
  });

  it("Emil-cenariet: headroom-dominant approach dempes mot empirisk", () => {
    // Emil: headroom OTT=26%, APP=52%, ARG=17%, PUTT=4% (fra metodologi)
    // Omtrentlig — normalisert
    const headroom: Record<SgCategory, number> = {
      OTT: 0.26,
      APP: 0.52,
      ARG: 0.17,
      PUTT: 0.05,
    };
    const result = regularizeAllocation(headroom);
    // APP fortsatt størst, men mindre enn 52%
    expect(result.APP).toBeGreaterThan(result.OTT);
    expect(result.APP).toBeGreaterThan(result.ARG);
    expect(result.APP).toBeGreaterThan(result.PUTT);
    expect(result.APP).toBeLessThan(0.52);
    // PUTT skal heves noe pga regularisering
    expect(result.PUTT).toBeGreaterThan(0.05);
  });
});

describe("metadata", () => {
  it("rapporterer versjon", () => {
    expect(getTableVersion()).toBe("1.0.0");
  });

  it("status er eksplisitt ikke-kalibrert", () => {
    expect(getStatus()).toBe("expert_estimate_uncalibrated");
  });

  it("disclaimers er tilstede", () => {
    const disc = getDisclaimers();
    expect(disc.length).toBeGreaterThan(0);
    // Må eksplisitt nevne at tallene er ekspert-estimater
    const joined = disc.join(" ").toLowerCase();
    expect(joined).toContain("ekspert");
    expect(joined).toContain("individuell variasjon");
  });
});
