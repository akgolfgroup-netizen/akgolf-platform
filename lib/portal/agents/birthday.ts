/**
 * Agent: birthday
 * Trigger: CRON daglig 08:00.
 * Handling: Personlig melding fra coach på elevens bursdag.
 *
 * Aktivert Sprint 5 (2026-04-28): User.birthDate-felt er nå migrert.
 * Henter alle aktive STUDENT-brukere med birthDate som matcher dagens
 * måned + dag (PostgreSQL EXTRACT). Sender notification + valgfri SMS.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "birthday";

export async function runBirthday(): Promise<AgentResult> {
  const started = Date.now();
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Hent aktive spillere med matchende fodselsdato (maned + dag)
    const candidates = await prisma.$queryRaw<
      Array<{ id: string; name: string | null; birthDate: Date }>
    >`
      SELECT "id", "name", "birthDate"
      FROM "User"
      WHERE "isActive" = TRUE
        AND "role" = 'STUDENT'
        AND "birthDate" IS NOT NULL
        AND EXTRACT(MONTH FROM "birthDate") = ${todayMonth}
        AND EXTRACT(DAY FROM "birthDate") = ${todayDay}
    `;

    let sent = 0;
    for (const u of candidates) {
      const age = today.getFullYear() - new Date(u.birthDate).getFullYear();
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: u.id,
          type: "GENERAL",
          title: `Gratulerer med dagen, ${u.name?.split(" ")[0] ?? "spiller"}!`,
          message: `Måtte ${age}-årsdagen gi deg mange gode runder. Hilsen Anders og hele AK Golf-teamet.`,
          linkUrl: `/portal`,
        },
      });
      sent += 1;
    }

    await logAgentRun({
      name: AGENT_NAME,
      model: "rule-based",
      status: "success",
      duration: Date.now() - started,
      output: `sent ${sent} birthday msgs (date ${todayMonth}/${todayDay})`,
    });

    return { ran: true };
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    await logAgentRun({
      name: AGENT_NAME,
      model: "rule-based",
      status: "error",
      duration: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    return { ran: false, reason: "error" };
  }
}
