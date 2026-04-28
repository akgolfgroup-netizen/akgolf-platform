/**
 * Agent: winback
 * Trigger: CRON daglig 09:00.
 * Handling: Personlig vinn-tilbake-melding for elever inaktive 21+ dager.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "winback";
const MODEL = "rule-based";
const INACTIVITY_DAYS = 21;

export async function runWinback(): Promise<AgentResult> {
  const started = Date.now();
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - INACTIVITY_DAYS);

    const inactives = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        isActive: true,
        OR: [
          { lastActiveAt: { lt: cutoff } },
          { lastActiveAt: null, createdAt: { lt: cutoff } },
        ],
      },
      take: 50,
      select: { id: true, name: true, lastActiveAt: true },
    });

    let notified = 0;
    for (const u of inactives) {
      // Sjekk at vi ikke har sendt winback siste 14 dager
      const recentWinback = await prisma.notification.findFirst({
        where: {
          userId: u.id,
          type: "GENERAL",
          title: { contains: "Savner deg" },
          createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        },
      });
      if (recentWinback) continue;

      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: u.id,
          type: "GENERAL",
          title: `Savner deg, ${u.name?.split(" ")[0] ?? "spiller"}`,
          message: "Det er en stund siden du var innom — vi har en ny drill som passer deg perfekt. Klar for neste økt?",
          linkUrl: `/portal/bookinger`,
        },
      });
      notified += 1;
    }

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      output: `notified ${notified} inactives`,
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
