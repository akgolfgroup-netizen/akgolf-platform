"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { Capability, UserRole, CapabilityChangeAction } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { getPreset, CAPABILITY_PRESETS } from "@/lib/portal/capabilities";
import {
  clearCapabilityCache,
  hasCapability,
} from "@/lib/portal/capabilities/check";
import {
  requireSensitiveAuth,
  confirmSensitiveAuth,
} from "@/lib/portal/capabilities/sensitive-guard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface TeamMemberRow {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  capabilityCount: number;
  capabilities: Capability[];
}

export interface AuditLogRow {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  capability: Capability;
  action: CapabilityChangeAction;
  performedBy: string;
  performedByName: string | null;
  performedAt: string;
  reason: string | null;
}

async function requireUsersManagement(): Promise<{ userId: string }> {
  const user = await requirePortalUser();
  const allowed =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.USERS_VIEW));
  if (!allowed) {
    throw new Error("Manglende tilgang til brukeradministrasjon.");
  }
  return { userId: user.id };
}

async function requireCapabilityAssignment(): Promise<{ userId: string }> {
  const user = await requirePortalUser();
  const allowed =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.USERS_ASSIGN_CAPABILITIES));
  if (!allowed) {
    throw new Error("Kan ikke tildele kapabiliteter.");
  }
  await requireSensitiveAuth();
  return { userId: user.id };
}

export async function fetchTeamMembers(): Promise<TeamMemberRow[]> {
  await requireUsersManagement();

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.INVITED],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastActiveAt: true,
      createdAt: true,
      UserCapability: {
        where: {
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        select: { capability: true },
      },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    lastActiveAt: u.lastActiveAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
    capabilityCount: u.UserCapability.length,
    capabilities: u.UserCapability.map((c) => c.capability),
  }));
}

export async function inviteTeamMember(input: {
  email: string;
  name: string;
  role: UserRole;
  capabilities: Capability[];
  presetId?: string;
}): Promise<{ userId: string }> {
  const { userId: invitedBy } = await requireCapabilityAssignment();

  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("Ugyldig e-postadresse.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Det finnes allerede en bruker med denne e-postadressen.");
  }

  const resolvedCapabilities = input.presetId
    ? getPreset(input.presetId)?.capabilities ?? []
    : input.capabilities;

  const dedup = Array.from(new Set(resolvedCapabilities));

  const admin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: invited, error: inviteErr } =
    await admin.auth.admin.inviteUserByEmail(email);
  if (inviteErr) {
    throw new Error(`Invitasjon feilet: ${inviteErr.message}`);
  }

  const newUserId = nanoid();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        id: newUserId,
        email,
        name: input.name.trim() || null,
        role: input.role,
        supabaseId: invited?.user?.id ?? null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    if (dedup.length > 0) {
      await tx.userCapability.createMany({
        data: dedup.map((capability) => ({
          userId: newUserId,
          capability,
          grantedBy: invitedBy,
          grantedAt: now,
        })),
      });

      await tx.capabilityChangeLog.createMany({
        data: dedup.map((capability) => ({
          userId: newUserId,
          capability,
          action: CapabilityChangeAction.GRANT,
          performedBy: invitedBy,
          performedAt: now,
          reason: input.presetId ? `Preset: ${input.presetId}` : "Opprettet ved invitasjon",
        })),
      });
    }
  });

  revalidatePath("/admin/team");
  return { userId: newUserId };
}

export async function updateUserRole(input: {
  userId: string;
  role: UserRole;
}): Promise<void> {
  const caller = await requirePortalUser();
  const allowed =
    caller.role === UserRole.ADMIN ||
    (await hasCapability(caller.id, Capability.USERS_ASSIGN_ROLE));
  if (!allowed) {
    throw new Error("Kan ikke endre rolle.");
  }

  await requireSensitiveAuth();

  await prisma.user.update({
    where: { id: input.userId },
    data: { role: input.role, updatedAt: new Date() },
  });

  clearCapabilityCache(input.userId);
  revalidatePath("/admin/team");
}

export async function confirmSensitiveAction(password: string): Promise<void> {
  await requirePortalUser();
  await confirmSensitiveAuth(password);
}

export async function updateUserCapabilities(input: {
  userId: string;
  capabilities: Capability[];
  reason?: string;
}): Promise<void> {
  const { userId: performedBy } = await requireCapabilityAssignment();

  const desired = new Set<Capability>(input.capabilities);
  const existing = await prisma.userCapability.findMany({
    where: { userId: input.userId },
    select: { capability: true },
  });
  const current = new Set(existing.map((e) => e.capability));

  const toGrant = [...desired].filter((c) => !current.has(c));
  const toRevoke = [...current].filter((c) => !desired.has(c));

  if (toGrant.length === 0 && toRevoke.length === 0) {
    return;
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    if (toGrant.length > 0) {
      await tx.userCapability.createMany({
        data: toGrant.map((capability) => ({
          userId: input.userId,
          capability,
          grantedBy: performedBy,
          grantedAt: now,
        })),
        skipDuplicates: true,
      });
    }

    if (toRevoke.length > 0) {
      await tx.userCapability.deleteMany({
        where: {
          userId: input.userId,
          capability: { in: toRevoke },
        },
      });
    }

    const logRows = [
      ...toGrant.map((capability) => ({
        userId: input.userId,
        capability,
        action: CapabilityChangeAction.GRANT,
        performedBy,
        performedAt: now,
        reason: input.reason ?? null,
      })),
      ...toRevoke.map((capability) => ({
        userId: input.userId,
        capability,
        action: CapabilityChangeAction.REVOKE,
        performedBy,
        performedAt: now,
        reason: input.reason ?? null,
      })),
    ];

    if (logRows.length > 0) {
      await tx.capabilityChangeLog.createMany({ data: logRows });
    }
  });

  clearCapabilityCache(input.userId);
  revalidatePath("/admin/team");
}

export async function applyPreset(input: {
  userId: string;
  presetId: string;
  reason?: string;
}): Promise<void> {
  const preset = getPreset(input.presetId);
  if (!preset) throw new Error(`Ukjent preset: ${input.presetId}`);

  await updateUserCapabilities({
    userId: input.userId,
    capabilities: preset.capabilities,
    reason: input.reason ?? `Preset: ${preset.label}`,
  });
}

export async function deactivateUser(input: {
  userId: string;
}): Promise<void> {
  const caller = await requirePortalUser();
  const allowed =
    caller.role === UserRole.ADMIN ||
    (await hasCapability(caller.id, Capability.USERS_DEACTIVATE));
  if (!allowed) {
    throw new Error("Kan ikke deaktivere bruker.");
  }

  await prisma.user.update({
    where: { id: input.userId },
    data: { isActive: false, updatedAt: new Date() },
  });

  clearCapabilityCache(input.userId);
  revalidatePath("/admin/team");
}

export async function reactivateUser(input: {
  userId: string;
}): Promise<void> {
  const caller = await requirePortalUser();
  const allowed =
    caller.role === UserRole.ADMIN ||
    (await hasCapability(caller.id, Capability.USERS_DEACTIVATE));
  if (!allowed) {
    throw new Error("Kan ikke reaktivere bruker.");
  }

  await prisma.user.update({
    where: { id: input.userId },
    data: { isActive: true, updatedAt: new Date() },
  });

  revalidatePath("/admin/team");
}

export async function fetchAuditLog(params?: {
  userId?: string;
  limit?: number;
}): Promise<AuditLogRow[]> {
  const caller = await requirePortalUser();
  const allowed =
    caller.role === UserRole.ADMIN ||
    (await hasCapability(caller.id, Capability.GDPR_VIEW_AUDIT_LOG)) ||
    (await hasCapability(caller.id, Capability.USERS_ASSIGN_CAPABILITIES));
  if (!allowed) {
    throw new Error("Manglende tilgang til audit-logg.");
  }

  const rows = await prisma.capabilityChangeLog.findMany({
    where: params?.userId ? { userId: params.userId } : undefined,
    orderBy: { performedAt: "desc" },
    take: params?.limit ?? 200,
  });

  const userIds = Array.from(
    new Set([...rows.map((r) => r.userId), ...rows.map((r) => r.performedBy)])
  );

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: userMap.get(r.userId)?.name ?? null,
    userEmail: userMap.get(r.userId)?.email ?? null,
    capability: r.capability,
    action: r.action,
    performedBy: r.performedBy,
    performedByName: userMap.get(r.performedBy)?.name ?? null,
    performedAt: r.performedAt.toISOString(),
    reason: r.reason,
  }));
}

export async function listPresets() {
  return CAPABILITY_PRESETS.map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
    capabilityCount: p.capabilities.length,
  }));
}
