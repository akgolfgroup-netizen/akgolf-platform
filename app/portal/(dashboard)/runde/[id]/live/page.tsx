import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getRoundDetail } from "../../actions";
import { notFound, redirect } from "next/navigation";
import { LiveRoundClient } from "@/components/portal/runde/live-round-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LiveRoundPage({ params }: Props) {
  const { id } = await params;
  const user = await requirePortalUser();

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
  type ShotRow = {
    shotNumber: number;
    club: string;
    fromLie: string;
    fromDistance: number;
    toLie: string;
    toDistance: number;
    strokesGained: number;
  };
  type HoleResultRow = {
    holeNumber: number;
    Shot: ShotRow[];
  };

  const courseData = round.Course as {
    name?: string;
    par?: number;
    Hole?: HoleRow[];
  } | null;
  const holes = (courseData?.Hole ?? []).map((h) => ({
    id: h.id,
    holeNumber: h.holeNumber,
    par: h.par,
    lengthMeter: h.lengthMeter ?? 0,
  }));

  const holeResults = (round.HoleResult ?? []) as HoleResultRow[];
  const initialShots: Record<number, ShotRow[]> = {};
  for (const hr of holeResults) {
    initialShots[hr.holeNumber] = (hr.Shot ?? []).map((s) => ({
      shotNumber: s.shotNumber,
      club: s.club,
      fromLie: s.fromLie,
      fromDistance: s.fromDistance,
      toLie: s.toLie,
      toDistance: s.toDistance,
      strokesGained: s.strokesGained ?? 0,
    }));
  }

  const supabase = await createServerSupabase();
  const { data: clubData } = await supabase
    .from("ClubInBag")
    .select("club")
    .eq("userId", user.id)
    .eq("isInActiveBag", true)
    .order("position", { ascending: true });

  const clubs = (clubData ?? []).map((c) => c.club);

  const liveState = (round.RoundLiveState as {
    currentHoleNumber?: number;
    currentShotNumber?: number;
    isPaused?: boolean;
  } | null) ?? { currentHoleNumber: 1, currentShotNumber: 0, isPaused: false };

  return (
    <LiveRoundClient
      roundId={round.id}
      courseName={courseData?.name ?? "Ukjent bane"}
      coursePar={courseData?.par ?? 72}
      holes={holes}
      clubs={clubs}
      initialShots={initialShots}
      liveState={{
        currentHoleNumber: liveState.currentHoleNumber ?? 1,
        currentShotNumber: liveState.currentShotNumber ?? 0,
        isPaused: liveState.isPaused ?? false,
      }}
    />
  );
}
