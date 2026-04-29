import { NextRequest, NextResponse } from "next/server";
import { Capability } from "@prisma/client";
import { requireCapability } from "@/lib/portal/capabilities/check";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";

const EDITABLE_FIELDS = [
  "title",
  "summary",
  "pyramid",
  "area",
  "subArea",
  "lPhase",
  "playerLevels",
  "difficulty",
  "minDurationMinutes",
  "maxDurationMinutes",
  "equipment",
  "setup",
  "execution",
  "scoring",
  "variations",
  "coachingCues",
  "tags",
] as const;

type EditableField = (typeof EDITABLE_FIELDS)[number];

function pickEditable(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in input) {
      out[key] = input[key as EditableField];
    }
  }
  return out;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const data = pickEditable(body);
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Ingen endringer" }, { status: 400 });
  }

  try {
    const updated = await prisma.libraryItem.update({
      where: { id },
      data,
    });
    logger.info("library.updated", { id, userId, fields: Object.keys(data) });
    return NextResponse.json(updated);
  } catch (err) {
    logger.error("library.update.failed", {
      id,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Kunne ikke lagre" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let userId: string;
  try {
    ({ userId } = await requireCapability(Capability.LIBRARY_APPROVE));
  } catch {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  try {
    await prisma.libraryItem.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    logger.info("library.archived", { id, userId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("library.archive.failed", {
      id,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Kunne ikke arkivere" },
      { status: 500 }
    );
  }
}
