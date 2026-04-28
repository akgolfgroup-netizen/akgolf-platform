/**
 * Agent: onboarding
 * Trigger: Ny elev opprettet (User.createdAt < 1 time, role STUDENT eller VISITOR med subscription).
 * Handling: Velkomst-melding + mental-baseline-skjema-link + første-økt-link.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "onboarding";
const MODEL = "rule-based";

export async function runOnboarding(userId: string): Promise<AgentResult> {
  const started = Date.now();
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      await logAgentRun({
        name: AGENT_NAME,
        model: MODEL,
        status: "skipped",
        duration: Date.now() - started,
        input: userId,
        output: "no-user",
      });
      return { ran: false, reason: "no-user" };
    }

    // Velkomst-notifikasjon
    await prisma.notification.create({
      data: {
        id: nanoid(),
        userId: user.id,
        type: "GENERAL",
        title: `Velkommen til AK Golf, ${user.name?.split(" ")[0] ?? ""}`,
        message: "Start med å fylle ut din mentale baseline (5 min) — vi tilpasser coachingen din basert på dette.",
        linkUrl: `/portal/onboarding`,
      },
    });

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      input: userId,
      output: `welcomed ${user.email}`,
    });

    return { ran: true };
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "error",
      duration: Date.now() - started,
      input: userId,
      error: err instanceof Error ? err.message : String(err),
    });
    return { ran: false, reason: "error" };
  }
}
