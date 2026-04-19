import "server-only";
import { Capability, UserRole } from "@prisma/client";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import {
  ADMIN_DEFAULT_CAPABILITIES,
  INSTRUCTOR_DEFAULT_CAPABILITIES,
  INVITED_DEFAULT_CAPABILITIES,
  STUDENT_DEFAULT_CAPABILITIES,
} from "./presets";

const requestCache = new Map<string, Set<Capability>>();

function cacheKey(userId: string): string {
  return `caps:${userId}`;
}

export function clearCapabilityCache(userId?: string): void {
  if (userId) {
    requestCache.delete(cacheKey(userId));
  } else {
    requestCache.clear();
  }
}

function defaultsForRole(role: string | null | undefined): Capability[] {
  switch (role) {
    case UserRole.ADMIN:
      return ADMIN_DEFAULT_CAPABILITIES;
    case UserRole.INSTRUCTOR:
      return INSTRUCTOR_DEFAULT_CAPABILITIES;
    case UserRole.STUDENT:
      return STUDENT_DEFAULT_CAPABILITIES;
    case UserRole.INVITED:
      return INVITED_DEFAULT_CAPABILITIES;
    default:
      return [];
  }
}

export async function getUserCapabilities(
  userId: string
): Promise<Set<Capability>> {
  const cached = requestCache.get(cacheKey(userId));
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      UserCapability: {
        where: {
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        select: { capability: true },
      },
    },
  });

  if (!user) {
    const empty = new Set<Capability>();
    requestCache.set(cacheKey(userId), empty);
    return empty;
  }

  const granted = new Set<Capability>(defaultsForRole(user.role));
  for (const row of user.UserCapability) {
    granted.add(row.capability);
  }

  requestCache.set(cacheKey(userId), granted);
  return granted;
}

export async function hasCapability(
  userId: string,
  capability: Capability
): Promise<boolean> {
  const caps = await getUserCapabilities(userId);
  return caps.has(capability);
}

export async function hasAnyCapability(
  userId: string,
  capabilities: Capability[]
): Promise<boolean> {
  const caps = await getUserCapabilities(userId);
  return capabilities.some((c) => caps.has(c));
}

export async function hasAllCapabilities(
  userId: string,
  capabilities: Capability[]
): Promise<boolean> {
  const caps = await getUserCapabilities(userId);
  return capabilities.every((c) => caps.has(c));
}

export class CapabilityDeniedError extends Error {
  constructor(public capability: Capability) {
    super(`Manglende kapabilitet: ${capability}`);
    this.name = "CapabilityDeniedError";
  }
}

export async function requireCapability(
  capability: Capability
): Promise<{ userId: string }> {
  const user = await getPortalUser();
  if (!user) {
    throw new CapabilityDeniedError(capability);
  }
  const allowed = await hasCapability(user.id, capability);
  if (!allowed) {
    throw new CapabilityDeniedError(capability);
  }
  return { userId: user.id };
}

export async function requireAnyCapability(
  capabilities: Capability[]
): Promise<{ userId: string; matched: Capability }> {
  const user = await getPortalUser();
  if (!user) {
    throw new CapabilityDeniedError(capabilities[0]);
  }
  const caps = await getUserCapabilities(user.id);
  const matched = capabilities.find((c) => caps.has(c));
  if (!matched) {
    throw new CapabilityDeniedError(capabilities[0]);
  }
  return { userId: user.id, matched };
}
