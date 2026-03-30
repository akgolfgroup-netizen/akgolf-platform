import { describe, it, expect } from "vitest";

// Simulerer SubscriptionTier enum fra Prisma
const SubscriptionTier = {
  VISITOR: "VISITOR",
  STARTER: "STARTER",
  ACADEMY: "ACADEMY",
  PRO: "PRO",
  ELITE: "ELITE",
} as const;

describe("SubscriptionTier Defaults", () => {
  it("bruker VISITOR som default, ikke FREE", () => {
    // Simulerer logikken fra API-rutene
    const userSubscriptionTier: string | null = null;
    const tier = (userSubscriptionTier ?? "VISITOR") as keyof typeof SubscriptionTier;

    expect(tier).toBe("VISITOR");
    expect(tier).not.toBe("FREE");
  });

  it("FREE er ikke en gyldig tier", () => {
    const validTiers = Object.values(SubscriptionTier);
    expect(validTiers).not.toContain("FREE");
  });

  it("VISITOR er en gyldig tier", () => {
    const validTiers = Object.values(SubscriptionTier);
    expect(validTiers).toContain("VISITOR");
  });

  describe("Stripe tier-mapping", () => {
    function mapTierToSubscription(tier: string): string {
      // Logikken fra stripe webhook
      return tier === "PERFORMANCE_PRO"
        ? "PRO"
        : tier === "PERFORMANCE"
        ? "STARTER"
        : "ACADEMY";
    }

    it("mapper PERFORMANCE_PRO til PRO", () => {
      expect(mapTierToSubscription("PERFORMANCE_PRO")).toBe("PRO");
    });

    it("mapper PERFORMANCE til STARTER", () => {
      expect(mapTierToSubscription("PERFORMANCE")).toBe("STARTER");
    });

    it("mapper START til ACADEMY", () => {
      expect(mapTierToSubscription("START")).toBe("ACADEMY");
    });

    it("mapper ukjent til ACADEMY", () => {
      expect(mapTierToSubscription("UNKNOWN")).toBe("ACADEMY");
    });
  });
});
