// lib/coach/ai/model-router.ts

export type AIModel = "ollama" | "claude-haiku" | "claude-sonnet" | "claude-opus" | "kimi";

export type MessageCategory = "pricing" | "booking" | "coaching" | "reschedule" | "general";

interface RoutingContext {
  category: MessageCategory;
  contentLength: number;
  hasCoachingKeywords: boolean;
  isCreativeTask: boolean;
}

const COACHING_KEYWORDS = [
  "trening",
  "treningsplan",
  "øvelse",
  "teknikk",
  "swing",
  "putting",
  "handicap",
  "coaching",
  "analyse",
  "forbedring",
  "mål",
  "progresjon",
];

export function routeToModel(content: string): AIModel {
  const context = analyzeContent(content);

  // Kreativt innhold → Kimi
  if (context.isCreativeTask) {
    return "kimi";
  }

  // Coaching-relatert → Claude Sonnet
  if (context.hasCoachingKeywords) {
    return "claude-sonnet";
  }

  // Kort, enkel melding → Ollama
  if (context.contentLength < 100 && !context.hasCoachingKeywords) {
    return "ollama";
  }

  // Standard → Claude Haiku
  return "claude-haiku";
}

function analyzeContent(content: string): RoutingContext {
  const lowerContent = content.toLowerCase();

  return {
    category: categorizeMessage(content),
    contentLength: content.length,
    hasCoachingKeywords: COACHING_KEYWORDS.some((kw) => lowerContent.includes(kw)),
    isCreativeTask:
      lowerContent.includes("skriv") ||
      lowerContent.includes("lag") ||
      lowerContent.includes("kreativ"),
  };
}

export function categorizeMessage(content: string): MessageCategory {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes("pris") || lowerContent.includes("kost") || lowerContent.includes("betaling")) {
    return "pricing";
  }
  if (lowerContent.includes("book") || lowerContent.includes("time") || lowerContent.includes("avtale")) {
    return "booking";
  }
  if (lowerContent.includes("trening") || lowerContent.includes("coaching") || lowerContent.includes("øvelse")) {
    return "coaching";
  }
  if (lowerContent.includes("avlys") || lowerContent.includes("endre") || lowerContent.includes("flytt")) {
    return "reschedule";
  }

  return "general";
}
