/**
 * Sentralt logging-system for agenter.
 *
 * Sikrer at alle AgentLog-rader får riktig agentId via cache-mapping
 * fra navn →’ id. Dette får CoachHQ /admin/agenter til å vise korrekt
 * antall handlinger og kostnad per agent.
 *
 * Bruk fra alle lifecycle-agenter og runner.ts:
 *   await logAgentRun({ name: "birthday", model: "rule-based", status: "success", ... });
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";

const idCache = new Map<string, string | null>();

/**
 * Henter Agent.id basert på Agent.name. Cacher resultatet i minne.
 * Returnerer null hvis agenten ikke er seedet — logging fungerer fortsatt
 * uten FK-kobling, men UI-tellinger blir tomme inntil seed kjøres.
 */
export async function getAgentIdByName(name: string): Promise<string | null> {
  if (idCache.has(name)) return idCache.get(name) ?? null;
  try {
    const agent = await prisma.agent.findUnique({
      where: { name },
      select: { id: true },
    });
    const id = agent?.id ?? null;
    idCache.set(name, id);
    return id;
  } catch (err) {
    logger.error(`[agent-log] failed to resolve agentId for ${name}`, err);
    return null;
  }
}

/** Tving en cache-refresh — brukes etter seed eller manuell DB-Endring. */
export function clearAgentIdCache(): void {
  idCache.clear();
}

export type AgentRunStatus = "success" | "error" | "skipped" | "running";

export interface LogAgentRunParams {
  /** Agent.name — må matche AGENT_REGISTRY-nøkkel for FK-kobling. */
  name: string;
  model: string;
  status: AgentRunStatus;
  duration?: number;
  cost?: number | null;
  input?: string;
  output?: string;
  error?: string;
}

/**
 * Logg én agent-kjøring til AgentLog.
 *
 * Setter automatisk agentId-FK basert på name slik at CoachHQ /admin/agenter
 * viser korrekte tellinger og kostnad per agent. Feiler aldri — alle
 * exceptions fanges og logges via logger.error.
 */
export async function logAgentRun(params: LogAgentRunParams): Promise<void> {
  try {
    const agentId = await getAgentIdByName(params.name);
    await prisma.agentLog.create({
      data: {
        id: nanoid(),
        agentId,
        agentType: params.name,
        model: params.model,
        status: params.status,
        duration: params.duration,
        cost: params.cost ?? null,
        input: params.input,
        output: params.output,
        error: params.error,
      },
    });
  } catch (err) {
    logger.error(`[agent-log] failed for ${params.name}`, err);
  }
}
