import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { listDrills, createDrill } from "@/lib/portal/technical-plan/service";
import type { TrainingArea } from "@/lib/portal/technical-plan/types";

/**
 * GET /api/portal/admin/drills?area=<TrainingArea>
 * Returns drills, optionally filtered by area.
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const area = req.nextUrl.searchParams.get("area") as TrainingArea | null;
  const drills = await listDrills(area ?? undefined);
  return NextResponse.json({ drills });
}

/**
 * POST /api/portal/admin/drills
 * Creates a new drill.
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.name || !body.category) {
    return NextResponse.json(
      { error: "name og category er påkrevd" },
      { status: 400 }
    );
  }

  const drill = await createDrill({
    name: body.name,
    description: body.description,
    category: body.category,
    difficulty: body.difficulty ?? 1,
    recommendedReps: body.recommendedReps,
    recommendedSets: body.recommendedSets,
    mediaUrls: body.mediaUrls,
    tags: body.tags,
    createdBy: user.id,
  });

  return NextResponse.json({ drill }, { status: 201 });
}
