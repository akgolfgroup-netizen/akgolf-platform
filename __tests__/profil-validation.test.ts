import { describe, it, expect } from "vitest";
import { z } from "zod";

// Kopi av schema fra profil/actions.ts for testing
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Navn må være minst 2 tegn")
    .max(100, "Navn kan maks være 100 tegn")
    .optional(),
  phone: z
    .string()
    .regex(/^(\+47)?[0-9\s]{8,15}$/, "Ugyldig telefonnummer")
    .optional()
    .or(z.literal("")),
});

describe("Profil Input Validering", () => {
  describe("Navn", () => {
    it("godtar gyldig navn", () => {
      const result = profileSchema.safeParse({ name: "Anders Kristiansen" });
      expect(result.success).toBe(true);
    });

    it("avviser for kort navn", () => {
      const result = profileSchema.safeParse({ name: "A" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Navn må være minst 2 tegn");
      }
    });

    it("avviser for langt navn", () => {
      const result = profileSchema.safeParse({ name: "A".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Navn kan maks være 100 tegn");
      }
    });

    it("tillater manglende navn (optional)", () => {
      const result = profileSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("Telefon", () => {
    it("godtar norsk mobilnummer", () => {
      const result = profileSchema.safeParse({ phone: "98765432" });
      expect(result.success).toBe(true);
    });

    it("godtar nummer med landskode", () => {
      const result = profileSchema.safeParse({ phone: "+4798765432" });
      expect(result.success).toBe(true);
    });

    it("godtar nummer med mellomrom", () => {
      const result = profileSchema.safeParse({ phone: "987 65 432" });
      expect(result.success).toBe(true);
    });

    it("godtar tom streng", () => {
      const result = profileSchema.safeParse({ phone: "" });
      expect(result.success).toBe(true);
    });

    it("avviser ugyldig telefonnummer", () => {
      const result = profileSchema.safeParse({ phone: "abc123" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Ugyldig telefonnummer");
      }
    });

    it("avviser for kort nummer", () => {
      const result = profileSchema.safeParse({ phone: "1234567" });
      expect(result.success).toBe(false);
    });
  });

  describe("Kombinert", () => {
    it("godtar gyldig profil-oppdatering", () => {
      const result = profileSchema.safeParse({
        name: "Anders Kristiansen",
        phone: "+4798765432",
      });
      expect(result.success).toBe(true);
    });

    it("godtar tom oppdatering", () => {
      const result = profileSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });
});
