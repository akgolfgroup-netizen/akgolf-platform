/**
 * Agent: no-show
 * Trigger: CRON hvert 15. min.
 * Handling: Marker bookinger som NO_SHOW hvis ikke checked-in 15 min etter start.
 *           Trigger payment-collect (faktura/trekk skal fortsatt skje).
 */
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "no-show";
const MODEL = "rule-based";
const NO_SHOW_BUFFER_MINUTES = 15;

export async function runNoShow(): Promise<AgentResult> {
  const started = Date.now();
  try {
    const cutoff = new Date(Date.now() - NO_SHOW_BUFFER_MINUTES * 60 * 1000);

    // Bookinger som var planlagt > 15 min siden, fortsatt CONFIRMED, ingen check-in
    const candidates = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        startTime: { lt: cutoff },
        endTime: { gt: cutoff }, // ikke ferdig ennå
      },
      take: 50,
    });

    let marked = 0;
    for (const b of candidates) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { status: "NO_SHOW" },
      });
      marked += 1;
    }

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      output: `marked ${marked} no-shows`,
    });

    return { ran: true };
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "error",
      duration: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    return { ran: false, reason: "error" };
  }
}
