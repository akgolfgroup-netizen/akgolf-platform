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

  const holes = round.Course?.Hole ?? [];
  const existingResults = round.HoleResult ?? [];

  return (
    <LiveRoundClient
      roundId={round.id}
      courseName={round.Course?.name ?? "Ukjent bane"}
      coursePar={round.Course?.par ?? 72}
      holes={holes.map((h) => ({
        id: h.id,
        holeNumber: h.holeNumber,
        par: h.par,
        handicap: h.handicap,
        lengthMeter: h.lengthMeter,
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
