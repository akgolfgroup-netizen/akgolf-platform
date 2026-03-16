import { UserRole, SubscriptionTier } from "@prisma/client";

export function isAdmin(role?: string): boolean {
  return role === UserRole.ADMIN;
}

export function isInstructor(role?: string): boolean {
  return role === UserRole.INSTRUCTOR || role === UserRole.ADMIN;
}

export function isStudent(role?: string): boolean {
  return role === UserRole.STUDENT;
}

export function isStaff(role?: string): boolean {
  return role === UserRole.ADMIN || role === UserRole.INSTRUCTOR;
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 0,
  [SubscriptionTier.PRO]: 1,
  [SubscriptionTier.ELITE]: 2,
};

export function hasTierAccess(
  userTier: SubscriptionTier,
  required: SubscriptionTier
): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}
