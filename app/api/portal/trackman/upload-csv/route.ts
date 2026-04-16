import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { importTrackManSession } from "@/lib/portal/trackman/import-service";

/**
 * POST /api/portal/trackman/upload-csv — Last opp TrackMan CSV
 * Body: { csvContent: string, sessionDate?: string, context?: "TRAINING" | "CASUAL" | "COMPETITION" }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { csvContent, sessionDate, context, fileName } = body;

  if (!csvContent || typeof csvContent !== "string") {
    return NextResponse.json(
      { error: "csvContent er paakrevd" },
      { status: 400 }
    );
  }

  try {
    const result = await importTrackManSession({
      userId: user.id,
      csvContent,
      fileName,
      sessionDate,
      context,
    });

    return NextResponse.json({
      message: `${result.shotCount} slag importert`,
      importId: result.importId,
      sessionId: result.sessionId,
      context: result.context,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Feil ved import av CSV" },
      { status: 400 }
    );
  }
}
