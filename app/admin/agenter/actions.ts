"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { AgentStatus, AgentTeam } from "@prisma/client";

// ── Types ──────────────────────────────────────────────────────────────

export type AgentData = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  team: AgentTeam;
  model: string;
  tools: string[];
  skills: string[];
  avatarPath: string;
  status: AgentStatus;
  isActive: boolean;
  actionsToday: number;
  costMtd: number;
  lastActionAt: Date | null;
};

export type AgentStats = {
  total: number;
  active: number;
  actionsToday: number;
  costMtd: number;
};

// ── Data fetching ──────────────────────────────────────────────────────

export async function getAgents(): Promise<AgentData[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const agents = await prisma.agent.findMany({
    orderBy: [{ team: "asc" }, { displayName: "asc" }],
    include: {
      AgentConfig: {
        where: { userId: user.id },
        select: { isActive: true },
      },
      AgentLog: {
        where: { createdAt: { gte: startOfDay } },
        select: { id: true },
      },
      _count: {
        select: {
          AgentLog: {
            where: { createdAt: { gte: startOfDay } },
          },
        },
      },
    },
  });

  // Get monthly costs per agent
  const monthlyCosts = await prisma.agentLog.groupBy({
    by: ["agentId"],
    where: {
      createdAt: { gte: startOfMonth },
      cost: { not: null },
    },
    _sum: { cost: true },
  });

  const costMap = new Map(
    monthlyCosts
      .filter((c): c is typeof c & { agentId: string } => c.agentId !== null)
      .map((c) => [c.agentId, c._sum.cost ?? 0])
  );

  // Get last action per agent
  const lastActions = await prisma.agentLog.groupBy({
    by: ["agentId"],
    _max: { createdAt: true },
  });

  const lastActionMap = new Map(
    lastActions
      .filter((a): a is typeof a & { agentId: string } => a.agentId !== null)
      .map((a) => [a.agentId, a._max.createdAt])
  );

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    displayName: agent.displayName,
    description: agent.description,
    team: agent.team,
    model: agent.model,
    tools: agent.tools,
    skills: agent.skills,
    avatarPath: agent.avatarPath,
    status: agent.status,
    isActive: agent.AgentConfig[0]?.isActive ?? agent.status === "ACTIVE",
    actionsToday: agent._count.AgentLog,
    costMtd: costMap.get(agent.id) ?? 0,
    lastActionAt: lastActionMap.get(agent.id) ?? null,
  }));
}

export async function getAgentStats(): Promise<AgentStats> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return { total: 0, active: 0, actionsToday: 0, costMtd: 0 };
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalAgents, activeAgents, todayActions, monthlyCost] =
    await Promise.all([
      prisma.agent.count(),
      prisma.agent.count({ where: { status: "ACTIVE" } }),
      prisma.agentLog.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.agentLog.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          cost: { not: null },
        },
        _sum: { cost: true },
      }),
    ]);

  return {
    total: totalAgents,
    active: activeAgents,
    actionsToday: todayActions,
    costMtd: monthlyCost._sum.cost ?? 0,
  };
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function toggleAgent(
  agentId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!isStaff(user.role)) {
      return { success: false, error: "Ikke tilgang" };
    }

    await prisma.agentConfig.upsert({
      where: {
        userId_agentId: { userId: user.id, agentId },
      },
      update: { isActive },
      create: {
        userId: user.id,
        agentId,
        isActive,
      },
    });

    revalidatePath("/admin/agenter");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
