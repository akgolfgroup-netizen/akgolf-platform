/**
 * Client-safe tier utilities (no database imports)
 */
import { SubscriptionTier } from "@prisma/client";

/**
 * Portal tier limits for freemium model
 * VISITOR = Free, PRO = Pro (199 kr), ELITE = Pro+ (299 kr)
 */
export const PORTAL_LIMITS = {
  [SubscriptionTier.VISITOR]: {
    monthlyLogs: 4,
    monthlyAiAnalysis: 1,
    historyDays: 30,
    hasFullSlagCategories: false,
    hasTrainingPlan: false,
    hasTrackmanImport: false,
    hasVideoAnalysis: false,
    hasExport: false,
    hasCoachSharing: false,
  },
  [SubscriptionTier.ACADEMY]: {
    monthlyLogs: Infinity,
    monthlyAiAnalysis: Infinity,
    historyDays: Infinity,
    hasFullSlagCategories: true,
    hasTrainingPlan: true,
    hasTrackmanImport: false,
    hasVideoAnalysis: false,
    hasExport: true,
    hasCoachSharing: false,
  },
  [SubscriptionTier.STARTER]: {
    monthlyLogs: Infinity,
    monthlyAiAnalysis: Infinity,
    historyDays: Infinity,
    hasFullSlagCategories: true,
    hasTrainingPlan: true,
    hasTrackmanImport: false,
    hasVideoAnalysis: false,
    hasExport: true,
    hasCoachSharing: false,
  },
  [SubscriptionTier.PRO]: {
    monthlyLogs: Infinity,
    monthlyAiAnalysis: Infinity,
    historyDays: Infinity,
    hasFullSlagCategories: true,
    hasTrainingPlan: true,
    hasTrackmanImport: false,
    hasVideoAnalysis: false,
    hasExport: true,
    hasCoachSharing: false,
  },
  [SubscriptionTier.ELITE]: {
    monthlyLogs: Infinity,
    monthlyAiAnalysis: Infinity,
    historyDays: Infinity,
    hasFullSlagCategories: true,
    hasTrainingPlan: true,
    hasTrackmanImport: true,
    hasVideoAnalysis: true,
    hasExport: true,
    hasCoachSharing: true,
  },
} as const;

export type PortalLimits = (typeof PORTAL_LIMITS)[SubscriptionTier];

/**
 * Check if user is on free tier
 */
export function isFreeTier(tier: SubscriptionTier): boolean {
  return tier === SubscriptionTier.VISITOR;
}

/**
 * Check if user is on paid tier (Pro or Pro+)
 */
export function isPaidTier(tier: SubscriptionTier): boolean {
  return (
    tier === SubscriptionTier.ACADEMY ||
    tier === SubscriptionTier.STARTER ||
    tier === SubscriptionTier.PRO ||
    tier === SubscriptionTier.ELITE
  );
}

/**
 * Get limits for a tier (client-safe)
 */
export function getLimitsForTier(tier: SubscriptionTier): PortalLimits {
  return PORTAL_LIMITS[tier];
}
