/**
 * Agent: test-retest-reminder
 * Trigger: CRON daglig 06:00 CET.
 * Handling: Sender Notification til spillere som har tester forfalt for retest
 *           (>56 dager siden siste utforing, eller >84 for langtid-tester).
 *
 * Bruker eksisterende `isTestOverdue` fra test-scheduler.ts. Sender bare
 * en Notification per test per 14 dager for a unnga spam.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";
import { isTestOverdue } from "@/lib/portal/training/test-scheduler";

const AGENT_NAME = "test-retest-reminder";
const MODEL = "rule-based";
const NOTIFICATION_COOLDOWN_DAYS = 14;

export async function runTestRetestReminder(): Promise<AgentResult> {
  const started = Date.now();
  try {
    // Hent alle aktive spillere
    const students = await prisma.user.findMany({
      where: { role: "STUDENT", isActive: true },
      select: { id: true, name: true },
    });

    // Alle de 20 fastsatte testene
    const tests = await prisma.testDefinition.findMany({
      where: { testNumber: { lte: 20 } },
      select: { testNumber: true, name: true },
    });

    let notified = 0;
    let skippedCooldown = 0;
    const cooldownCutoff = new Date();
    cooldownCutoff.setDate(cooldownCutoff.getDate() - NOTIFICATION_COOLDOWN_DAYS);

    for (const student of students) {
      // Hent siste resultat per test for denne spilleren
      const latestResults = await prisma.testResult.findMany({
        where: { userId: student.id },
        orderBy: { createdAt: "desc" },
        select: { testNumber: true, createdAt: true },
        distinct: ["testNumber"],
      });
      const latestByTest = new Map(
        latestResults.map((r) => [r.testNumber, r.createdAt]),
      );

      // Identifiser forfalte tester (alltid forfalt om aldri utfort)
      const overdueTestNumbers: number[] = [];
      for (const t of tests) {
        const latest = latestByTest.get(t.testNumber);
        if (!latest || isTestOverdue(latest, t.testNumber)) {
          overdueTestNumbers.push(t.testNumber);
        }
      }

      if (overdueTestNumbers.length === 0) continue;

      // Sjekk cooldown — har vi sendt en retest-reminder siste 14 dager?
      const recent = await prisma.notification.findFirst({
        where: {
          userId: student.id,
          type: "GENERAL",
          title: { contains: "Test forfalt" },
          createdAt: { gte: cooldownCutoff },
        },
      });
      if (recent) {
        skippedCooldown += 1;
        continue;
      }

      // Lag samlet Notification per spiller (ikke en per test — det er spam)
      const overdueCount = overdueTestNumbers.length;
      const message =
        overdueCount === 1
          ? `Du har 1 test som er forfalt for retest. Apne tester-sida for a se hva som venter.`
          : `Du har ${overdueCount} tester som er forfalt for retest. Apne tester-sida for a se hva som venter.`;

      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: student.id,
          type: "GENERAL",
          title: `Test forfalt for retest`,
          message,
          linkUrl: `/portal/tester`,
        },
      });
      notified += 1;
    }

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      output: `notified ${notified} students (${skippedCooldown} skipped: cooldown)`,
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
