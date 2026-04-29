import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { notFound, redirect } from "next/navigation";
import { RoundMapMode } from "@/components/portal/round/round-map-mode";
import { logShotWithGps } from "@/lib/portal/round/map-shot-actions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RoundKartPage({ params }: Props) {
  const { id } = await params;
  const user = await requirePortalUser();

  const round = await prisma.round.findUnique({
    where: { id },
    include: {
      Course: {
        include: {
          Hole: {
            orderBy: { holeNumber: "asc" },
            select: {
              id: true,
              holeNumber: true,
              par: true,
              lengthMeter: true,
              latitude: true,
              longitude: true,
              greenLat: true,
              greenLon: true,
              strategyOverlay: true,
            },
          },
        },
      },
    },
  });

  if (!round) notFound();
  if (round.userId !== user.id) notFound();
  if (round.isComplete) redirect(`/portal/runde/${id}/oppsummering`);

  const holes = round.Course?.Hole ?? [];

  return (
    <RoundMapMode
      roundId={round.id}
      userId={user.id}
      courseName={round.Course?.name ?? "Ukjent bane"}
      holes={holes as { id: string; holeNumber: number; par: number; lengthMeter: number; latitude: number | null; longitude: number | null; greenLat: number | null; greenLon: number | null; strategyOverlay: Record<string, unknown> | null }[]}
      onLogShot={logShotWithGps}
    />
  );
}
