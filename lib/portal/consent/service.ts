"use server";

import { prisma } from "@/lib/portal/prisma";
import type { ConsentTier, ConsentSource, AccessorType } from "@prisma/client";

/**
 * GDPR 4-tier samtykke-tjeneste
 * Tier 1: Nødvendig (alltid på, kan ikke trekkes)
 * Tier 2: Forbedring (default på, anonymisert)
 * Tier 3: AI-forskning (default av)
 * Tier 4: Kommersiell (default av)
 */

const TIER_HIERARCHY: ConsentTier[] = [
  "TIER_1_SERVICE",
  "TIER_2_IMPROVEMENT",
  "TIER_3_AI_RESEARCH",
  "TIER_4_COMMERCIAL",
];

export async function hasConsent(
  userId: string,
  tier: ConsentTier
): Promise<boolean> {
  // Tier 1 er alltid på (nødvendig for tjenesten)
  if (tier === "TIER_1_SERVICE") return true;

  const grant = await prisma.consentGrant.findFirst({
    where: { userId, tier },
    orderBy: { grantedAt: "desc" },
  });

  if (!grant) {
    // Default: Tier 2 = på, Tier 3/4 = av
    return tier === "TIER_2_IMPROVEMENT";
  }

  return grant.granted && !grant.revokedAt;
}

export async function getAllConsents(userId: string): Promise<
  Record<ConsentTier, { granted: boolean; grantedAt: Date | null; source: ConsentSource | null }>
> {
  const result = {} as Record<
    ConsentTier,
    { granted: boolean; grantedAt: Date | null; source: ConsentSource | null }
  >;

  for (const tier of TIER_HIERARCHY) {
    const grant = await prisma.consentGrant.findFirst({
      where: { userId, tier },
      orderBy: { grantedAt: "desc" },
    });

    if (tier === "TIER_1_SERVICE") {
      result[tier] = { granted: true, grantedAt: grant?.grantedAt ?? null, source: grant?.source ?? null };
    } else if (!grant) {
      result[tier] = {
        granted: tier === "TIER_2_IMPROVEMENT",
        grantedAt: null,
        source: null,
      };
    } else {
      const isGranted = grant.granted && !grant.revokedAt;
      result[tier] = {
        granted: isGranted,
        grantedAt: grant.grantedAt,
        source: grant.source,
      };
    }
  }

  return result;
}

export async function grantConsent(
  userId: string,
  tier: ConsentTier,
  source: ConsentSource,
  ipAddress?: string
): Promise<void> {
  if (tier === "TIER_1_SERVICE") {
    throw new Error("Tier 1 kan ikke endres — nødvendig for tjenesten");
  }

  await prisma.consentGrant.create({
    data: {
      userId,
      tier,
      granted: true,
      source,
      ipAddress: ipAddress ?? null,
    },
  });
}

export async function revokeConsent(
  userId: string,
  tier: ConsentTier,
  source: ConsentSource = "PROFILE_PAGE"
): Promise<void> {
  if (tier === "TIER_1_SERVICE") {
    throw new Error("Tier 1 kan ikke trekkes — nødvendig for tjenesten");
  }

  await prisma.consentGrant.create({
    data: {
      userId,
      tier,
      granted: false,
      source,
    },
  });
}

export async function toggleConsent(
  userId: string,
  tier: ConsentTier,
  newValue: boolean,
  source: ConsentSource = "PROFILE_PAGE",
  ipAddress?: string
): Promise<void> {
  if (newValue) {
    await grantConsent(userId, tier, source, ipAddress);
  } else {
    await revokeConsent(userId, tier, source);
  }
}

export async function logDataAccess(opts: {
  userId: string;
  accessor: AccessorType;
  accessorId?: string;
  purpose: string;
  fields: string[];
}): Promise<void> {
  await prisma.dataAccessLog.create({
    data: {
      userId: opts.userId,
      accessedBy: opts.accessor,
      accessedById: opts.accessorId ?? null,
      purpose: opts.purpose,
      fields: opts.fields,
    },
  });
}

export async function getDataAccessLogs(
  userId: string,
  opts?: { limit?: number; fromDate?: Date }
): Promise<
  Array<{
    id: string;
    accessedBy: AccessorType;
    purpose: string;
    fields: string[];
    occurredAt: Date;
  }>
> {
  const logs = await prisma.dataAccessLog.findMany({
    where: {
      userId,
      ...(opts?.fromDate && { occurredAt: { gte: opts.fromDate } }),
    },
    orderBy: { occurredAt: "desc" },
    take: opts?.limit ?? 50,
  });

  return logs.map((log) => ({
    id: log.id,
    accessedBy: log.accessedBy,
    purpose: log.purpose,
    fields: log.fields,
    occurredAt: log.occurredAt,
  }));
}

export async function filterByConsent<T extends { userId: string }>(
  items: T[],
  tier: ConsentTier
): Promise<T[]> {
  if (tier === "TIER_1_SERVICE") return items;

  const results = await Promise.all(
    items.map(async (item) => ({
      item,
      ok: await hasConsent(item.userId, tier),
    }))
  );

  return results.filter((r) => r.ok).map((r) => r.item);
}

// ── Onboarding-hjelper ──

export async function initializeDefaultConsents(
  userId: string,
  source: ConsentSource = "ONBOARDING",
  ipAddress?: string
): Promise<void> {
  // Tier 2: default PÅ (anonymisert forbedring)
  await grantConsent(userId, "TIER_2_IMPROVEMENT", source, ipAddress);
  // Tier 3/4: default AV (opt-in)
  await revokeConsent(userId, "TIER_3_AI_RESEARCH", source);
  await revokeConsent(userId, "TIER_4_COMMERCIAL", source);
}
