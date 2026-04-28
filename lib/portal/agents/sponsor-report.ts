/**
 * Agent: sponsor-report
 * Trigger: CRON 1. hver måned 09:00.
 * Handling: Genererer rapport per aktiv sponsor med antall coaching-okter,
 * antall registrerte runder og hoydepunkter for hver sponsoret spiller
 * forrige maned. Sender notification til sponsorens contactEmail
 * (epost-utsending kommer som follow-up).
 *
 * Aktivert Sprint 5 (2026-04-28): Sponsor + SponsorPlayerRelation modellene
 * er na migrert til DB.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "sponsor-report";
const MODEL = "rule-based";

export async function runSponsorReport(): Promise<AgentResult> {
  const started = Date.now();
  try {
    // Forrige maned (start + slutt)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Hent aktive sponsorer + spillere
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      include: {
        players: {
          where: {
            startedAt: { lte: monthEnd },
            OR: [{ endedAt: null }, { endedAt: { gte: monthStart } }],
          },
          include: {
            User: {
              select: {
                id: true,
                name: true,
                Booking: {
                  where: {
                    startTime: { gte: monthStart, lte: monthEnd },
                    status: "COMPLETED",
                  },
                  select: { id: true },
                },
                RoundStats: {
                  where: { date: { gte: monthStart, lte: monthEnd } },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    let reports = 0;
    for (const sponsor of sponsors) {
      if (sponsor.players.length === 0) continue;

      const totalSessions = sponsor.players.reduce(
        (sum, rel) => sum + rel.User.Booking.length,
        0,
      );
      const totalRounds = sponsor.players.reduce(
        (sum, rel) => sum + rel.User.RoundStats.length,
        0,
      );

      const summary = {
        sponsorId: sponsor.id,
        sponsorName: sponsor.name,
        period: `${monthStart.toISOString().slice(0, 7)}`,
        playerCount: sponsor.players.length,
        totalSessions,
        totalRounds,
        players: sponsor.players.map((rel) => ({
          name: rel.User.name,
          sessions: rel.User.Booking.length,
          rounds: rel.User.RoundStats.length,
        })),
      };

      // Notifiser Anders for review for utsending til sponsor
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
            title: `Sponsor-rapport klar: ${sponsor.name}`,
            message: `${sponsor.players.length} spillere · ${totalSessions} okter · ${totalRounds} runder forrige maned. Klar til utsending til ${sponsor.contactEmail ?? "sponsor"}.`,
            linkUrl: `/admin/okonomi/sponsorer/${sponsor.id}`,
          },
        });
      }

      logger.info(`[${AGENT_NAME}] generated report for ${sponsor.name}`, summary);
      reports += 1;
    }

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      output: `generated ${reports} sponsor-reports for ${monthStart.toISOString().slice(0, 7)}`,
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
