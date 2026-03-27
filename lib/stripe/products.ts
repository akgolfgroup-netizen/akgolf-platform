// Stripe product configuration
// Products and prices are created in Stripe Dashboard — these are lookup keys

// ─── Coaching Abonnement ───
export const COACHING_SUBSCRIPTION_PRODUCTS = {
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
  juniorAcademy: {
    name: "Junior Academy",
    priceId: process.env.STRIPE_PRICE_JUNIOR_ACADEMY!,
    mode: "subscription" as const,
    amount: 250000, // 2500 NOK/mnd i øre
    interval: "month" as const,
    metadata: {
      sessionsPerMonth: 0, // Gruppetrening, ikke individuelt
      sessionDuration: 60,
      bookingWindowDays: 7,
      maxPerWeek: 0,
      tier: "JUNIOR_ACADEMY",
    },
  },
  juniorElite: {
    name: "Junior Elite",
    priceId: process.env.STRIPE_PRICE_JUNIOR_ELITE!,
    mode: "subscription" as const,
    amount: 250000, // 2500 NOK/mnd i øre
    interval: "month" as const,
    metadata: {
      sessionsPerMonth: 8,
      sessionDuration: 20,
      bookingWindowDays: 14,
      maxPerWeek: 2,
      tier: "JUNIOR_ELITE",
    },
  },
} as const;

// ─── Flex-pakker (engangskjøp) ───
export const FLEX_PRODUCTS = {
  flex50: {
    name: "Flex 50",
    priceId: process.env.STRIPE_PRICE_FLEX50!,
    mode: "payment" as const,
    amount: 150000, // 1500 NOK i øre
    metadata: {
      sessionDuration: 50,
      tier: "FLEX",
    },
  },
  flex90: {
    name: "Flex 90",
    priceId: process.env.STRIPE_PRICE_FLEX90!,
    mode: "payment" as const,
    amount: 250000, // 2500 NOK i øre
    metadata: {
      sessionDuration: 90,
      tier: "FLEX",
    },
  },
} as const;

// ─── Types ───
export type CoachingTier = keyof typeof COACHING_SUBSCRIPTION_PRODUCTS;
export type FlexProduct = keyof typeof FLEX_PRODUCTS;

// ─── Helpers ───
export function getCoachingProductByTier(tier: string) {
  const normalized = tier.toLowerCase().replace(/_/g, "");
  if (normalized === "performance") return COACHING_SUBSCRIPTION_PRODUCTS.performance;
  if (normalized === "performancepro") return COACHING_SUBSCRIPTION_PRODUCTS.performancePro;
  if (normalized === "junioracademy") return COACHING_SUBSCRIPTION_PRODUCTS.juniorAcademy;
  if (normalized === "juniorelite") return COACHING_SUBSCRIPTION_PRODUCTS.juniorElite;
  return null;
}

export function getFlexProduct(product: string) {
  const normalized = product.toLowerCase().replace(/[_-]/g, "");
  if (normalized === "flex50") return FLEX_PRODUCTS.flex50;
  if (normalized === "flex90") return FLEX_PRODUCTS.flex90;
  return null;
}

export function getSessionsPerMonth(tier: CoachingTier): number {
  const product = COACHING_SUBSCRIPTION_PRODUCTS[tier];
  return product.metadata.sessionsPerMonth ?? 0;
}

export function getBookingWindowDays(tier: CoachingTier): number {
  const product = COACHING_SUBSCRIPTION_PRODUCTS[tier];
  return product.metadata.bookingWindowDays ?? 7;
}

// ─── Alle produkter ───
export const ALL_COACHING_PRODUCTS = {
  ...COACHING_SUBSCRIPTION_PRODUCTS,
  ...FLEX_PRODUCTS,
} as const;
