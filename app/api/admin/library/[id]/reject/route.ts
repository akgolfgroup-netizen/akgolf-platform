import { NextRequest, NextResponse } from "next/server";
import { Capability } from "@prisma/client";
import { requireCapability } from "@/lib/portal/capabilities/check";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let userId: string;
  try {
    ({ userId } = await requireCapability(Capability.LIBRARY_APPROVE));
  } catch {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // ok — kropp er valgfri
  }
  const reason =
    typeof (body as Record<string, unknown>).reason === "string"
      ? (body as Record<string, unknown>).reason as string
      : null;

  try {
    await prisma.libraryItem.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedById: userId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
    logger.info("library.rejected", { id, userId, reason });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("library.reject.failed", {
      id,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Kunne ikke avvise" }, { status: 500 });
  }
}
