/**
 * Agent: dunning (purrelogikk)
 * Trigger: CRON daglig 10:00.
 * Handling: 3-trinns purring på forfalt faktura.
 *   - 7 dager forfalt: vennlig påminnelse
 *   - 14 dager forfalt: andre påminnelse
 *   - 21 dager forfalt: eskaler til Anders
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import type { AgentResult } from "./types";
import { logAgentRun } from "./log";

const AGENT_NAME = "dunning";
const MODEL = "rule-based";

export async function runDunning(): Promise<AgentResult> {
  const started = Date.now();
  try {
    const now = new Date();
    const day7 = new Date(now); day7.setDate(day7.getDate() - 7);
    const day14 = new Date(now); day14.setDate(day14.getDate() - 14);
    const day21 = new Date(now); day21.setDate(day21.getDate() - 21);

    const overdue = await prisma.paymentTransaction.findMany({
      where: {
        status: "PENDING",
        paymentMethod: "INVOICE",
        createdAt: { lte: day7 },
      },
      include: { Booking: { include: { User: { select: { id: true, name: true, email: true } } } } },
      take: 100,
    });

    let stage1 = 0, stage2 = 0, stage3 = 0;
    for (const tx of overdue) {
      const userId = tx.Booking?.User?.id;
      if (!userId) continue;

      const isStage3 = tx.createdAt <= day21;
      const isStage2 = !isStage3 && tx.createdAt <= day14;
      const isStage1 = !isStage2 && !isStage3;

      if (isStage3) {
        // Eskalering til Anders
        const anders = await prisma.user.findFirst({ where: { email: "anders@akgolf.no" }, select: { id: true } });
        if (anders) {
          await prisma.notification.create({
            data: {
              id: nanoid(),
              userId: anders.id,
              type: "AI_INSIGHT",
              title: `Faktura forfalt 21+ dager — ${tx.Booking?.User?.name ?? "ukjent"}`,
              message: `Beløp: ${tx.grossAmount} kr. Eskalering kreves.`,
              linkUrl: `/admin/okonomi/v2`,
            },
          });
        }
        stage3 += 1;
      } else if (isStage2) {
        await prisma.notification.create({
          data: {
            id: nanoid(),
            userId,
            type: "GENERAL",
            title: "Faktura forfalt — andre påminnelse",
            message: `Beløp ${tx.grossAmount} kr forfalt 14 dager. Vennligst betal.`,
            linkUrl: `/portal/abonnement`,
          },
        });
        stage2 += 1;
      } else if (isStage1) {
        await prisma.notification.create({
          data: {
            id: nanoid(),
            userId,
            type: "GENERAL",
            title: "Påminnelse om faktura",
            message: `Faktura på ${tx.grossAmount} kr forfalt 7 dager.`,
            linkUrl: `/portal/abonnement`,
          },
        });
        stage1 += 1;
      }
    }

    await logAgentRun({
      name: AGENT_NAME,
      model: MODEL,
      status: "success",
      duration: Date.now() - started,
      output: `stage1=${stage1} stage2=${stage2} stage3=${stage3}`,
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
