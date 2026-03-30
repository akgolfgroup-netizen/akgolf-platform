import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Rate limit store bruker en Map som ikke resettes mellom tester
    // Vi bruker unike keys for hver test
  });

  it("tillater forespørsler under grensen", () => {
    const key = `test-under-${Date.now()}`;
    const config = { limit: 5, windowSeconds: 60 };

    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(key, config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }
  });

  it("blokkerer forespørsler over grensen", () => {
    const key = `test-over-${Date.now()}`;
    const config = { limit: 3, windowSeconds: 60 };

    // Bruk opp kvoten
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, config);
    }

    // Neste forespørsel skal blokkeres
    const result = checkRateLimit(key, config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returnerer resetAt tidspunkt", () => {
    const key = `test-reset-${Date.now()}`;
    const config = { limit: 5, windowSeconds: 60 };

    const result = checkRateLimit(key, config);
    expect(result.resetAt).toBeGreaterThan(Date.now());
    expect(result.resetAt).toBeLessThanOrEqual(Date.now() + 60 * 1000);
  });

  it("AI_ENDPOINTS har riktig konfigurasjon", () => {
    expect(RATE_LIMITS.AI_ENDPOINTS).toEqual({
      limit: 20,
      windowSeconds: 60,
    });
  });

  it("blokkerer AI-kall etter 20 forespørsler", () => {
    const userId = `ai-test-${Date.now()}`;
    const key = `ai:${userId}`;

    // 20 forespørsler skal være OK
    for (let i = 0; i < 20; i++) {
      const result = checkRateLimit(key, RATE_LIMITS.AI_ENDPOINTS);
      expect(result.allowed).toBe(true);
    }

    // Forespørsel 21 skal blokkeres
    const blocked = checkRateLimit(key, RATE_LIMITS.AI_ENDPOINTS);
    expect(blocked.allowed).toBe(false);
  });
});
