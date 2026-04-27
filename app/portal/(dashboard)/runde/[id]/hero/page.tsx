import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../../actions";
import { notFound, redirect } from "next/navigation";
import { RundeCourseHeroClient } from "./course-hero-client";
import { RundeV2Client } from "@/components/portal/runde/v2/runde-v2-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}

export default async function RundeCourseHeroPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  await requirePortalUser();

  const round = await getRoundDetail(id);
  if (!round) notFound();

  if (round.isComplete) {
    redirect(`/portal/runde/${id}/oppsummering`);
  }

  type HoleRow = {
    id: string;
    holeNumber: number;
    par: number;
    lengthMeter: number | null;
  };
  type HoleResultRow = {
    holeNumber: number;
    score: number;
    putts: number;
  };

  const courseData = round.Course as {
    name?: string;
    par?: number;
    Hole?: HoleRow[];
  } | null;
  const holes = (courseData?.Hole ?? []) as HoleRow[];
  const existingResults = (round.HoleResult ?? []) as HoleResultRow[];

  const completedCount = existingResults.length;
  const currentHoleNumber =
    completedCount < 18 ? completedCount + 1 : 18;
  const currentHole =
    holes.find((h) => h.holeNumber === currentHoleNumber) ?? holes[0];

  const totalScore = existingResults.reduce(
    (sum, r) => sum + (r.score ?? 0),
    0
  );
  const parPlayed = existingResults.reduce((sum, r) => {
    const hole = holes.find((h) => h.holeNumber === r.holeNumber);
    return sum + (hole?.par ?? 4);
  }, 0);
  const relative = totalScore - parPlayed;

  if (sp.v === "2") {
    return (
      <RundeV2Client
        roundId={round.id}
        courseName={courseData?.name ?? "Ukjent bane"}
        coursePar={courseData?.par ?? 72}
        holes={holes.map((h) => ({
          id: h.id,
          holeNumber: h.holeNumber,
          par: h.par,
          lengthMeter: h.lengthMeter ?? 0,
        }))}
        existingResults={existingResults.map((r) => ({
          holeNumber: r.holeNumber,
          score: r.score,
          putts: r.putts,
        }))}
        currentHole={
          currentHole
            ? {
                id: currentHole.id,
                holeNumber: currentHole.holeNumber,
                par: currentHole.par,
                lengthMeter: currentHole.lengthMeter ?? 0,
              }
            : null
        }
        totalScore={totalScore}
        relative={relative}
        completedCount={completedCount}
      />
    );
  }

  return (
    <RundeCourseHeroClient
      roundId={round.id}
      courseName={courseData?.name ?? "Ukjent bane"}
      coursePar={courseData?.par ?? 72}
      holes={holes.map((h) => ({
        id: h.id,
        holeNumber: h.holeNumber,
        par: h.par,
        lengthMeter: h.lengthMeter ?? 0,
      }))}
      existingResults={existingResults.map((r) => ({
        holeNumber: r.holeNumber,
        score: r.score,
        putts: r.putts,
      }))}
      currentHole={
        currentHole
          ? {
              id: currentHole.id,
              holeNumber: currentHole.holeNumber,
              par: currentHole.par,
              lengthMeter: currentHole.lengthMeter ?? 0,
            }
          : null
      }
      totalScore={totalScore}
      relative={relative}
      completedCount={completedCount}
    />
  );
}
