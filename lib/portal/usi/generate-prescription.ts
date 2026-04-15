/**
 * AI-generated Training Prescription from USI Gap Analysis
 *
 * Uses Claude to translate deterministic gap analysis into
 * a structured, actionable training prescription.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { USIResult } from "./compute-usi";
import type { GapAnalysis } from "./gap-analysis";

export interface TrainingPrescriptionResult {
  focusAreas: string[];
  weeklyHours: number;
  suggestedFormulaIds: string[];
  predictedHcpChange: number;
  confidence: number;
  gradientJson: Record<string, unknown>;
  gapAnalysisJson: Record<string, unknown>;
  reasoning: string;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Du er AK Golf-akademiets AI-treningscoach.
Din oppgave er å generere en konkret, handlingsbar treningspreskripsjon basert på spillerens Unified Skill Index (USI) og gap-analyse.

Svar KUN med gyldig JSON i dette formatet:
{
  "focusAreas": ["string"],
  "weeklyHours": number,
  "suggestedFormulaIds": ["string"],
  "predictedHcpChange": number,
  "confidence": number,
  "reasoning": "string"
}

Regler:
- focusAreas: 1-3 konkrete fokusområder (f.eks. "Innspill 100-150m", "Putting-lengdekontroll", "Driver-konsistens")
- weeklyHours: realistisk antall timer per uke basert på spillerens nivå og livssituasjon
- suggestedFormulaIds: ID-er eller navn på anbefalte øvelsesformler (bruk generiske navn som "decade-approach-wedge", "putting-ladder", "driver-dispersion")
- predictedHcpChange: estimert handicap-forbedring på 12 uker (negativt tall = bedre)
- confidence: 0.0-1.0 basert på datamengde og gap-klarhet
- reasoning: maks 2 setninger på norsk som forklarer valget
- All tekst på norsk bokmål`;

export async function generateTrainingPrescription(
  usi: USIResult,
  gapAnalysis: GapAnalysis
): Promise<TrainingPrescriptionResult> {
  const userMessage = `Spillerens USI-profil:
- Kategori: ${usi.estimatedCategory}
- Estimert HCP: ${usi.estimatedHandicap.toFixed(1)}
- vs Tour: ${Math.round(usi.vsTourAvgPct)}%
- SG Utslag: ${usi.sgOtt.toFixed(2)}
- SG Innspill: ${usi.sgApp.toFixed(2)}
- SG Nærspill: ${usi.sgArg.toFixed(2)}
- SG Putting: ${usi.sgPutt.toFixed(2)}
- Ballhastighet-score: ${(usi.ballSpeedScore * 100).toFixed(0)}%
- Konsistens-score: ${(usi.consistencyScore * 100).toFixed(0)}%
- Press-score: ${(usi.pressureScore * 100).toFixed(0)}%
- Trenings-effektivitet: ${usi.trainingEfficiency.toFixed(2)}
- Momentum: ${usi.trendMomentum.toFixed(2)}

Gap-analyse:
- Topp svakhet: ${gapAnalysis.topWeakness.dimension} (gap ${gapAnalysis.topWeakness.gap.toFixed(2)} SG)
- Sekundære svakheter: ${gapAnalysis.secondaryWeaknesses.map((g) => `${g.dimension} (${g.gap.toFixed(2)})`).join(", ") || "Ingen"}
- Styrker: ${gapAnalysis.strengths.map((g) => g.dimension).join(", ") || "Ingen klare"}
- Potensial HCP-gain: ${gapAnalysis.totalPotentialHcpGain.toFixed(1)} slag
- Anbefalte drill-kategorier: ${gapAnalysis.drillCategories.join(", ")}

Generer preskripsjon.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in AI response");
  }

  let parsed: Partial<TrainingPrescriptionResult>;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      throw new Error("Failed to parse AI response as JSON");
    }
  }

  return {
    focusAreas: parsed.focusAreas ?? gapAnalysis.focusAreas,
    weeklyHours:
      typeof parsed.weeklyHours === "number"
        ? parsed.weeklyHours
        : gapAnalysis.weeklyHoursRecommendation,
    suggestedFormulaIds: parsed.suggestedFormulaIds ?? [],
    predictedHcpChange:
      typeof parsed.predictedHcpChange === "number"
        ? parsed.predictedHcpChange
        : -gapAnalysis.totalPotentialHcpGain,
    confidence:
      typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
    reasoning: parsed.reasoning ?? "",
    gradientJson: {
      ballSpeedScore: usi.ballSpeedScore,
      consistencyScore: usi.consistencyScore,
      pressureScore: usi.pressureScore,
      trainingEfficiency: usi.trainingEfficiency,
      trendMomentum: usi.trendMomentum,
    },
    gapAnalysisJson: {
      topWeakness: gapAnalysis.topWeakness,
      secondaryWeaknesses: gapAnalysis.secondaryWeaknesses,
      totalPotentialHcpGain: gapAnalysis.totalPotentialHcpGain,
      averageGap: gapAnalysis.averageGap,
    },
  };
}
