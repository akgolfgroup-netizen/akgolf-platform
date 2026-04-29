import "server-only";

import { Capability, SubscriptionTier } from "@prisma/client";
import { hasCapability } from "@/lib/portal/capabilities/check";

const PAID_TIERS: SubscriptionTier[] = [SubscriptionTier.PRO, SubscriptionTier.ELITE];

/**
 * Talent-dashboardet er aapent for:
 *   1) Brukere med kapabilitet TALENT_DASHBOARD_VIEW (admin/instructor + manuelt grantede gjester)
 *   2) Brukere med abonnement PRO eller ELITE
 */
export async function canViewTalentDashboard(user: {
  id: string;
  subscriptionTier: SubscriptionTier;
}): Promise<boolean> {
  if (PAID_TIERS.includes(user.subscriptionTier)) return true;
  return hasCapability(user.id, Capability.TALENT_DASHBOARD_VIEW);
}
