import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/portal/prisma";
import { subDays } from "date-fns";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

interface WeaknessAnalysis {
  primaryWeakness: string;
  supportingEvidence: string[];
  recommendation: string;
  focusAreaBreakdown: Record<string, number>;
}

export async function analyzeWeakness(userId: string): Promise<WeaknessAnalysis> {
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Fetch training logs
  const logs = await prisma.trainingLog.findMany({
    where: { userId, date: { gte: thirtyDaysAgo } },
    select: {
      date: true,
      focusArea: true,
      durationMinutes: true,
      notes: true,
      rating: true,
      deviatedFromPlan: true,
      deviationReason: true,
    },
    orderBy: { date: "desc" },
  });

  // Fetch recent coaching sessions
  const coachingSessions = await prisma.coachingSession.findMany({
    where: { studentId: userId },
    select: {
      sessionDate: true,
      primaryFocus: true,
      aiSummary: true,
      aiFocusAreas: true,
    },
    orderBy: { sessionDate: "desc" },
    take: 3,
  });

  // Build focus area breakdown
  const focusCounts: Record<string, number> = {};
  for (const log of logs) {
    const area = log.focusArea ?? "ukjent";
    focusCounts[area] = (focusCounts[area] ?? 0) + 1;
  }
  const total = Object.values(focusCounts).reduce((s, v) => s + v, 0) || 1;
  const focusAreaBreakdown: Record<string, number> = {};
  for (const [area, count] of Object.entries(focusCounts)) {
    focusAreaBreakdown[area] = Math.round((count / total) * 100);
  }

  const prompt = `Du er en profesjonell golftreningsanalytiker. Analyser følgende treningsdata og gi en strukturert svakhetsanalyse på norsk.

TRENINGSLOGG (siste 30 dager):
${JSON.stringify(
  logs.map((l) => ({
    dato: l.date.toISOString().split("T")[0],
    fokus: l.focusArea,
    varighet_min: l.durationMinutes,
    notat: l.notes,
    vurdering: l.rating,
    avvik: l.deviatedFromPlan,
    avviksgrunn: l.deviationReason,
  })),
  null,
  2
)}

COACHING-HISTORIKK (siste 3 sesjoner):
${JSON.stringify(
  coachingSessions.map((c) => ({
    dato: c.sessionDate.toISOString().split("T")[0],
    primærfokus: c.primaryFocus,
    ai_oppsummering: c.aiSummary,
    fokusområder: c.aiFocusAreas,
  })),
  null,
  2
)}

FOKUSFORDELING: ${JSON.stringify(focusAreaBreakdown)}

Svar KUN med dette JSON-formatet (ingen markdown, kun ren JSON):
{
  "primaryWeakness": "Kort norsk beskrivelse av primær svakhet",
  "supportingEvidence": ["Bevis 1", "Bevis 2", "Bevis 3"],
  "recommendation": "Konkret anbefaling for neste treningsperiode",
  "focusAreaBreakdown": { "range": 40, "naerspill": 25, "putting": 20, "bane": 15 }
}`;

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  // Clean potential markdown code fences
  const clean = text.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();

  let result: WeaknessAnalysis;
  try {
    result = JSON.parse(clean);
  } catch {
    // Fallback if parsing fails
    result = {
      primaryWeakness: "Kunne ikke analysere data",
      supportingEvidence: ["Utilstrekkelig data i treningslogg"],
      recommendation: "Logg flere treningsøkter for å få en god analyse",
      focusAreaBreakdown: focusAreaBreakdown,
    };
  }

  // Override breakdown with actual data
  result.focusAreaBreakdown = focusAreaBreakdown;

  return result;
}
