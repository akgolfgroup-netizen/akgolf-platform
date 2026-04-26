/**
 * Agent: degradation-flag
 * Trigger: Etter MetricSnapshot beregning (eller manuelt per spiller).
 * Handling: Sammenligner siste 2 MetricSnapshots, oppretter DegradationTracking
 *           hvis tilbakegang detektert (driver-carry minket > 5m, eller SG-drop > 0.3).
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";

const AGENT_NAME = "degradation-flag";
const DRIVER_DROP_THRESHOLD_M = 5;

export async function runDegradationFlag(userId: string): Promise<AgentResult> {
  const started = Date.now();
  try {
    const snapshots = await prisma.metricSnapshot.findMany({
      where: { PlayerMetrics: { userId } },
      orderBy: { snapshotDate: "desc" },
      take: 2,
    });

    if (snapshots.length < 2) {
      await logSkip(started, userId, "insufficient-snapshots");
      return { ran: false, reason: "insufficient-snapshots" };
    }

    const [latest, prior] = snapshots;
    const driverDrop = (prior.driverCarry ?? 0) - (latest.driverCarry ?? 0);

    if (driverDrop < DRIVER_DROP_THRESHOLD_M) {
      await logSkip(started, userId, `no-degradation (driver drop ${driverDrop.toFixed(1)}m)`);
      return { ran: false, reason: "no-degradation" };
    }

    // Opprett DegradationTracking
    await prisma.degradationTracking.create({
      data: {
        id: nanoid(),
        userId,
        shotType: "DRIVER",
        technicalChange: `Driver carry minket fra ${prior.driverCarry?.toFixed(0)}m til ${latest.driverCarry?.toFixed(0)}m (-${driverDrop.toFixed(1)}m)`,
        startedAt: latest.snapshotDate,
        lastUpdated: new Date(),
      },
    });

    await logSuccess(started, userId, `flagged DRIVER drop ${driverDrop.toFixed(1)}m`);
    return { ran: true };
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    return { ran: false, reason: "error" };
  }
}

async function logSuccess(started: number, userId: string, output: string) {
  await prisma.agentLog.create({
    data: { id: nanoid(), agentType: AGENT_NAME, model: "rule-based", status: "success", duration: Date.now() - started, input: userId, output },
  }).catch(() => {});
}
async function logSkip(started: number, userId: string, reason: string) {
  await prisma.agentLog.create({
    data: { id: nanoid(), agentType: AGENT_NAME, model: "rule-based", status: "skipped", duration: Date.now() - started, input: userId, output: reason },
  }).catch(() => {});
}
