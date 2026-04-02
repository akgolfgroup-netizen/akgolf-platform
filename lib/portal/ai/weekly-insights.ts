import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/portal/prisma";
import { subDays } from "date-fns";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: Date;
}

export async function generateWeeklyInsight(
  userId: string
): Promise<WeeklyInsight | null> {
  const sevenDaysAgo = subDays(new Date(), 7);

  // Hent treningslogger fra siste 7 dager
  const trainingLogs = await prisma.trainingLog.findMany({
    where: {
      userId,
      date: { gte: sevenDaysAgo },
    },
    orderBy: { date: "desc" },
    select: {
      date: true,
      focusArea: true,
      durationMinutes: true,
      notes: true,
      rating: true,
    },
  });

  // Hent siste 3 runder
  const roundStats = await prisma.roundStats.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 3,
    select: {
      date: true,
      totalScore: true,
      sgTotal: true,
      sgPutting: true,
      sgApproach: true,
      sgAroundTheGreen: true,
      sgOffTheTee: true,
      totalPutts: true,
      gir: true,
      fairwaysHit: true,
    },
  });

  // Hvis ingen data, returner null
  if (trainingLogs.length === 0 && roundStats.length === 0) {
    return null;
  }

  // Beregn treningsfordeling
  const focusDistribution: Record<string, number> = {};
  let totalMinutes = 0;
  for (const log of trainingLogs) {
    const area = log.focusArea ?? "annet";
    focusDistribution[area] = (focusDistribution[area] ?? 0) + (log.durationMinutes ?? 0);
    totalMinutes += log.durationMinutes ?? 0;
  }

  // Beregn gjennomsnittlig rating
  const ratings = trainingLogs.filter((l) => l.rating !== null).map((l) => l.rating!);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const prompt = `Du er en profesjonell golftrener som gir ukentlige innsikter til elever. Analyser folgende data og gi en kort, motiverende oppsummering pa norsk.

TRENINGSLOGG (siste 7 dager):
${JSON.stringify(trainingLogs.map((l) => ({
  dato: l.date.toISOString().split("T")[0],
  fokus: l.focusArea,
  varighet_min: l.durationMinutes,
  notat: l.notes,
  vurdering: l.rating,
})), null, 2)}

TRENINGSFORDELING:
${JSON.stringify(focusDistribution)}
Total tid: ${totalMinutes} minutter
Gjennomsnittlig vurdering: ${avgRating?.toFixed(1) ?? "ingen"}

SISTE RUNDER:
${JSON.stringify(roundStats.map((r) => ({
  dato: r.date.toISOString().split("T")[0],
  score: r.totalScore,
  sg_total: r.sgTotal,
  sg_putting: r.sgPutting,
  sg_innspill: r.sgApproach,
  sg_naerspill: r.sgAroundTheGreen,
  sg_utslag: r.sgOffTheTee,
  putts: r.totalPutts,
  gir: r.gir,
  fairway: r.fairwaysHit,
})), null, 2)}

Svar KUN med dette JSON-formatet (ingen markdown, kun ren JSON):
{
  "summary": "2-3 setninger som oppsummerer uken - vær positiv og motiverende",
  "strengths": ["Styrke 1", "Styrke 2"],
  "improvements": ["Forbedringspunkt 1", "Forbedringspunkt 2"],
  "focusTip": "Ett konkret tips for neste uke"
}`;

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
  const clean = text.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();

  let result: WeeklyInsight;
  try {
    const parsed = JSON.parse(clean);
    result = {
      summary: parsed.summary ?? "Kunne ikke generere oppsummering",
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      focusTip: parsed.focusTip ?? "Fortsett den gode treningen!",
      generatedAt: new Date(),
    };
  } catch {
    result = {
      summary: "Bra jobbet denne uken! Fortsett a logge treningene dine for bedre innsikt.",
      strengths: [],
      improvements: [],
      focusTip: "Logg flere treningsoekter for personlige anbefalinger.",
      generatedAt: new Date(),
    };
  }

  return result;
}

export async function saveWeeklyInsight(
  userId: string,
  insight: WeeklyInsight
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      latestAiInsight: insight as object,
      aiInsightGeneratedAt: new Date(),
    },
  });
}
