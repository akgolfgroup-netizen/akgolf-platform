import { NextRequest, NextResponse } from "next/server";
import { Capability } from "@prisma/client";
import { requireCapability } from "@/lib/portal/capabilities/check";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";

export async function POST(
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
    const updated = await prisma.libraryItem.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: userId,
        approvedAt: new Date(),
        rejectedById: null,
        rejectedAt: null,
        rejectionReason: null,
      },
    });
    logger.info("library.approved", { id, userId });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    logger.error("library.approve.failed", {
      id,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Kunne ikke godkjenne" },
      { status: 500 }
    );
  }
}
