import { describe, it, expect } from "vitest";

// Test av whitelist-logikken for PATCH validering
describe("Dagbok PATCH Validering", () => {
  const allowedFields = [
    "durationMinutes",
    "focusArea",
    "notes",
    "rating",
    "deviatedFromPlan",
    "deviationReason",
  ];

  function sanitizeData(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }

  it("beholder gyldige felter", () => {
    const input = {
      durationMinutes: 45,
      focusArea: "putting",
      notes: "God økt",
      rating: 4,
    };

    const result = sanitizeData(input);

    expect(result).toEqual(input);
  });

  it("fjerner ugyldige felter", () => {
    const input = {
      durationMinutes: 45,
      userId: "hacker-id", // Skal fjernes
      id: "fake-id", // Skal fjernes
      createdAt: new Date(), // Skal fjernes
    };

    const result = sanitizeData(input);

    expect(result).toEqual({ durationMinutes: 45 });
    expect(result).not.toHaveProperty("userId");
    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("createdAt");
  });

  it("returnerer tomt objekt for kun ugyldige felter", () => {
    const input = {
      userId: "hacker-id",
      planSessionId: "fake-session",
      __proto__: "injection",
    };

    const result = sanitizeData(input);

    expect(Object.keys(result).length).toBe(0);
  });

  it("håndterer deviatedFromPlan korrekt", () => {
    const input = {
      deviatedFromPlan: true,
      deviationReason: "Skadet skulder",
    };

    const result = sanitizeData(input);

    expect(result).toEqual(input);
  });
});
