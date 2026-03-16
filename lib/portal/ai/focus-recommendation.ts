import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/portal/prisma";
import { subDays } from "date-fns";

export interface FocusRecommendation {
  areas: {
    title: string;
    reason: string;
    priority: number;
  }[];
}

export async function generateFocusRecommendation(userId: string): Promise<FocusRecommendation> {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [trainingLogs, rounds, coachingSessions] = await Promise.all([
    prisma.trainingLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "desc" },
      take: 30,
      select: { focusArea: true, durationMinutes: true, rating: true, notes: true },
    }),
    prisma.roundStats.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.coachingSession.findMany({
      where: { studentId: userId, sessionDate: { gte: thirtyDaysAgo } },
      orderBy: { sessionDate: "desc" },
      take: 3,
      select: { primaryFocus: true, aiFocusAreas: true, aiActionItems: true },
    }),
  ]);

  const trainingContext = trainingLogs.map((l) =>
    `- ${l.focusArea ?? "Generell"}: ${l.durationMinutes ?? 0}min, rating ${l.rating ?? "N/A"}`
  ).join("\n");

  const roundContext = rounds.map((r) =>
    `- Score ${r.totalScore ?? "?"} (${r.scoreToPar !== null ? (r.scoreToPar > 0 ? "+" : "") + r.scoreToPar : "?"} par), SG Total: ${r.sgTotal ?? "?"}, Off Tee: ${r.sgOffTheTee ?? "?"}, Approach: ${r.sgApproach ?? "?"}, Rundt green: ${r.sgAroundTheGreen ?? "?"}, Putting: ${r.sgPutting ?? "?"}`
  ).join("\n");

  const coachingContext = coachingSessions.map((s) =>
    `- Fokus: ${s.primaryFocus ?? "?"}, Områder: ${s.aiFocusAreas.join(", ")}, Oppgaver: ${s.aiActionItems.join(", ")}`
  ).join("\n");

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Du er en golfcoach-assistent. Basert på følgende data for en spiller, anbefal de 3 viktigste fokusområdene for neste treningsperiode.

TRENINGSLOGG (siste 30 dager):
${trainingContext || "Ingen data"}

RUNDER (siste 5):
${roundContext || "Ingen data"}

COACHING-ØKTER (siste 3):
${coachingContext || "Ingen data"}

Svar med JSON: { "areas": [{ "title": "...", "reason": "...", "priority": 1-3 }] }
Gi korte, praktiske anbefalinger på norsk. Maks 3 områder. Prioritet 1 = viktigst.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return {
    areas: [
      { title: "Kortspill", reason: "Basert på tilgjengelig data, anbefales fokus på kortspill.", priority: 1 },
    ],
  };
}
