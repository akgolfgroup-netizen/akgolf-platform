// VERIFY: Coach-agent — naturlig-språk plan-oppdatering
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 4.5, Fase 7

import { prisma } from "@/lib/portal/prisma";
import { runSkill } from "@/lib/skills/anthropic";
import { logger } from "@/lib/logger";

export interface CoachAgentMessage {
  role: "user" | "assistant";
  content: string;
}

interface PlayerContext {
  name: string | null;
  hcp: number | null;
  category: string | null;
  weeklyHours: number | null;
  playerType: string | null;
  goal: string | null;
  weakestArea: string | null;
  latestPlanTitle: string | null;
  latestPlanWeeks: number | null;
  upcomingBookings: Array<{ date: string; service: string }>;
  recentSessions: Array<{ title: string; dayOfWeek: number }>;
}

/** Bygg system-prompt for coach-agenten */
function buildSystemPrompt(ctx: PlayerContext): string {
  return `
Du er AK Golf Coach Agent — en AI-assistent for golfcoacher ved AK Golf Academy.

SPILLER-KONTEKST:
- Navn: ${ctx.name ?? "Ukjent"}
- Handicap: ${ctx.hcp ?? "Ukjent"}
- Kategori: ${ctx.category ?? "Ukjent"}
- Timer/uke: ${ctx.weeklyHours ?? "Ukjent"}
- Spillertype: ${ctx.playerType ?? "Ukjent"}
- Mål: ${ctx.goal ?? "Ukjent"}
- Svakhetsområde: ${ctx.weakestArea ?? "Ukjent"}
- Siste plan: ${ctx.latestPlanTitle ?? "Ingen aktiv plan"} (${ctx.latestPlanWeeks ?? 0} uker)

OPPMERKSOMHET:
- Svar på norsk bokmål, kort og konsist (maks 3 setninger).
- Bruk spillerens data i svarene — ikke generiske råd.
- Du kan foreslå endringer i treningsplanen: juster timer mellom områder, legg til økter, eller endre fokus.
- Du kan foreslå bookinger basert på spillerens mønster.
- Tone: profesjonell, direkte, motiverende (growth-mindset).
- Aldri gi medisinsk råd. Aldri lov resultater.

GJELDENDE TRENINGSPYRAMIDE: FYS → TEK → SLAG → SPILL → TURN
AK-METODIKK: Performance-sannsynlighet, MORAD-prinsipper, 13 invarianter.
`.trim();
}

/** Bygg user-prompt med historikk */
function buildUserPrompt(
  message: string,
  history: CoachAgentMessage[],
  ctx: PlayerContext,
): string {
  const historyText = history.length > 0
    ? `\nTIDLIGERE SAMTALE:\n${history.map((h) => `${h.role === "user" ? "Trener" : "Agent"}: ${h.content}`).join("\n")}\n`
    : "";

  const bookingsText = ctx.upcomingBookings.length > 0
    ? `\nKOMMENDE BOOKINGER:\n${ctx.upcomingBookings.map((b) => `- ${b.date}: ${b.service}`).join("\n")}`
    : "\nIngen kommende bookinger.";

  const sessionsText = ctx.recentSessions.length > 0
    ? `\nSISTE ØKTER:\n${ctx.recentSessions.map((s) => `- ${s.title} (dag ${s.dayOfWeek})`).join("\n")}`
    : "\nIngen registrerte økter.";

  return `
${historyText}
${bookingsText}
${sessionsText}

TRENER SPØR:
${message}

Svar som en erfaren golfcoach. Referer spesifikt til spillerens data ovenfor.
`.trim();
}

/** Hent spiller-kontekst fra DB */
async function getPlayerContext(studentId: string): Promise<PlayerContext> {
  const [
    user,
    latestPlan,
    upcomingBookingsRaw,
    latestHcp,
    usi,
    talentScore,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      select: {
        name: true,
        weeklyTrainingHours: true,
        playerType: true,
      },
    }),
    prisma.trainingPlan.findFirst({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        goals: true,
        _count: { select: { TrainingPlanWeek: true } },
      },
    }),
    prisma.booking.findMany({
      where: {
        studentId,
        startTime: { gte: new Date() },
        status: { not: "CANCELLED" },
      },
      orderBy: { startTime: "asc" },
      take: 5,
      select: {
        startTime: true,
        serviceTypeId: true,
      },
    }),
    prisma.handicapEntry.findFirst({
      where: { userId: studentId },
      orderBy: { date: "desc" },
      select: { handicapIndex: true },
    }),
    prisma.unifiedSkillIndex.findUnique({
      where: { userId: studentId },
      select: { estimatedCategory: true },
    }),
    prisma.talentScore.findFirst({
      where: { userId: studentId },
      orderBy: { computedAt: "desc" },
      select: { weaknessesJson: true },
    }),
  ]);

  // Hent serviceType-navn for bookinger
  const serviceTypeIds = [...new Set(upcomingBookingsRaw.map((b) => b.serviceTypeId))];
  const serviceTypes = serviceTypeIds.length > 0
    ? await prisma.serviceType.findMany({
        where: { id: { in: serviceTypeIds } },
        select: { id: true, name: true },
      })
    : [];
  const serviceTypeMap = new Map(serviceTypes.map((s) => [s.id, s.name]));

  // Hent siste økter fra plan
  const recentSessions = await prisma.trainingPlanSession.findMany({
    where: {
      TrainingPlanWeek: {
        TrainingPlan: { studentId },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { title: true, dayOfWeek: true },
  });

  // Parse weaknessesJson
  let weakestArea: string | null = null;
  if (talentScore?.weaknessesJson) {
    try {
      const weaknesses = talentScore.weaknessesJson as Record<string, number>;
      const entries = Object.entries(weaknesses).sort((a, b) => a[1] - b[1]);
      weakestArea = entries[0]?.[0] ?? null;
    } catch {
      // ignore parse error
    }
  }

  return {
    name: user?.name ?? null,
    hcp: latestHcp?.handicapIndex ?? null,
    category: usi?.estimatedCategory ?? null,
    weeklyHours: user?.weeklyTrainingHours ?? null,
    playerType: user?.playerType ?? null,
    goal: latestPlan?.goals ?? null,
    weakestArea,
    latestPlanTitle: latestPlan?.title ?? null,
    latestPlanWeeks: latestPlan?._count.TrainingPlanWeek ?? null,
    upcomingBookings: upcomingBookingsRaw.map((b) => ({
      date: b.startTime.toLocaleDateString("nb-NO"),
      service: serviceTypeMap.get(b.serviceTypeId) ?? "Coaching",
    })),
    recentSessions: recentSessions.map((s) => ({
      title: s.title,
      dayOfWeek: s.dayOfWeek,
    })),
  };
}

/** Oppretter en coach-agent-sesjon */
export async function createOrContinueSession(
  studentId: string,
  coachId: string,
  message: string,
): Promise<{ reply: string; sessionId: string }> {
  // Hent tidligere historikk
  const previousSessions = await prisma.coachAgentSession.findMany({
    where: { studentId, coachId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { prompt: true, response: true },
  });

  const history: CoachAgentMessage[] = previousSessions
    .reverse()
    .flatMap((s): CoachAgentMessage[] => [
      { role: "user", content: s.prompt },
      { role: "assistant", content: s.response },
    ]);

  // Hent spiller-kontekst
  const ctx = await getPlayerContext(studentId);

  let reply: string;

  try {
    const result = await runSkill({
      model: "SONNET",
      systemPrompt: buildSystemPrompt(ctx),
      userPrompt: buildUserPrompt(message, history, ctx),
      maxTokens: 800,
    });

    reply = result.text;

    logger.info(
      `[CoachAgent] Claude respons for student=${studentId}: ${result.usage.inputTokens}→${result.usage.outputTokens} tokens, ${result.durationMs}ms, kr${result.usage.estimatedCostNOK}`,
    );
  } catch (err) {
    logger.error(`[CoachAgent] Claude API failed, falling back to placeholder:`, err);
    reply = generateFallbackReply(message, ctx);
  }

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

/** Fallback-respons når Claude er utilgjengelig */
function generateFallbackReply(message: string, ctx: PlayerContext): string {
  const lower = message.toLowerCase();
  const name = ctx.name ? ` ${ctx.name}` : "";

  if (lower.includes("putt") || lower.includes("putting")) {
    return `Jeg foreslår å øke putting-fokus med +10% neste uke for${name}. Ønsker du at jeg genererer en oppdatert plan?`;
  }
  if (lower.includes("fysisk") || lower.includes("styrke")) {
    return `Jeg kan legge til en ekstra fysisk økt på torsdager for${name}. Skal jeg oppdatere planen?`;
  }
  if (lower.includes("turnering") || lower.includes("taper")) {
    return `Jeg setter inn taper-fase 2 uker før turneringen for${name}. Ønsker du detaljert økt-plan?`;
  }
  if (ctx.weakestArea) {
    return `Forstått. Basert på${name} sin profil er ${ctx.weakestArea} det svakeste området. Jeg kan foreslå en justert plan. Hva er hovedfokuset akkurat nå?`;
  }
  return `Forstått. Jeg analyserer${name} sin data og kommer med forslag. Hva er hovedfokuset akkurat nå?`;
}

/** Henter aktive sesjoner for en spiller */
export async function getActiveSessions(studentId: string): Promise<Array<{ id: string; prompt: string; response: string; createdAt: Date }>> {
  return prisma.coachAgentSession.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
