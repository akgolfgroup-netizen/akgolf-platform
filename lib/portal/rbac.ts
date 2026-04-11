import { UserRole, SubscriptionTier } from "@prisma/client";

export function isAdmin(role?: string): boolean {
  return role === UserRole.ADMIN;
}

export function isInstructor(role?: string): boolean {
  return role === UserRole.INSTRUCTOR || role === UserRole.ADMIN;
}

export function isInvited(role?: string): boolean {
  return role === UserRole.INVITED;
}

export function isStudent(role?: string): boolean {
  return role === UserRole.STUDENT;
}

export function isStaff(role?: string): boolean {
  return role === UserRole.ADMIN || role === UserRole.INSTRUCTOR;
}

/**
 * Check if user can access Mission Control admin dashboard
 * ADMIN, INSTRUCTOR, and INVITED roles all have access
 */
export function canAccessMissionControl(role?: string): boolean {
  return (
    role === UserRole.ADMIN ||
    role === UserRole.INSTRUCTOR ||
    role === UserRole.INVITED
  );
}

/**
 * Mission Control page access matrix
 * Returns true if the role can access the specified page
 */
export function canAccessMCPage(
  role: string | undefined,
  page: string
): boolean {
  if (!role) return false;

  // Pages accessible to all MC users (ADMIN, INSTRUCTOR, INVITED)
  const publicPages = [
    "hub",
    "admin",
    "focus",
    "kalender",
    "fasiliteter",
    "mission-board",
    "denne-uken",
    "tilgjengelighet",
  ];
  if (publicPages.includes(page)) {
    return canAccessMissionControl(role);
  }

  // Pages accessible only to ADMIN and INSTRUCTOR
  const staffPages = [
    "bookinger",
    "elever",
    "meldinger",
    "godkjenninger",
    "ai-assistent",
    "okter",
    "turneringer",
    "treningsplan",
    "notifications",
    "kapasitet",
    "analytics",
  ];
  if (staffPages.includes(page)) {
    return isStaff(role);
  }

  // Pages accessible only to ADMIN
  const adminPages = ["agenter", "okonomi", "rapporter", "e-postmaler"];
  if (adminPages.includes(page)) {
    return isAdmin(role);
  }

  // Default: gi tilgang til alle MC-brukere for ukjente sider
  return canAccessMissionControl(role);
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  [SubscriptionTier.VISITOR]: 0,
  [SubscriptionTier.ACADEMY]: 1,
  [SubscriptionTier.STARTER]: 2,
  [SubscriptionTier.PRO]: 3,
  [SubscriptionTier.ELITE]: 4,
};

export function hasTierAccess(
  userTier: SubscriptionTier,
  required: SubscriptionTier
): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}
