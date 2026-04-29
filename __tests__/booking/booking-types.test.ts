import { describe, it, expect } from "vitest";
import {
  formatBookingPrice,
  getVisibleSteps,
  STEP_CONFIG,
} from "@/components/booking/booking-types";

describe("formatBookingPrice", () => {
  it("formaterer 0 som '0 kr'", () => {
    expect(formatBookingPrice(0)).toBe("0 kr");
  });

  it("formaterer 890 som '890 kr'", () => {
    expect(formatBookingPrice(890)).toBe("890 kr");
  });

  it("formaterer 1490 med tusen-separator", () => {
    expect(formatBookingPrice(1490)).toMatch(/1.490 kr/);
  });

  it("formaterer 12500 med tusen-separator", () => {
    expect(formatBookingPrice(12500)).toMatch(/12.500 kr/);
  });
});

describe("getVisibleSteps", () => {
  it("portal-mode hopper over 'details'-steget", () => {
    const steps = getVisibleSteps("portal");
    expect(steps).toEqual(["service", "datetime", "confirm"]);
    expect(steps).not.toContain("details");
  });

  it("public-mode inkluderer alle 4 steg", () => {
    const steps = getVisibleSteps("public");
    expect(steps).toEqual(["service", "datetime", "details", "confirm"]);
    expect(steps).toHaveLength(4);
  });
});

describe("STEP_CONFIG", () => {
  it("har label for alle 4 steg", () => {
    expect(STEP_CONFIG.service.label).toBe("Tjeneste");
    expect(STEP_CONFIG.datetime.label).toBe("Tidspunkt");
    expect(STEP_CONFIG.details.label).toBe("Opplysninger");
    expect(STEP_CONFIG.confirm.label).toBe("Bekreft");
  });

  it("har stigende index 0-3", () => {
    expect(STEP_CONFIG.service.index).toBe(0);
    expect(STEP_CONFIG.datetime.index).toBe(1);
    expect(STEP_CONFIG.details.index).toBe(2);
    expect(STEP_CONFIG.confirm.index).toBe(3);
  });
});
