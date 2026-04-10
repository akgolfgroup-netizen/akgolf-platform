import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../actions";
import { notFound, redirect } from "next/navigation";
import { LiveRoundClient } from "./live-round-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LiveRundePage({ params }: Props) {
  const { id } = await params;
  await requirePortalUser();

  const round = await getRoundDetail(id);
  if (!round) notFound();

  if (round.isComplete) {
    redirect(`/portal/runde/${id}/oppsummering`);
  }

  type HoleRow = { id: string; holeNumber: number; par: number; handicap: number | null; lengthMeter: number | null };
  type HoleResultRow = { holeNumber: number; score: number; putts: number; fairwayHit: boolean | null; gir: boolean };

  const courseData = round.Course as { name?: string; par?: number; Hole?: HoleRow[] } | null;
  const holes = (courseData?.Hole ?? []) as HoleRow[];
  const existingResults = (round.HoleResult ?? []) as HoleResultRow[];

  return (
    <LiveRoundClient
      roundId={round.id}
      courseName={courseData?.name ?? "Ukjent bane"}
      coursePar={courseData?.par ?? 72}
      holes={holes.map((h) => ({
        id: h.id,
        holeNumber: h.holeNumber,
        par: h.par,
        handicap: h.handicap,
        lengthMeter: h.lengthMeter ?? 0,
      }))}
      existingResults={existingResults.map((r) => ({
        holeNumber: r.holeNumber,
        score: r.score,
        putts: r.putts,
        fairwayHit: r.fairwayHit,
        gir: r.gir,
      }))}
    />
  );
}
