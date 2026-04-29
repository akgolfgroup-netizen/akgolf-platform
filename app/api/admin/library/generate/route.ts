import { NextRequest, NextResponse } from "next/server";
import { Capability } from "@prisma/client";
import { requireCapability } from "@/lib/portal/capabilities/check";
import { checkRateLimit } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { generateLibraryItems } from "@/lib/portal/library/generator";
import type { LibraryItemType } from "@prisma/client";

export const maxDuration = 300;

const ALLOWED_TYPES: LibraryItemType[] = [
  "DRILL",
  "EXERCISE",
  "TEST",
  "ACTIVITY",
  "COMPETITION_PREP",
];

export async function POST(request: NextRequest) {
  let userId: string;
  try {
    ({ userId } = await requireCapability(Capability.LIBRARY_GENERATE));
  } catch {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const rate = checkRateLimit(`library-generate:${userId}`, {
    limit: 10,
    windowSeconds: 3600,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Prøv igjen om en time." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const type = String(input.type ?? "");
  const area = String(input.area ?? "");
  const count = Math.max(1, Math.min(10, Number(input.count) || 3));
  const playerLevels = Array.isArray(input.playerLevels)
    ? (input.playerLevels.filter(l => typeof l === "string") as string[])
    : undefined;
  const difficulty = input.difficulty ? Number(input.difficulty) : undefined;
  const notes = typeof input.notes === "string" ? input.notes : undefined;

  if (!ALLOWED_TYPES.includes(type as LibraryItemType)) {
    return NextResponse.json({ error: "Ugyldig type" }, { status: 400 });
  }
  if (!area) {
    return NextResponse.json({ error: "area mangler" }, { status: 400 });
  }

  try {
    const result = await generateLibraryItems(
      {
        type: type as LibraryItemType,
        area,
        count,
        playerLevels,
        difficulty,
        notes,
      },
      userId
    );
    return NextResponse.json(result);
  } catch (err) {
    logger.error("library.generate.failed", {
      error: err instanceof Error ? err.message : String(err),
      userId,
      type,
      area,
    });
    return NextResponse.json(
      { error: "Kunne ikke generere innhold akkurat nå" },
      { status: 500 }
    );
  }
}
