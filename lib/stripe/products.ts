// Stripe product configuration
// Products and prices are created in Stripe Dashboard — these are lookup keys

// ─── AI Treningsplaner ───
export const AI_PLAN_PRODUCTS = {
  basis: {
    name: "AI Treningsplan — Basis",
    priceId: process.env.STRIPE_PRICE_BASIS!,
    mode: "payment" as const,
    amount: 19900, // 199 NOK in øre
  },
  standard: {
    name: "AI Treningsplan — Standard",
    priceId: process.env.STRIPE_PRICE_STANDARD!,
    mode: "subscription" as const,
    amount: 69900, // 699 NOK per season
  },
  premium: {
    name: "AI Treningsplan — Premium",
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    mode: "subscription" as const,
    amount: 199900, // 1999 NOK per year
  },
} as const;

// ─── Coaching Abonnement ───
export const COACHING_SUBSCRIPTION_PRODUCTS = {
  performancePro: {
    name: "Performance Pro",
    priceId: process.env.STRIPE_PRICE_PERFORMANCE_PRO!,
    mode: "subscription" as const,
    amount: 200000, // 2000 NOK/mnd i øre
    interval: "month" as const,
    metadata: {
      sessionsPerMonth: 4,
      sessionDuration: 20,
      bookingWindowDays: 14,
      maxPerWeek: 2,
      tier: "PERFORMANCE_PRO",
    },
  },
  performance: {
    name: "Performance",
    priceId: process.env.STRIPE_PRICE_PERFORMANCE!,
    mode: "subscription" as const,
    amount: 160000, // 1600 NOK/mnd i øre
    interval: "month" as const,
    metadata: {
      sessionsPerMonth: 2,
      sessionDuration: 20,
      bookingWindowDays: 7,
      maxPerWeek: 1,
      tier: "PERFORMANCE",
    },
  },
} as const;

// ─── Onboarding / Engangskjøp ───
export const ONBOARDING_PRODUCTS = {
  start: {
    name: "Start (Onboarding)",
    priceId: process.env.STRIPE_PRICE_START!,
    mode: "payment" as const,
    amount: 300000, // 3000 NOK i øre
    metadata: {
      sessions: 3,
      sessionDuration: 20,
      portalDays: 30,
      includesTrackmanBaseline: true,
    },
  },
  foundationTest: {
    name: "Foundation Test",
    priceId: process.env.STRIPE_PRICE_FOUNDATION_TEST!,
    mode: "payment" as const,
    amount: 99500, // 995 NOK i øre
    metadata: {
      sessionDuration: 50,
      refundableOnSubscription: true,
    },
  },
} as const;

// ─── Legacy alias for backwards compatibility ───
export const STRIPE_PRODUCTS = AI_PLAN_PRODUCTS;

// ─── Types ───
export type AIPlanTier = keyof typeof AI_PLAN_PRODUCTS;
export type CoachingTier = keyof typeof COACHING_SUBSCRIPTION_PRODUCTS;
export type OnboardingProduct = keyof typeof ONBOARDING_PRODUCTS;

// Legacy alias
export type PlanTier = AIPlanTier;

// ─── Helpers ───
export function getCoachingProductByTier(tier: string) {
  const normalized = tier.toLowerCase().replace(/_/g, "");
  if (normalized === "performancepro") return COACHING_SUBSCRIPTION_PRODUCTS.performancePro;
  if (normalized === "performance") return COACHING_SUBSCRIPTION_PRODUCTS.performance;
  return null;
}

export function getSessionsPerMonth(tier: CoachingTier): number {
  return COACHING_SUBSCRIPTION_PRODUCTS[tier].metadata.sessionsPerMonth;
}

export function getBookingWindowDays(tier: CoachingTier): number {
  return COACHING_SUBSCRIPTION_PRODUCTS[tier].metadata.bookingWindowDays;
}
