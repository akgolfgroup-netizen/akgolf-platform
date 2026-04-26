/**
 * Agent: sponsor-report
 * Trigger: CRON 1. hver måned 09:00.
 * Handling: Generer rapport per sponsor med antall økter, NPS, høydepunkter.
 *
 * NB: Sponsor-modell kommer i Sprint 5.2. Foreløpig logger agenten kun
 * en stub-output. Wires opp når Sponsor-modellen er på plass.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";

const AGENT_NAME = "sponsor-report";

export async function runSponsorReport(): Promise<AgentResult> {
  const started = Date.now();
  try {
    // TODO Sprint 5.2: Hent ekte sponsorer fra Sponsor-modellen
    const sponsorCount = 0;

    await prisma.agentLog.create({
      data: {
        id: nanoid(),
        agentType: AGENT_NAME,
        model: "rule-based",
        status: "skipped",
        duration: Date.now() - started,
        output: `pending Sponsor-modell (Sprint 5.2). Ville sendt ${sponsorCount} rapporter.`,
      },
    }).catch(() => {});

    return { ran: false, reason: "sponsor-model-pending" };
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    return { ran: false, reason: "error" };
  }
}
