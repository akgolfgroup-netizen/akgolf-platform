import Anthropic from "@anthropic-ai/sdk";
import type { TrainingPrescriptionResult } from "@/lib/portal/usi/generate-prescription";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface TrainingSession {
  dayOfWeek: number; // 1=Monday, 7=Sunday
  title: string;
  description?: string;
  durationMinutes?: number;
  focusArea?: string;
  exercises: string[];
}

export interface TrainingWeek {
  weekNumber: number;
  focus: string;
  volumeLabel: string;
  sessions: TrainingSession[];
}

export interface TrainingPlanResult {
  title: string;
  weeks: TrainingWeek[];
}

const PERIOD_GUIDANCE: Record<string, string> = {
  grunnperiode: `Grunnperiode: Fokus på volum, utholdenhet og grunnleggende teknikk.
- Høyt antall baller/repetisjoner
- Bygge kondisjon og styrke (generell fitness)
- Teknisk arbeid med grunnstillingen (grip, stilling, sving)
- Mye putting og chip (det korte spillet er grunnmuren)
- Rolig intensitet, lang varighet`,

  spesialiseringsperiode: `Spesialiseringsperiode: Flytt tekniske forbedringer inn i kurven/situasjonene.
- Reduser volum, øk intensitet og presisjon
- Situasjonstrening (bunker, rough, approach)
- Mental trening og rutiner
- Spesifikke svingforbedringer fra coachingnotatene
- Kursrunder med fokusoppgaver`,

  turneringsperiode: `Turneringsperiode: Vedlikehold form, bygg selvtillit, minimal teknisk endring.
- Lavt volum, høy kvalitet
- Spille runder (ikke endre teknikk)
- Mental forberedelse og konkurransescenarier
- Kort økt pre-turnering (oppvarming + putting)
- Restitusjon er like viktig som trening`,
};

const SYSTEM_PROMPT = `Du er en ekspert AK Golf-treningsplanlegger som lager individualiserte golftreningsplaner basert på AK Golf-akademiets metodikk.

AK Golf-metodikk:
- L-fase-tilnærming: grunnperiode → spesialiseringsperiode → turneringsperiode
- DECADE-metodikk: Hvert slag er en beslutning, ikke bare en bevegelse
- LIFE-prinsipp: Langvarig, iterativ forbedring gjennom fokuserte øvelser
- Fokus på det mentale spillet i like stor grad som det tekniske

Du SKAL returnere kun gyldig JSON i dette formatet:
{
  "title": "Tittel på treningsplanen",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Hovedfokus for uken",
      "volumeLabel": "f.eks. Moderat (8-10 timer)",
      "sessions": [
        {
          "dayOfWeek": 1,
          "title": "Øktens tittel",
          "description": "Kort beskrivelse",
          "durationMinutes": 90,
          "focusArea": "range/naerspill/putting/bane/styrke/restitusjon",
          "exercises": ["Øvelse 1", "Øvelse 2"]
        }
      ]
    }
  ]
}

Regler:
- Lag 3-5 treningsøkter per uke (dag 1=mandag, 7=søndag)
- Spre øktene fornuftig gjennom uken
- Inkluder restitusjonsdager
- Tilpass til periodiseringsfasen
- Skriv på norsk bokmål`;

export interface PyramidDistributionInput {
  FYS: number;
  TEK: number;
  SLAG: number;
  SPILL: number;
  TURN: number;
}

export async function generateTrainingPlan(
  input: {
    goals: string;
    periodType: string;
    durationWeeks: number;
    startDate: string;
    pyramidDistribution?: PyramidDistributionInput;
  },
  prescription?: TrainingPrescriptionResult
): Promise<TrainingPlanResult> {
  const periodGuidance = PERIOD_GUIDANCE[input.periodType] ?? PERIOD_GUIDANCE.grunnperiode;

  const prescriptionText = prescription
    ? `\nUSI-basert treningspreskripsjon: Fokuser pa ${prescription.focusAreas.join(", ")}. Anbefalt volum: ${prescription.weeklyHours.toFixed(1)} timer/uke. Forventet HCP-endring pa 12 uker: ${prescription.predictedHcpChange.toFixed(1)} slag.`
    : "";

  const pyramidText = input.pyramidDistribution
    ? `\n\nSpillerstyrt AK-fordeling per uke (sum 100 %):
- FYS (Fysisk): ${input.pyramidDistribution.FYS}%
- TEK (Teknikk): ${input.pyramidDistribution.TEK}%
- SLAG (Slagtrening): ${input.pyramidDistribution.SLAG}%
- SPILL (Spilltrening): ${input.pyramidDistribution.SPILL}%
- TURN (Turnering): ${input.pyramidDistribution.TURN}%

VIKTIG: Fordel total øktvarighet per uke slik at minuttene per pyramide-nivå matcher prosentene over (±5 %). Bruk feltet "focusArea" på hver økt for å speile ett av nivåene (eller et område innenfor et nivå, f.eks. putting/naerspill/range/styrke). En 0 %-andel betyr at nivået skal utelates helt.`
    : "";

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Lag en ${input.durationWeeks}-ukers golftreningsplan.

Periode: ${input.periodType}
${periodGuidance}

Spillerens mal: ${input.goals}${prescriptionText}${pyramidText}

Startdato: ${input.startDate}

Lag en fullstendig ${input.durationWeeks}-ukers plan med 3-5 ovingsokter per uke.`,
      },
    ],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI returnerte ikke gyldig JSON");

  return JSON.parse(jsonMatch[0]) as TrainingPlanResult;
}
