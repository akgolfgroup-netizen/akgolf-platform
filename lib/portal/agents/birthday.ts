/**
 * Agent: birthday
 * Trigger: CRON daglig 08:00.
 * Handling: Personlig melding fra coach på elevens bursdag.
 *
 * NB: Bursdag-felt mangler på User i dag (TODO Prisma-utvidelse).
 * Foreløpig brukes createdAt-måned/dag som proxy. Wires opp med ekte
 * birthday-felt i Sprint 6.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";

const AGENT_NAME = "birthday";

export async function runBirthday(): Promise<AgentResult> {
  const started = Date.now();
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // TODO: bytt til ekte birthDate-felt når den er på User
    // Foreløpig stub — ingen ekte sjekk siden feltet mangler.
    const candidates: Array<{ id: string; name: string | null }> = [];

    let sent = 0;
    for (const u of candidates) {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: u.id,
          type: "GENERAL",
          title: `Gratulerer med dagen, ${u.name?.split(" ")[0] ?? "spiller"}!`,
          message: "Måtte år nummer X gi deg mange gode runder. Hilsen Anders.",
          linkUrl: `/portal`,
        },
      });
      sent += 1;
    }

    await prisma.agentLog.create({
      data: {
        id: nanoid(),
        agentType: AGENT_NAME,
        model: "rule-based",
        status: "success",
        duration: Date.now() - started,
        output: `sent ${sent} birthday msgs (date ${todayMonth}/${todayDay})`,
      },
    }).catch(() => {});

    return { ran: true };
  } catch (err) {
    logger.error(`[${AGENT_NAME}] failed`, err);
    return { ran: false, reason: "error" };
  }
}
