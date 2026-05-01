// VERIFY: Coach-agent — naturlig-språk plan-oppdatering
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 4.5, Fase 7

import { prisma } from "@/lib/portal/prisma";

export interface CoachAgentMessage {
  role: "user" | "assistant";
  content: string;
}

/** Oppretter en coach-agent-sesjon */
export async function createOrContinueSession(
  studentId: string,
  coachId: string,
  message: string,
): Promise<{ reply: string; sessionId: string }> {
  const reply = generatePlaceholderReply(message);

  const session = await prisma.coachAgentSession.create({
    data: {
      studentId,
      coachId,
      prompt: message,
      response: reply,
    },
  });

  return { reply, sessionId: session.id };
}

function generatePlaceholderReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("putt") || lower.includes("putting")) {
    return "Jeg foreslår å øke putting-fokus med +10% neste uke. Ønsker du at jeg genererer en oppdatert plan?";
  }
  if (lower.includes("fysisk") || lower.includes("styrke")) {
    return "Jeg kan legge til en ekstra fysisk økt på torsdager. Skal jeg oppdatere planen?";
  }
  if (lower.includes("turnering") || lower.includes("taper")) {
    return "Jeg setter inn taper-fase 2 uker før turneringen. Ønsker du detaljert økt-plan?";
  }
  return "Forstått. Jeg analyserer spillerens data og kommer med forslag. Hva er hovedfokuset akkurat nå?";
}

/** Henter aktive sesjoner for en spiller */
export async function getActiveSessions(studentId: string): Promise<Array<{ id: string; prompt: string; response: string; createdAt: Date }>> {
  return prisma.coachAgentSession.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
