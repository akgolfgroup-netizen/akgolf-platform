/**
 * Agent: sponsor-report
 * Trigger: CRON 1. hver måned 09:00.
 * Handling: Generer rapport per sponsor med antall økter, NPS, høydepunkter.
 *
 * NB: Sponsor-modell kommer i Sprint 5.2. Foreløpig logger agenten kun
 * en stub-output. Wires opp når Sponsor-modellen er på plass.
 */
import { logger } from "@/lib/logger";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "sponsor-report";
const MODEL = "rule-based";

export async function runSponsorReport(): Promise<AgentResult> {
  const started = Date.now();
  try {
    // TODO Sprint 5.2: Hent ekte sponsorer fra Sponsor-modellen
    const sponsorCount = 0;

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "skipped",
      duration: Date.now() - started,
      output: `pending Sponsor-modell (Sprint 5.2). Ville sendt ${sponsorCount} rapporter.`,
    });

    return { ran: false, reason: "sponsor-model-pending" };
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
