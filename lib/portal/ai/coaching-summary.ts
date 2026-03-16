import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface CoachingSummaryResult {
  keyPoints: string[];
  focusAreas: string[];
  actionItems: string[];
}

const SYSTEM_PROMPT = `Du er en ekspert AK Golf-coachanalytiker. Du analyserer treningsnotater og coachingsesjoner for golfspillere ved AK Golf Academy og Junior Academy.

Din oppgave er å trekke ut strukturert innsikt fra sesjonens innhold og returnere det som JSON.

Returner ALLTID kun gyldig JSON i dette formatet:
{
  "keyPoints": ["punkt 1", "punkt 2", "punkt 3"],
  "focusAreas": ["område 1", "område 2"],
  "actionItems": ["handling 1", "handling 2", "handling 3"]
}

Regler:
- keyPoints: 3-5 konkrete observasjoner fra sesjonen (hva ble arbeidet med, hva fungerte)
- focusAreas: 2-3 tekniske eller mentale områder som krever oppfølging
- actionItems: 2-4 spesifikke treningsoppgaver spilleren skal jobbe med frem til neste sesjon
- Skriv på norsk bokmål
- Vær konkret og praktisk, ikke generell
- Tilpass nivå og tone til golf-kontekst (AK Golf-metodikk: grunnperiode/spesialiseringsperiode/turneringsperiode)`;

export async function generateCoachingSummary(
  notes: string
): Promise<CoachingSummaryResult> {
  const message = await getClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyser følgende coachingnotater og lag en strukturert oppsummering:\n\n${notes}`,
      },
    ],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI returnerte ikke gyldig JSON");
  }

  const result = JSON.parse(jsonMatch[0]) as CoachingSummaryResult;
  return result;
}
