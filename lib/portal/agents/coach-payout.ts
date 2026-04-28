/**
 * Agent: coach-payout
 *
 * Trigger: Månedsslutt CRON (siste dag i måneden 23:55).
 * Handling:
 *   1. Kalkuler payout for forrige måned
 *   2. Lagre resultat i AgentLog som JSON
 *   3. Send notifikasjon til Anders med oppsummering
 *
 * Senere: generer PDF-lønnsslipp + send til regnskap.
 */

import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { calculatePayoutForMonth } from "@/lib/portal/payout/calculator";
import { logAgentRun } from "./log";

const AGENT_NAME = "coach-payout";
const MODEL = "rule-based";

export async function runCoachPayout(monthDate?: Date): Promise<{
  ran: boolean;
  totalKr?: number;
  lineCount?: number;
  reason?: string;
}> {
  const started = Date.now();
  try {
    const result = await calculatePayoutForMonth(monthDate);

    // Lagre payout-snapshot
    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      input: result.monthStart.toISOString().slice(0, 7),
      output: JSON.stringify({
        totalKr: result.totalKr,
        lines: result.lines.map((l) => ({
          name: l.instructorName,
          model: l.model,
          payout: l.totalPayoutKr,
          sessions: l.sessionCount,
        })),
      }),
    });

    // Notify Anders (admin)
    const anders = await prisma.user.findFirst({
      where: { email: "anders@akgolf.no", role: "ADMIN" },
      select: { id: true },
    });
    if (anders) {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: anders.id,
          type: "AI_INSIGHT",
          title: `Payout ${result.monthStart.toLocaleString("nb-NO", { month: "long", year: "numeric" })} klar`,
          message: `Total: ${result.totalKr.toLocaleString("nb-NO")} kr · ${result.lines.length} trenere · ${result.lines.reduce((n, l) => n + l.sessionCount, 0)} økter`,
          linkUrl: `/admin/okonomi/v2`,
        },
      });
    }

    return {
      ran: true,
      totalKr: result.totalKr,
      lineCount: result.lines.length,
    };
  } catch (err) {
    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "error",
      duration: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    logger.error(`[${AGENT_NAME}] failed`, err);
    return { ran: false, reason: "error" };
  }
}
