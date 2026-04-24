import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/portal/prisma";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface TrackManInsightItem {
  title: string;
  body: string;
  category: "carry" | "smash" | "spin" | "launch" | "dispersion" | "club_speed" | "general";
  severity: "positive" | "neutral" | "attention";
}

export interface TrackManInsightsResult {
  insights: TrackManInsightItem[];
}

/**
 * Genererer 3–5 personlige innsikter basert på spillerens 3 siste TrackMan-sesjoner.
 * Returnerer tom liste hvis ingen sesjoner finnes.
 */
export async function generateTrackManInsights(userId: string): Promise<TrackManInsightsResult> {
  const sessions = await prisma.trackmanSession.findMany({
    where: { userId },
    orderBy: { sessionDate: "desc" },
    take: 3,
  });

  if (sessions.length === 0) {
    return { insights: [] };
  }

  const sessionSummaries = sessions.map((s) => ({
    dato: s.sessionDate.toISOString().split("T")[0],
    klubb: s.club,
    snitt: s.averages,
    antallSlag: Array.isArray(s.shots) ? s.shots.length : 0,
  }));

  const prompt = `Du er en TrackMan-data-analytiker. Basert på spillerens 3 siste TrackMan-sesjoner, gi 3–5 korte og konkrete innsikter på norsk bokmål.

TRACKMAN-SESJONER:
${JSON.stringify(sessionSummaries, null, 2)}

Hver innsikt skal ha:
- title: 3–6 ord, direkte observasjon (f.eks. "Smash factor med driver er høy")
- body: 1–2 setninger med tall og anbefaling
- category: en av carry, smash, spin, launch, dispersion, club_speed, general
- severity: positive (spilleren gjør noe bra), attention (bør jobbe med), neutral (faktaobservasjon)

Svar KUN med gyldig JSON i dette formatet (ingen markdown):
{
  "insights": [
    { "title": "...", "body": "...", "category": "smash", "severity": "positive" }
  ]
}`;

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";
  const clean = text.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    const parsed = JSON.parse(clean) as TrackManInsightsResult;
    if (!Array.isArray(parsed.insights)) throw new Error("Missing insights array");
    return { insights: parsed.insights.slice(0, 5) };
  } catch {
    return {
      insights: [
        {
          title: "Kunne ikke analysere data",
          body: "Vi klarte ikke å generere innsikter denne gangen. Prøv igjen senere.",
          category: "general",
          severity: "neutral",
        },
      ],
    };
  }
}
