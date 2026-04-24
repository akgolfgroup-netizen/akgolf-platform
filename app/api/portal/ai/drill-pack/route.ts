import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import {
  generateDrill,
  type PyramidLevel,
  type SGArea,
  type DifficultyLevel,
} from "@/lib/portal/ai/generate-drill";

export const maxDuration = 120;

const RATE_LIMIT = { limit: 20, windowSeconds: 3600 };

type SGAreaInput = SGArea | "TEE_TOTAL" | "APPROACH" | "SHORT_GAME" | "PUTTING";

const SG_MAP: Record<string, SGArea> = {
  tee: "tee",
  TEE_TOTAL: "tee",
  approach: "approach",
  APPROACH: "approach",
  short_game: "short_game",
  SHORT_GAME: "short_game",
  putting: "putting",
  PUTTING: "putting",
};

const PYRAMID_FOR_AREA: Record<SGArea, PyramidLevel> = {
  tee: "SLAG",
  approach: "SLAG",
  short_game: "SPILL",
  putting: "SPILL",
};

function difficultyToNumber(d: DifficultyLevel): number {
  const map: Record<DifficultyLevel, number> = {
    nybegynner: 1,
    rekrutt: 2,
    klubb: 3,
    regional: 4,
    nasjonal: 5,
    elite: 6,
  };
  return map[d] ?? 3;
}

/**
 * POST /api/portal/ai/drill-pack
 *
 * Body:
 *   - focusAreas: string[] (strings like "putting", "approach" or FocusArea enum values)
 *   - count: number (per focus area, default 3)
 *   - difficulty: DifficultyLevel (default "klubb")
 *   - studentId?: string — if provided, drills are added to UserExerciseBank
 *   - persist: boolean (default true) — persist to ExerciseDefinition
 *
 * Generates multiple drills in parallel. Returns the generated + persisted drills.
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(`drill-pack:${user.id}`, RATE_LIMIT);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler", resetAt: rateLimit.resetAt },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.focusAreas) || body.focusAreas.length === 0) {
    return NextResponse.json(
      { error: "focusAreas (string[]) er påkrevd" },
      { status: 400 }
    );
  }

  const focusAreas = (body.focusAreas as SGAreaInput[])
    .map((a) => SG_MAP[a])
    .filter(Boolean);
  if (focusAreas.length === 0) {
    return NextResponse.json({ error: "Ingen gyldige fokusområder" }, { status: 400 });
  }

  const count = Math.min(Math.max(Number(body.count) || 3, 1), 5);
  const difficulty: DifficultyLevel = body.difficulty ?? "klubb";
  const persist = body.persist !== false;
  const studentId: string | undefined = body.studentId;

  // Build generation tasks
  const tasks: Array<{ sgArea: SGArea; idx: number }> = [];
  for (const area of focusAreas) {
    for (let i = 0; i < count; i++) {
      tasks.push({ sgArea: area, idx: i });
    }
  }

  try {
    const drills = await Promise.all(
      tasks.map((t) =>
        generateDrill({
          pyramidLevel: PYRAMID_FOR_AREA[t.sgArea],
          trainingArea: t.sgArea,
          difficulty,
          sgArea: t.sgArea,
        }).catch((err) => {
          logger.error(`[drill-pack] Generation failed for ${t.sgArea}`, err);
          return null;
        })
      )
    );

    const valid = drills.filter((d): d is NonNullable<typeof d> => d !== null);

    if (!persist) {
      return NextResponse.json({ drills: valid });
    }

    // Persist to ExerciseDefinition
    const persisted = await Promise.all(
      valid.map(async (drill) => {
        const id = nanoid();
        const created = await prisma.exerciseDefinition.create({
          data: {
            id,
            name: drill.name,
            description: drill.description,
            instructions: drill.instructions,
            pyramid: drill.pyramid_level,
            area: drill.sg_area,
            lPhase: drill.l_phase,
            equipment: drill.equipment,
            minDurationMinutes: drill.duration_minutes,
            maxDurationMinutes: drill.duration_minutes,
            difficulty: difficultyToNumber(drill.difficulty),
            isPublic: false,
            isSystemDrill: false,
            createdById: user.id,
            tags: drill.tags,
            updatedAt: new Date(),
          },
        });
        return { ...drill, id: created.id };
      })
    );

    // If studentId provided, add to UserExerciseBank
    if (studentId && persisted.length > 0) {
      await Promise.all(
        persisted.map((d) =>
          prisma.userExerciseBank.create({
            data: {
              id: nanoid(),
              userId: studentId,
              exerciseId: d.id,
            },
          }).catch((err) => logger.error("[drill-pack] bank add failed", err))
        )
      );
    }

    return NextResponse.json({ drills: persisted, count: persisted.length });
  } catch (err) {
    logger.error("[drill-pack] fatal", err);
    return NextResponse.json(
      { error: "Kunne ikke generere drill-pakke" },
      { status: 500 }
    );
  }
}
