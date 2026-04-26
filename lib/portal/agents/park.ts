/**
 * Agent-park orkestrator.
 *
 * Sentralt API for å kjøre agenter med konsistent logging.
 * Brukes av event-routes (server actions, webhooks) og CRON-jobber.
 *
 * Eksempel:
 *   await runAgent("payment-collect", { bookingId });
 */

import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentName, AgentResult } from "./types";

// Importer alle agenter
import { onBookingCompleted, onCoachingSessionPublished, onUSISnapshotChanged, onTestResultLogged, onMetricSnapshotComputed } from "./runner";
import { runPaymentCollect } from "./payment-collect";
import { runCancellation } from "./cancellation";
import { runCoachPayout } from "./coach-payout";

// Sprint 3.2 agenter
import { runBookingConfirm } from "./booking-confirm";
import { runNoShow } from "./no-show";
import { runDunning } from "./dunning";
import { runOnboarding } from "./onboarding";
import { runWinback } from "./winback";
import { runBirthday } from "./birthday";
import { runSponsorReport } from "./sponsor-report";
import { runDegradationFlag } from "./degradation-flag";

export interface RunAgentPayload {
  bookingId?: string;
  userId?: string;
  sessionId?: string;
  testResultId?: string;
  snapshotId?: string;
  oldUSI?: number | null;
  newUSI?: number;
}

/**
 * Kjør en agent ved navn med en payload.
 * Returnerer AgentResult. Logger automatisk start/slutt til AgentLog.
 */
export async function runAgent(
  name: AgentName,
  payload: RunAgentPayload = {},
): Promise<AgentResult> {
  const started = Date.now();

  try {
    let result: AgentResult;

    switch (name) {
      case "post-session-transcriber":
        if (!payload.bookingId) throw new Error("bookingId required");
        result = await onBookingCompleted(payload.bookingId);
        break;

      case "next-session-planner":
        if (!payload.sessionId) throw new Error("sessionId required");
        result = await onCoachingSessionPublished(payload.sessionId);
        break;

      case "usi-focus-updater":
        if (!payload.userId || payload.newUSI === undefined) {
          throw new Error("userId and newUSI required");
        }
        result = await onUSISnapshotChanged(payload.userId, payload.oldUSI ?? null, payload.newUSI);
        break;

      case "test-retest-scheduler":
        if (!payload.testResultId) throw new Error("testResultId required");
        result = await onTestResultLogged(payload.testResultId);
        break;

      case "degradation-flagger":
        if (!payload.snapshotId) throw new Error("snapshotId required");
        result = await onMetricSnapshotComputed(payload.snapshotId);
        break;

      case "payment-collect":
        if (!payload.bookingId) throw new Error("bookingId required");
        result = await runPaymentCollect(payload.bookingId);
        break;

      case "cancellation":
        if (!payload.bookingId) throw new Error("bookingId required");
        result = await runCancellation(payload.bookingId);
        break;

      case "coach-payout":
        result = await runCoachPayout();
        break;

      case "booking-confirm":
        if (!payload.bookingId) throw new Error("bookingId required");
        result = await runBookingConfirm(payload.bookingId);
        break;

      case "no-show":
        result = await runNoShow();
        break;

      case "dunning":
        result = await runDunning();
        break;

      case "onboarding":
        if (!payload.userId) throw new Error("userId required");
        result = await runOnboarding(payload.userId);
        break;

      case "winback":
        result = await runWinback();
        break;

      case "birthday":
        result = await runBirthday();
        break;

      case "sponsor-report":
        result = await runSponsorReport();
        break;

      case "degradation-flag":
        if (!payload.userId) throw new Error("userId required");
        result = await runDegradationFlag(payload.userId);
        break;

      default:
        throw new Error(`Unknown agent: ${name}`);
    }

    return { ...result, duration: Date.now() - started };
  } catch (err) {
    logger.error(`[agent-park] ${name} failed`, err);
    await prisma.agentLog
      .create({
        data: {
          id: nanoid(),
          agentType: name,
          model: "park-orchestrator",
          status: "error",
          duration: Date.now() - started,
          input: JSON.stringify(payload),
          error: err instanceof Error ? err.message : String(err),
        },
      })
      .catch(() => {});
    return { ran: false, reason: "error", duration: Date.now() - started };
  }
}

/**
 * Fire-and-forget kjøring av agent. Bruker `void` så caller ikke venter.
 * Bruk for server actions hvor vi ikke vil blokke responsen.
 */
export function runAgentInBackground(name: AgentName, payload: RunAgentPayload = {}): void {
  void runAgent(name, payload).catch((err) => {
    logger.error(`[agent-park] background ${name} failed`, err);
  });
}
