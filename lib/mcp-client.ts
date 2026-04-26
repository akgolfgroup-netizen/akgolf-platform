// MCP-client for AK Golf Platform
// Kommuniserer med ak-golf-mcp-server via HTTP-bridge

const MCP_URL = process.env.MCP_SERVER_URL ?? "http://localhost:3100";
const MCP_KEY = process.env.MCP_API_KEY ?? "dev-key-change-me";

export class McpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly toolName?: string
  ) {
    super(message);
    this.name = "McpError";
  }
}

interface McpToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

/**
 * Kall en MCP tool og parse JSON-respons.
 *
 * Tools tilgjengelig:
 * - calculate_usi
 * - recommend_drills
 * - generate_training_plan
 * - log_coaching_session
 * - analyze_round
 * - check_promotion
 */
export async function callMcpTool<T = unknown>(
  toolName: string,
  args: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${MCP_URL}/tools/${toolName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MCP_KEY}`,
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new McpError(
      `MCP-call feilet (${response.status}): ${errorText}`,
      response.status,
      toolName
    );
  }

  const json = (await response.json()) as McpToolResponse;

  if (json.isError) {
    throw new McpError(
      json.content?.[0]?.text ?? "Ukjent MCP-feil",
      500,
      toolName
    );
  }

  // Parser tekst-respons (JSON-stringified output)
  const text = json.content?.[0]?.text ?? "{}";
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/**
 * Hent en MCP resource (read-only data).
 *
 * Eksempler:
 * - ak-golf://drills/all
 * - ak-golf://drills/category/D
 * - ak-golf://methodology/morad
 * - ak-golf://players/[id]/usi
 */
export async function getMcpResource<T = unknown>(uri: string): Promise<T> {
  const encoded = encodeURIComponent(uri);
  const response = await fetch(`${MCP_URL}/resources/${encoded}`, {
    headers: { Authorization: `Bearer ${MCP_KEY}` },
  });

  if (!response.ok) {
    throw new McpError(
      `MCP-resource feilet: ${await response.text()}`,
      response.status
    );
  }

  const result = (await response.json()) as { uri: string; content: string };

  // Forsøk JSON-parse, fall back til rå tekst
  try {
    return JSON.parse(result.content) as T;
  } catch {
    return result.content as unknown as T;
  }
}

/**
 * Sjekk at MCP-serveren er tilgjengelig.
 */
export async function checkMcpHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${MCP_URL}/health`, {
      headers: { Authorization: `Bearer ${MCP_KEY}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// === Type-trygge wrappers ===

export interface USIResult {
  totalUSI: number;
  dimensions: Record<string, number>;
  weakestDimension: string;
  strongestDimension: string;
  recommendedCategory: string;
  dataPointsCount: number;
  confidence: number;
  recommendation: {
    primaryFocus: string;
    expectedROI: number;
    rationale: string;
  };
}

export async function calculateUSI(playerId: string, save = true): Promise<USIResult> {
  return callMcpTool<USIResult>("calculate_usi", { playerId, save });
}

export interface DrillRecommendation {
  playerId: string;
  playerCategory: string;
  usiSnapshot: { total: number; weakest: string; weakestValue: number };
  focusDimension: string;
  session: {
    warmup: { drillId: string; navn: string; duration: number } | null;
    mainBlocks: Array<{ drillId: string; navn: string; duration: number }>;
    cooldown: { drillId: string; navn: string; duration: number } | null;
    totalDuration: number;
  };
  rationale: string;
}

export async function recommendDrills(args: {
  playerId: string;
  sessionDuration: 30 | 60 | 90 | 120;
  environment: "M0" | "M1" | "M2" | "M3" | "M4" | "M5";
  focusOverride?: string;
}): Promise<DrillRecommendation> {
  return callMcpTool<DrillRecommendation>("recommend_drills", args);
}

export async function generateTrainingPlan(args: {
  playerId: string;
  period: "GRUNN" | "SPES" | "TURN";
  hoursPerWeek?: number;
  startDate?: string;
  save?: boolean;
}) {
  return callMcpTool("generate_training_plan", args);
}

export async function logCoachingSession(args: {
  playerId: string;
  coachId: string;
  duration: number;
  formulaId: string;
  drillsExecuted: string[];
  coachNotes: string;
  qualityRating?: number;
  breakingPoints?: Array<{ type: string; threshold: string }>;
}) {
  return callMcpTool("log_coaching_session", args);
}

export async function analyzeRound(args: {
  playerId: string;
  score: number;
  par: number;
  fairwaysHit: boolean[];
  girHits: boolean[];
  putts: number[];
  penalties?: number;
}) {
  return callMcpTool("analyze_round", args);
}

export async function checkPromotion(playerId: string) {
  return callMcpTool("check_promotion", { playerId });
}
