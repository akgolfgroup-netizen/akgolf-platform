// AI plan generation orchestrator
// Step 1: Deterministic preprocessing (category-engine)
// Step 2: Claude API call with structured prompt

import Anthropic from "@anthropic-ai/sdk";
import { preprocessPlayerProfile, type PlayerInput } from "./category-engine";
import { buildSystemPrompt } from "./system-prompt";
import { type GeneratedPlan, extractPreview, type PlanPreview } from "./plan-schema";
import type { TrainingPrescriptionResult } from "@/lib/portal/usi/generate-prescription";

interface GenerationResult {
  plan: GeneratedPlan;
  preview: PlanPreview;
  metadata: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    generationTimeMs: number;
  };
}

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

export async function generateTrainingPlan(
  input: PlayerInput,
  prescription?: TrainingPrescriptionResult
): Promise<GenerationResult> {
  const startTime = Date.now();

  // Step 1: Deterministic preprocessing
  const profile = preprocessPlayerProfile(input);

  // Step 2: Build system prompt with embedded methodology + player data
  const systemPrompt = buildSystemPrompt(profile, input);

  // Step 3: Call Claude API
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const ageInfo = input.age != null ? `\n- Alder: ${input.age} år${profile.ageGroup ? ` (${profile.ageGroup.name})` : ""}` : "";
  const mentalInfo = `\n- Mental tilnærming: ${profile.mentalApproach} (${profile.mentalMinutesPerWeek} min/uke)`;
  const lifeInfo = `\n- LIFE-fokus: ${profile.lifeFocus.join(", ")}`;

  const userMessage = `Generer en komplett 12-ukers treningsplan for denne spilleren.

Spillerprofil (forbehandlet):
- Kategori: ${profile.category} (${profile.categoryInfo.name})
- Handicap: ${input.handicap}${ageInfo}
- L-fase: ${profile.lPhase}
- Pyramidefordeling: FYS ${profile.pyramid.FYS}% | TEK ${profile.pyramid.TEK}% | SLAG ${profile.pyramid.SLAG}% | SPILL ${profile.pyramid.SPILL}% | TURN ${profile.pyramid.TURN}%
- Økter/uke: ${input.sessionsPerWeek}
- Sesong: ${input.season} (${profile.seasonalFocus.indoorOutdoor})
- Fasiliteter: ${input.facilities.join(", ")}
- Tilgjengelige M-miljøer: ${profile.mEnvironments.join(", ")}
- PR-nivåer: ${profile.prRange.join(", ")}${mentalInfo}${lifeInfo}
- Tilgjengelige tester: ${profile.applicableTests.join(", ")}
- Drillkategorier: ${profile.applicableDrillCategories.join(", ")}
${input.goals ? `- Spillerens mål: ${input.goals}` : ""}
${prescription ? `- AI-preskripsjon: Fokuser pa ${prescription.focusAreas.join(", ")} (${prescription.weeklyHours.toFixed(1)} timer/uke). Predikert HCP-endring pa 12 uker: ${prescription.predictedHcpChange.toFixed(1)} slag.` : ""}

Krav:
1. Generer alle 12 uker med daglig plan (${input.sessionsPerWeek} treningsdager + hviledager per uke)
2. Følg 4-ukers temarotasjon (langt spill → kort spill → banespill → testing) × 3 måneder
3. Bruk KUN drills fra DECADE-øvelseslisten — bruk eksakte drillnavn. Minst 15 unike drills.
4. Sjekk at drillenes nivåangivelse passer spillerens kategori (${profile.category})
5. Planlegg tester i uke 1 (baseline), uke 4, uke 8, og uke 12
6. Integrer LIFE-rammeverket med ulike dimensjoner i hver økt (fokus: ${profile.lifeFocus.join(", ")})
7. Mental trening MÅ bruke ${profile.mentalApproach} tilnærming — se MENTAL TRENING PER KATEGORIGRUPPE
8. Sett realistiske progresjonskriterier for neste kategori
9. All tekst på norsk

Svar med GYLDIG JSON.`;

  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const generationTimeMs = Date.now() - startTime;

  // Extract text content from response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in AI response");
  }

  // Parse JSON response
  let plan: GeneratedPlan;
  try {
    plan = JSON.parse(textBlock.text);
  } catch {
    // Try to extract JSON from potential markdown code block
    const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      plan = JSON.parse(jsonMatch[1].trim());
    } else {
      throw new Error("Failed to parse AI response as JSON");
    }
  }

  // Validate critical fields
  validatePlan(plan, profile.category, input.sessionsPerWeek);

  // Extract preview (paywall-safe subset)
  const preview = extractPreview(plan);

  return {
    plan,
    preview,
    metadata: {
      model: ANTHROPIC_MODEL,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      generationTimeMs,
    },
  };
}

function validatePlan(
  plan: GeneratedPlan,
  expectedCategory: string,
  expectedSessions: number
): void {
  if (!plan.summary) throw new Error("Missing plan summary");
  if (!plan.weeklySchedule || plan.weeklySchedule.length === 0)
    throw new Error("Missing weekly schedule");
  if (!plan.exercises || plan.exercises.length === 0)
    throw new Error("Missing exercises");
  if (!plan.testPlan) throw new Error("Missing test plan");

  // Verify category matches
  if (plan.summary.playerCategory !== expectedCategory) {
    plan.summary.playerCategory = expectedCategory;
  }

  // Verify sessions per week
  if (plan.summary.sessionsPerWeek !== expectedSessions) {
    plan.summary.sessionsPerWeek = expectedSessions;
  }
}
