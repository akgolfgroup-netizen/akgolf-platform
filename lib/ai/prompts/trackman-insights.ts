// Prompt template for generating AI insights from TrackMan session analytics
// Returns structured insights + recommended focus areas

export interface TrackManInsightInput {
  sessionId: string;
  driverStats: Record<string, unknown> | null;
  ironStats: Record<string, unknown> | null;
  wedgeStats: Record<string, unknown> | null;
  avgBallSpeed: number | null;
  maxBallSpeed: number | null;
  avgCarryDistance: number | null;
  maxCarryDistance: number | null;
  ballSpeedConsistency: number | null;
  distanceConsistency: number | null;
  shotShapeDistribution: Record<string, unknown> | null;
  missPattern: Record<string, unknown> | null;
  sweetSpotPercentage: number | null;
  trendBallSpeed: string | null;
  trendDistance: string | null;
  trendConsistency: string | null;
  // Historical context (previous sessions)
  previousSessions?: {
    avgBallSpeed: number | null;
    avgCarryDistance: number | null;
    ballSpeedConsistency: number | null;
    sweetSpotPercentage: number | null;
  }[];
}

export interface TrackManInsightOutput {
  insights: string[]; // 3-5 personlige innsikter
  recommendedFocus: string[]; // 2-4 anbefalte fokusområder
}

function formatStats(stats: Record<string, unknown> | null): string {
  if (!stats || typeof stats !== "object") return "Ingen data";
  const entries = Object.entries(stats).filter(([, v]) => typeof v === "number");
  if (entries.length === 0) return "Ingen data";
  return entries.map(([k, v]) => `${k}: ${Math.round((v as number) * 10) / 10}`).join(", ");
}

function formatDistribution(dist: Record<string, unknown> | null): string {
  if (!dist || typeof dist !== "object") return "Ingen data";
  const entries = Object.entries(dist).filter(([, v]) => typeof v === "number");
  if (entries.length === 0) return "Ingen data";
  return entries.map(([k, v]) => `${k}: ${Math.round((v as number) * 10) / 10}%`).join(", ");
}

export function buildTrackManInsightPrompt(input: TrackManInsightInput): string {
  const lines: string[] = [
    `Du er en ekspert-golftrener som analyserer TrackMan-data for å gi personlige, actionbare innsikter til en spiller.`,
    ``,
    `## SESJONSDATA`,
    ``,
    `### Driver-statistikk`,
    formatStats(input.driverStats),
    ``,
    `### Jern-statistikk`,
    formatStats(input.ironStats),
    ``,
    `### Wedge-statistikk`,
    formatStats(input.wedgeStats),
    ``,
    `### Overordnede metrics`,
    `- Snitt ballfart: ${input.avgBallSpeed?.toFixed(1) ?? "–"} mph`,
    `- Max ballfart: ${input.maxBallSpeed?.toFixed(1) ?? "–"} mph`,
    `- Snitt carry: ${input.avgCarryDistance?.toFixed(1) ?? "–"} m`,
    `- Max carry: ${input.maxCarryDistance?.toFixed(1) ?? "–"} m`,
    `- Ballfart-konsistens: ${input.ballSpeedConsistency?.toFixed(1) ?? "–"}%`,
    `- Distance-konsistens: ${input.distanceConsistency?.toFixed(1) ?? "–"}%`,
    `- Sweet spot-treff: ${input.sweetSpotPercentage?.toFixed(1) ?? "–"}%`,
    ``,
    `### Ballbane-fordeling`,
    formatDistribution(input.shotShapeDistribution),
    ``,
    `### Miss-mønster`,
    formatDistribution(input.missPattern),
    ``,
    `### Trender (sammenlignet med tidligere sesjoner)`,
    `- Ballfart-trend: ${input.trendBallSpeed ?? "Ingen trend"}`,
    `- Distance-trend: ${input.trendDistance ?? "Ingen trend"}`,
    `- Konsistens-trend: ${input.trendConsistency ?? "Ingen trend"}`,
  ];

  if (input.previousSessions && input.previousSessions.length > 0) {
    lines.push(
      ``,
      `### Historisk kontekst (siste ${input.previousSessions.length} sesjoner)`,
    );
    input.previousSessions.forEach((s, i) => {
      lines.push(
        `Sesjon ${i + 1}: ballfart ${s.avgBallSpeed?.toFixed(1) ?? "–"} mph, carry ${s.avgCarryDistance?.toFixed(1) ?? "–"} m, konsistens ${s.ballSpeedConsistency?.toFixed(1) ?? "–"}%, sweet spot ${s.sweetSpotPercentage?.toFixed(1) ?? "–"}%`,
      );
    });
  }

  lines.push(
    ``,
    `## INSTRUKSJONER`,
    ``,
    `Generer 3–5 personlige, actionbare innsikter basert på dataene over. Innsiktene skal:`,
    `1. Være spesifikke — pek på konkrete tall og mønstre`,
    `2. Være actionbare — foreslå hva spilleren kan gjøre`,
    `3. Være motiverende — bruk en coachings-tone, ikke kritisk`,
    `4. Være på norsk bokmål`,
    `5. Være maks 2 setninger hver`,
    ``,
    `Deretter generer 2–4 anbefalte fokusområder (korte tags/stikkord) som spilleren kan fokusere på i neste treningsøkt.`,
    ``,
    `## OUTPUT-FORMAT`,
    `Svar KUN med gyldig JSON (ingen markdown, ingen tekst før/etter):`,
    ``,
    `{`,
    `  "insights": [",    `,
    `    "Innsikt 1 — maks 2 setninger",`,
    `    "Innsikt 2 — maks 2 setninger",`,
    `    "Innsikt 3 — maks 2 setninger"`,
    `  ],`,
    `  "recommendedFocus": [`,
    `    "Fokusområde 1",`,
    `    "Fokusområde 2"`,
    `  ]`,
    `}`,
  );

  return lines.join("\n");
}
