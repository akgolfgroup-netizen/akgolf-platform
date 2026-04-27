import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Capability } from "@prisma/client";
import { requireCapability } from "@/lib/portal/capabilities/check";
import { prisma } from "@/lib/portal/prisma";
import type { LibraryItemType } from "@prisma/client";

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
    ({ userId } = await requireCapability(Capability.LIBRARY_VIEW));
  } catch {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const type = String(body.type ?? "");
  if (!ALLOWED_TYPES.includes(type as LibraryItemType)) {
    return NextResponse.json({ error: "Ugyldig type" }, { status: 400 });
  }
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Tittel mangler" }, { status: 400 });
  }
  const area = String(body.area ?? "").trim();
  if (!area) {
    return NextResponse.json({ error: "Område mangler" }, { status: 400 });
  }

  const arr = (k: string): string[] =>
    Array.isArray(body[k])
      ? (body[k] as unknown[]).filter(v => typeof v === "string") as string[]
      : [];
  const num = (k: string, fb: number): number =>
    typeof body[k] === "number" ? (body[k] as number) : fb;
  const optStr = (k: string): string | null => {
    const v = body[k];
    return typeof v === "string" && v.length > 0 ? v : null;
  };

  const created = await prisma.libraryItem.create({
    data: {
      id: nanoid(),
      type: type as LibraryItemType,
      status: "DRAFT",
      source: "MANUAL",
      title,
      summary: String(body.summary ?? ""),
      pyramid: String(body.pyramid ?? "SLAG"),
      area,
      subArea: optStr("subArea"),
      lPhase: optStr("lPhase"),
      playerLevels: arr("playerLevels"),
      difficulty: Math.max(1, Math.min(5, num("difficulty", 3))),
      minDurationMinutes: Math.max(1, num("minDurationMinutes", 5)),
      maxDurationMinutes: Math.max(1, num("maxDurationMinutes", 30)),
      equipment: arr("equipment"),
      setup: optStr("setup"),
      execution: optStr("execution"),
      scoring: optStr("scoring"),
      variations: optStr("variations"),
      coachingCues: optStr("coachingCues"),
      tags: arr("tags"),
      generatedBy: "manual",
      createdById: userId,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(created, { status: 201 });
}
