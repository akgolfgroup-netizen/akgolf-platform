/**
 * Tester standardmal-strukturen og focus-konvensjoner.
 * Beskytter mot regresjon når maler refaktoreres til DB-tabell.
 */

import { describe, it, expect } from "vitest";
import { STANDARD_TEMPLATES, getTemplate } from "@/lib/portal/training/standard-templates";
import { TEMPLATE_FOCUS } from "@/lib/portal/training/ak-taxonomy";

describe("STANDARD_TEMPLATES", () => {
  it("har 5 forhåndsdefinerte maler", () => {
    expect(STANDARD_TEMPLATES).toHaveLength(5);
  });

  it("hver mal har gyldig id, tittel og minst én økt", () => {
    for (const t of STANDARD_TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.weekPattern.length).toBeGreaterThan(0);
    }
  });

  it("alle økter har dayOfWeek mellom 1 og 7", () => {
    for (const t of STANDARD_TEMPLATES) {
      for (const s of t.weekPattern) {
        expect(s.dayOfWeek).toBeGreaterThanOrEqual(1);
        expect(s.dayOfWeek).toBeLessThanOrEqual(7);
      }
    }
  });

  it("alle økter har positiv durationMinutes", () => {
    for (const t of STANDARD_TEMPLATES) {
      for (const s of t.weekPattern) {
        expect(s.durationMinutes).toBeGreaterThan(0);
        expect(s.durationMinutes).toBeLessThanOrEqual(480);
      }
    }
  });

  it("alle focusArea-verdier kommer fra TEMPLATE_FOCUS-konstanten", () => {
    const validFocuses = Object.values(TEMPLATE_FOCUS);
    for (const t of STANDARD_TEMPLATES) {
      for (const s of t.weekPattern) {
        expect(validFocuses).toContain(s.focusArea);
      }
    }
  });

  it("getTemplate returnerer riktig mal for kjent id", () => {
    const t = getTemplate("allround");
    expect(t).toBeDefined();
    expect(t?.title).toBe("Allround basis");
  });

  it("getTemplate returnerer undefined for ukjent id", () => {
    // @ts-expect-error testing ugyldig id
    expect(getTemplate("ikke-finnes")).toBeUndefined();
  });

  it("periodType er gyldig enum-verdi", () => {
    const valid = ["PREPARATION", "COMPETITION", "RECOVERY", "OFF_SEASON"];
    for (const t of STANDARD_TEMPLATES) {
      expect(valid).toContain(t.periodType);
    }
  });
});
