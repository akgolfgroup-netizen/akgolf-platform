import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import type { Prisma } from "@prisma/client";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import type { GenerateRequest, GeneratedItem } from "./types";

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 4096;

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function extractJsonArray(text: string): unknown[] {
  const trimmed = text.trim();

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1].trim() : trimmed;

  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Fant ikke JSON-array i AI-respons");
  }

  const parsed = JSON.parse(candidate.slice(start, end + 1));
  if (!Array.isArray(parsed)) {
    throw new Error("AI-respons var ikke et array");
  }
  return parsed;
}

function coerceItem(raw: unknown, requestType: string): GeneratedItem {
  if (!raw || typeof raw !== "object") {
    throw new Error("Ugyldig item-format");
  }
  const obj = raw as Record<string, unknown>;
  const arr = (key: string): string[] => {
    const v = obj[key];
    if (Array.isArray(v)) return v.filter(x => typeof x === "string") as string[];
    return [];
  };
  const num = (key: string, fallback: number): number => {
    const v = obj[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && !isNaN(Number(v))) return Number(v);
    return fallback;
  };
  const str = (key: string): string => {
    const v = obj[key];
    return typeof v === "string" ? v : "";
  };
  const optStr = (key: string): string | undefined => {
    const v = obj[key];
    return typeof v === "string" && v.length > 0 ? v : undefined;
  };

  return {
    type: (str("type") || requestType) as GeneratedItem["type"],
    title: str("title").slice(0, 200),
    summary: str("summary").slice(0, 500),
    pyramid: str("pyramid") || "SLAG",
    area: str("area"),
    subArea: optStr("subArea"),
    lPhase: optStr("lPhase"),
    playerLevels: arr("playerLevels"),
    difficulty: Math.max(1, Math.min(5, num("difficulty", 3))),
    minDurationMinutes: Math.max(1, num("minDurationMinutes", 5)),
    maxDurationMinutes: Math.max(1, num("maxDurationMinutes", 30)),
    equipment: arr("equipment"),
    setup: str("setup"),
    execution: str("execution"),
    scoring: optStr("scoring"),
    variations: optStr("variations"),
    coachingCues: optStr("coachingCues"),
    tags: arr("tags"),
  };
}

export async function generateLibraryItems(
  request: GenerateRequest,
  createdById: string
): Promise<{ created: number; ids: string[] }> {
  const client = getClient();
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(request);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Tom AI-respons");
  }

  const rawItems = extractJsonArray(textBlock.text);
  const items = rawItems.map(r => coerceItem(r, request.type));

  const data: Prisma.LibraryItemCreateManyInput[] = items.map(item => ({
    id: nanoid(),
    type: item.type,
    status: "DRAFT" as const,
    source: "AK_METHODOLOGY" as const,
    title: item.title,
    summary: item.summary,
    pyramid: item.pyramid,
    area: item.area || request.area,
    subArea: item.subArea ?? null,
    lPhase: item.lPhase ?? null,
    playerLevels: item.playerLevels,
    difficulty: item.difficulty,
    minDurationMinutes: item.minDurationMinutes,
    maxDurationMinutes: item.maxDurationMinutes,
    equipment: item.equipment,
    setup: item.setup,
    execution: item.execution,
    scoring: item.scoring ?? null,
    variations: item.variations ?? null,
    coachingCues: item.coachingCues ?? null,
    tags: item.tags,
    generatedBy: MODEL,
    generatedPrompt: userPrompt,
    generatedAt: new Date(),
    createdById,
    updatedAt: new Date(),
  }));

  const result = await prisma.libraryItem.createMany({ data });

  logger.info("library.generated", {
    count: result.count,
    type: request.type,
    area: request.area,
    createdById,
  });

  return { created: result.count, ids: data.map(d => d.id as string) };
}
