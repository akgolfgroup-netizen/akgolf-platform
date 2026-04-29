import { describe, it, expect } from "vitest";
import { calculateRefund } from "@/lib/portal/booking/refund-policy";

const REF_DATE = new Date("2026-05-15T10:00:00Z"); // referansetidspunkt

function dateAt(hoursFromRef: number): Date {
  return new Date(REF_DATE.getTime() + hoursFromRef * 60 * 60 * 1000);
}

describe("calculateRefund — Standardvalg #1", () => {
  describe("> 24 timer før start = full refundering", () => {
    it("48t for: 100% refund", () => {
      const result = calculateRefund({
        startTime: dateAt(48),
        cancelledAt: REF_DATE,
        paidAmountKr: 1000,
      });
      expect(result.refundPct).toBe(100);
      expect(result.refundAmountKr).toBe(1000);
      expect(result.windowLabel).toBe("Full refundering");
    });

    it("nøyaktig 24t for: 100% refund (inkluderende grense)", () => {
      const result = calculateRefund({
        startTime: dateAt(24),
        cancelledAt: REF_DATE,
        paidAmountKr: 500,
      });
      expect(result.refundPct).toBe(100);
      expect(result.refundAmountKr).toBe(500);
    });
  });

  describe("8-24 timer før start = 50% refund", () => {
    it("12t for: 50% refund", () => {
      const result = calculateRefund({
        startTime: dateAt(12),
        cancelledAt: REF_DATE,
        paidAmountKr: 1000,
      });
      expect(result.refundPct).toBe(50);
      expect(result.refundAmountKr).toBe(500);
      expect(result.windowLabel).toBe("50% refundering");
    });

    it("nøyaktig 8t for: 50% refund (inkluderende grense)", () => {
      const result = calculateRefund({
        startTime: dateAt(8),
        cancelledAt: REF_DATE,
        paidAmountKr: 890,
      });
      expect(result.refundPct).toBe(50);
      expect(result.refundAmountKr).toBe(445);
    });

    it("23.99t for: 50% refund (rett under 24t-grensen)", () => {
      const result = calculateRefund({
        startTime: dateAt(23.99),
        cancelledAt: REF_DATE,
        paidAmountKr: 1000,
      });
      expect(result.refundPct).toBe(50);
    });

    it("rounds refund-amount to nearest integer kr", () => {
      const result = calculateRefund({
        startTime: dateAt(12),
        cancelledAt: REF_DATE,
        paidAmountKr: 333,
      });
      // 333 * 0.5 = 166.5 -> Math.round = 167
      expect(result.refundAmountKr).toBe(167);
    });
  });

  describe("< 8 timer før start = 0% refund", () => {
    it("4t for: ingen refund", () => {
      const result = calculateRefund({
        startTime: dateAt(4),
        cancelledAt: REF_DATE,
        paidAmountKr: 1000,
      });
      expect(result.refundPct).toBe(0);
      expect(result.refundAmountKr).toBe(0);
      expect(result.windowLabel).toBe("Ingen refundering");
      expect(result.reason).toContain("mindre enn 8 timer");
    });

    it("0t (nå) for: ingen refund", () => {
      const result = calculateRefund({
        startTime: dateAt(0),
        cancelledAt: REF_DATE,
        paidAmountKr: 500,
      });
      expect(result.refundPct).toBe(0);
    });

    it("etter at økten skulle starte (-2t): ingen refund med riktig årsak", () => {
      const result = calculateRefund({
        startTime: dateAt(-2),
        cancelledAt: REF_DATE,
        paidAmountKr: 500,
      });
      expect(result.refundPct).toBe(0);
      expect(result.refundAmountKr).toBe(0);
      expect(result.reason).toContain("etter at økten");
    });
  });

  it("inkluderer reason og windowLabel for alle vinduer", () => {
    const cases = [
      { hours: 48, expectedPct: 100 },
      { hours: 12, expectedPct: 50 },
      { hours: 4, expectedPct: 0 },
      { hours: -1, expectedPct: 0 },
    ];
    for (const c of cases) {
      const result = calculateRefund({
        startTime: dateAt(c.hours),
        cancelledAt: REF_DATE,
        paidAmountKr: 1000,
      });
      expect(result.refundPct).toBe(c.expectedPct);
      expect(result.reason).toBeTruthy();
      expect(result.windowLabel).toBeTruthy();
    }
  });
});
