import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import {
  generateDrill,
  validateDrillInput,
} from "@/lib/portal/ai/generate-drill";
import { syncDrillToNotion } from "@/lib/portal/notion/drill-sync";
import { nanoid } from "nanoid";

export const maxDuration = 60;

/** Rate limit: 10 per time for drill-generering */
const DRILL_RATE_LIMIT = { limit: 10, windowSeconds: 3600 };

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(
    `generate-drill:${user.id}`,
    DRILL_RATE_LIMIT
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "For mange foresporsler. Maks 10 drill-genereringer per time.",
        resetAt: rateLimit.resetAt,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ugyldig JSON i foresporselen" },
      { status: 400 }
    );
  }

  const validation = validateDrillInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const drill = await generateDrill(validation.data);
    const drillId = nanoid();

    // Sync til Notion (non-blocking)
    let notionSynced = false;
    syncDrillToNotion({
      id: drillId,
      name: drill.name,
      description: drill.description,
      instructions: drill.instructions,
      pyramid: drill.pyramid_level,
      area: drill.sg_area,
      lPhase: drill.l_phase,
      difficulty: difficultyToNumber(drill.difficulty),
      minDurationMinutes: drill.duration_minutes,
      maxDurationMinutes: drill.duration_minutes,
      isPublic: false,
      isSystemDrill: true,
      tags: drill.tags,
      createdById: user.id,
    })
      .then(() => {
        notionSynced = true;
        logger.info(
          `[generate-drill] Notion sync OK for "${drill.name}" (${drillId})`
        );
      })
      .catch((err) => {
        logger.error(
          `[generate-drill] Notion sync feilet for "${drill.name}"`,
          err
        );
      });

    return NextResponse.json({
      drill: {
        id: drillId,
        ...drill,
      },
      notionSynced,
    });
  } catch (error) {
    logger.error(
      "[generate-drill] Feil ved generering:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Kunne ikke generere drill. Prov igjen." },
      { status: 500 }
    );
  }
}

function difficultyToNumber(
  difficulty: string
): number {
  const map: Record<string, number> = {
    nybegynner: 1,
    rekrutt: 2,
    klubb: 3,
    regional: 4,
    nasjonal: 5,
    elite: 6,
  };
  return map[difficulty] ?? 3;
}
