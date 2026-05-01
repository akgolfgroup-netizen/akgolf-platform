/**
 * PlayerHQ-tilgangskontroll.
 *
 * Forretningsregler:
 * - Performance/Performance Pro-abonnenter får PlayerHQ inkludert (via subscriptionTier)
 * - Andre brukere må ha gyldig playerhqAccessUntil i fremtiden (trial eller betalt abo)
 * - I mai 2026 har alle brukere gratis trial fram til 2026-06-01
 *
 * Brukes i:
 * - Server components for å sjekke om bruker har portal-tilgang
 * - API-ruter for å validere tilgang
 * - Banner-komponenter for å vise trial-status
 */

const PLAYERHQ_LAUNCH_DATE = new Date("2026-06-01T00:00:00.000Z");

/**
 * Tier-er som inkluderer PlayerHQ-tilgang gjennom coaching-abonnement.
 * Performance og Performance Pro mappes til disse tiers via Stripe-webhook.
 */
const COACHING_TIERS_WITH_PLAYERHQ = [
  "PRO",
  "ELITE",
  "STARTER",
  "ACADEMY",
  "BUSINESS",
  "TRIALING",
] as const;

export interface PlayerHQAccessInput {
  subscriptionTier?: string | null;
  playerhqAccessUntil?: Date | string | null;
  playerhqStripeSubscriptionId?: string | null;
}

export interface PlayerHQAccessStatus {
  hasAccess: boolean;
  reason: "coaching_included" | "active_subscription" | "free_trial" | "expired" | "none";
  trialEndsAt: Date | null;
  isInFreeTrial: boolean;
  daysUntilTrialEnd: number | null;
}

/**
 * Sjekk om bruker har PlayerHQ-tilgang og hvorfor.
 *
 * @returns Status-objekt med hasAccess + reason for UI-meldinger.
 */
export function getPlayerHQAccess(user: PlayerHQAccessInput): PlayerHQAccessStatus {
  const now = new Date();

  // 1. Coaching-abonnement inkluderer PlayerHQ
  if (
    user.subscriptionTier &&
    (COACHING_TIERS_WITH_PLAYERHQ as readonly string[]).includes(user.subscriptionTier)
  ) {
    return {
      hasAccess: true,
      reason: "coaching_included",
      trialEndsAt: null,
      isInFreeTrial: false,
      daysUntilTrialEnd: null,
    };
  }

  // 2. Sjekk playerhqAccessUntil
  const accessUntil = user.playerhqAccessUntil
    ? new Date(user.playerhqAccessUntil)
    : null;

  if (!accessUntil || accessUntil <= now) {
    return {
      hasAccess: false,
      reason: accessUntil ? "expired" : "none",
      trialEndsAt: null,
      isInFreeTrial: false,
      daysUntilTrialEnd: null,
    };
  }

  // 3. Bruker har tilgang. Er det trial eller betalt?
  const isInFreeTrial = !user.playerhqStripeSubscriptionId && accessUntil <= PLAYERHQ_LAUNCH_DATE;
  const msUntilEnd = accessUntil.getTime() - now.getTime();
  const daysUntilTrialEnd = isInFreeTrial
    ? Math.max(0, Math.ceil(msUntilEnd / (1000 * 60 * 60 * 24)))
    : null;

  return {
    hasAccess: true,
    reason: isInFreeTrial ? "free_trial" : "active_subscription",
    trialEndsAt: accessUntil,
    isInFreeTrial,
    daysUntilTrialEnd,
  };
}

/**
 * Enkel boolean-sjekk uten metadata.
 */
export function hasPlayerHQAccess(user: PlayerHQAccessInput): boolean {
  return getPlayerHQAccess(user).hasAccess;
}
