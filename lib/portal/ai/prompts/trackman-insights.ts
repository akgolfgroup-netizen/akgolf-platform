// Prompt-template for AI-genererte coaching-innsikter fra TrackMan-data
// Output: { insights: string[], focusAreas: string[] }

import type { TrackManAnalyticsSummary } from "@/app/portal/(dashboard)/trackman/actions";

const COACHING_CONTEXT = `
Du er en erfaren golftrener som analyserer TrackMan-data for å gi personlige, konkrete råd til en spiller.

SPRÅK: Skriv ALLTID på norsk bokmål. Bruk en motiverende, profesjonell tone.

VIKTIGE REGELER:
- Referer ALDRI til "AK Portal", "AK Coaching", "AK-formelen" eller "AI-drevet".
- Bruk "Portalen", "Personlig coaching", "AK Golf sin coaching-filosofi" eller "AI-veiledning" (nedtonet).
- Innsiktene skal være basert på FAKTISKE tall — ikke generiske golf-tips.
- Gi actionable råd spilleren kan ta med på neste økt.
`;

function formatStats(stats: Record<string, unknown> | null): string {
  if (!stats) return "  Ingen data";
  return Object.entries(stats)
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, " $1").toLowerCase();
      return `  - ${label}: ${typeof v === "number" ? Math.round(v * 10) / 10 : v}`;
    })
    .join("\n");
}

function formatDistribution(dist: Record<string, unknown> | null, label: string): string {
  if (!dist || Object.keys(dist).length === 0) return "";
  const entries = Object.entries(dist)
    .map(([k, v]) => `    ${k}: ${typeof v === "number" ? Math.round(v * 10) / 10 : v}%`)
    .join("\n");
  return `\n${label}:\n${entries}`;
}

export function buildTrackManInsightsPrompt(
  analytics: TrackManAnalyticsSummary,
  playerName?: string
): { system: string; user: string } {
  const system = COACHING_CONTEXT.trim();

  const playerGreeting = playerName ? ` for ${playerName}` : "";

  const user = `Analyser denne TrackMan-sesjonen${playerGreeting} og gi personlige coaching-innsikter.

=== SESJONSDATA ===

Driver-statistikk:
${formatStats(analytics.driverStats)}

Jern-statistikk:
${formatStats(analytics.ironStats)}

Wedge-statistikk:
${formatStats(analytics.wedgeStats)}

Overordnede metrikker:
- Gjennomsnittlig ballfart: ${analytics.avgBallSpeed ?? "N/A"} mph
- Maks ballfart: ${analytics.maxBallSpeed ?? "N/A"} mph
- Gjennomsnittlig carry: ${analytics.avgCarryDistance ?? "N/A"} m
- Maks carry: ${analytics.maxCarryDistance ?? "N/A"} m
- Ballfart-konsistens (CV): ${analytics.ballSpeedConsistency ?? "N/A"}%
- Distanse-konsistens (CV): ${analytics.distanceConsistency ?? "N/A"}%
- Sweet spot-treffprosent: ${analytics.sweetSpotPercentage ?? "N/A"}%
${formatDistribution(analytics.shotShapeDistribution, "Shot shape-fordeling")}
${formatDistribution(analytics.missPattern, "Miss pattern-fordeling")}

Trender (sammenlignet med tidligere sesjoner):
- Ballfart-trend: ${analytics.trendBallSpeed ?? "ingen data"}
- Distanse-trend: ${analytics.trendDistance ?? "ingen data"}
- Konsistens-trend: ${analytics.trendConsistency ?? "ingen data"}

=== OUTPUT-KRAV ===
Returner KUN gyldig JSON i dette formatet:

{
  "insights": [
    "Konkret innsikt basert på tall — maks 5 punkter",
    "..."
  ],
  "focusAreas": [
    "Kort, handlingsrettet fokusområde for neste økt — maks 3 punkter",
    "..."
  ]
}

KRAV TIL INNSIKTER:
1. Hver innsikt MÅ referere til konkrete tall ("Din carry på driver økte med 8m til 245m")
2. Identifiser mønstre ("Du treffer konsistent 5m kort på jern — sjekk club speed")
3. Sammenlign med treningsøkonomi — hva gir mest gevinst?
4. Inkluder både styrker og forbedringsområder
5. Hold det motiverende og konkret

KRAV TIL FOKUSOMRÅDER:
1. Maks 3 områder spilleren bør fokusere på i neste økt
2. Prioriter etter impact (hva gir mest forbedring per treningsminutt?)
3. Vær spesifikk: "Jobb med launch angle på driver (sikte mot 12-14°)" — ikke "Øv på driver"

VIKTIG:
- Ikke bruk engelske fagtermer uten forklaring
- Ikke gi generiske tips som ikke er støttet av dataene
- Ikke overstyr spilleren — bruk oppfordrende formuleringer`;

  return { system, user };
}
