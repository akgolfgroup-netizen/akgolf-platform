// Anthropic Claude-klient for skills

import Anthropic from "@anthropic-ai/sdk";
import { getAnthropic } from "@/lib/anthropic/client";

export const MODELS = {
  HAIKU: "claude-haiku-4-5-20251001",
  SONNET: "claude-sonnet-4-6",
  OPUS: "claude-opus-4-7",
} as const;

export type ModelTier = keyof typeof MODELS;

// Felles base-prompt for alle AK Golf-skills
export const BASE_SYSTEM_PROMPT = `
Du er en del av AK Golf Academy AI-system.

Konteksten:
- AK Golf Academy bruker spillerkategorier A-K (basert på snittscore + alder)
- Treningspyramide: FYS / TEK / SLAG / SPILL / TURN
- Performance-metoden er vår sannsynlighetsbaserte spillstrategi (IKKE Scott Fawcetts DECADE)
- MORAD-prinsipper styrer bevegelse (vekt på hælene, etc.)
- 13 invarianter (sek 12 i metodikk-master) brytes aldri
- Aldersregelen for junior: timer/uke ≤ alder

Tone: profesjonell, direkte, growth-mindset (ENNÅ-tilnærming).
Språk: norsk bokmål.
`.trim();

interface RunSkillOptions {
  model: ModelTier;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

interface SkillResult {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCostNOK: number;
  };
  durationMs: number;
}

// Estimat-kostnader per million tokens (NOK, ca-tall)
const COSTS = {
  HAIKU: { input: 8, output: 40 },
  SONNET: { input: 30, output: 150 },
  OPUS: { input: 150, output: 750 },
};

export async function runSkill(opts: RunSkillOptions): Promise<SkillResult> {
  const start = Date.now();
  const model = MODELS[opts.model];

  const response = await getAnthropic().messages.create({
    model,
    max_tokens: opts.maxTokens ?? 1500,
    system: `${BASE_SYSTEM_PROMPT}\n\n${opts.systemPrompt}`,
    messages: [{ role: "user", content: opts.userPrompt }],
  });

  const text = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("\n");

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const cost = COSTS[opts.model];
  const estimatedCost = (inputTokens * cost.input + outputTokens * cost.output) / 1_000_000;

  return {
    text,
    usage: {
      inputTokens,
      outputTokens,
      estimatedCostNOK: Math.round(estimatedCost * 100) / 100,
    },
    durationMs: Date.now() - start,
  };
}
