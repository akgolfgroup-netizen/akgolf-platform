import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import {
  ArrowLeft,
  Flag,
  Target,
  TrendingDown,
  TrendingUp,
  Circle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RoundSummaryPage({ params }: Props) {
  const { id } = await params;
  await requirePortalUser();

  const round = await getRoundDetail(id);
  if (!round) notFound();

  type HoleResultRow = {
    scoreToPar: number;
    gir: boolean;
    fairwayHit: boolean | null;
    putts: number;
  };
  const holes = (round.HoleResult ?? []) as HoleResultRow[];
  const courseName = (round.Course as { name?: string } | null)?.name ?? "Ukjent bane";
  const coursePar = (round.Course as { par?: number } | null)?.par ?? 72;

  const eagles = holes.filter((h) => h.scoreToPar <= -2).length;
  const birdies = holes.filter((h) => h.scoreToPar === -1).length;
  const pars = holes.filter((h) => h.scoreToPar === 0).length;
  const bogeys = holes.filter((h) => h.scoreToPar === 1).length;
  const doubles = holes.filter((h) => h.scoreToPar >= 2).length;

  const girCount = holes.filter((h) => h.gir).length;
  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;
  const totalPutts = holes.reduce((s, h) => s + h.putts, 0);

  const scoreColor =
    (round.scoreToPar ?? 0) < 0
      ? "text-primary"
      : (round.scoreToPar ?? 0) === 0
        ? "text-portal-text"
        : "text-portal-secondary";

  const sgSections = [
    { label: "Off The Tee", value: round.sgOffTheTee, icon: Target },
    { label: "Approach", value: round.sgApproach, icon: Target },
    { label: "Short Game", value: round.sgShortGame, icon: Circle },
    { label: "Putting", value: round.sgPutting, icon: Flag },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href="/portal/runde/ny"
        className="flex items-center gap-2 text-sm text-portal-secondary hover:text-portal-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Ny runde
      </Link>

      {/* Score headline */}
      <PremiumCard className="text-center" padding="lg">
        <div className="text-sm text-portal-secondary">{courseName}</div>
        <div className={`text-6xl font-bold mt-2 tabular-nums tracking-tight ${scoreColor}`}>
          {round.totalScore ?? "-"}
        </div>
        <div className="text-lg text-portal-secondary mt-1 tabular-nums">
          {(round.scoreToPar ?? 0) > 0 ? "+" : ""}
          {round.scoreToPar ?? 0} (par {coursePar})
        </div>
        <div className="text-xs text-portal-muted mt-2">
          {new Date(round.date).toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </PremiumCard>

      {/* Score-fordeling */}
      <PremiumCard padding="lg">
        <h2 className="text-sm font-semibold text-portal-text mb-4">
          Score-fordeling
        </h2>
        <div className="flex items-end justify-around h-28">
          {[
            { label: "Eagle+", count: eagles, color: "bg-primary" },
            { label: "Birdie", count: birdies, color: "bg-primary-alt" },
            { label: "Par", count: pars, color: "bg-portal-text" },
            { label: "Bogey", count: bogeys, color: "bg-portal-secondary" },
            { label: "Dobbel+", count: doubles, color: "bg-portal-muted" },
          ].map((item) => {
            const maxCount = Math.max(eagles, birdies, pars, bogeys, doubles, 1);
            const height = Math.max(4, (item.count / maxCount) * 80);
            return (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-portal-text tabular-nums">
                  {item.count}
                </span>
                <div
                  className={`w-10 rounded-t-lg transition-all ${item.color}`}
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs text-portal-secondary">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </PremiumCard>

      {/* Statistikk */}
      <div className="grid grid-cols-3 gap-3">
        <PremiumCard className="text-center" padding="sm">
          <div className="text-2xl font-bold text-portal-text tabular-nums tracking-tight">
            {fairwayHoles.length > 0
              ? `${Math.round((fairwaysHit / fairwayHoles.length) * 100)}%`
              : "-"}
          </div>
          <div className="text-xs text-portal-secondary mt-1">
            Fairway ({fairwaysHit}/{fairwayHoles.length})
          </div>
        </PremiumCard>
        <PremiumCard className="text-center" padding="sm">
          <div className="text-2xl font-bold text-portal-text tabular-nums tracking-tight">
            {holes.length > 0
              ? `${Math.round((girCount / holes.length) * 100)}%`
              : "-"}
          </div>
          <div className="text-xs text-portal-secondary mt-1">
            GIR ({girCount}/{holes.length})
          </div>
        </PremiumCard>
        <PremiumCard className="text-center" padding="sm">
          <div className="text-2xl font-bold text-portal-text tabular-nums tracking-tight">
            {totalPutts}
          </div>
          <div className="text-xs text-portal-secondary mt-1">
            Putts ({holes.length > 0 ? (totalPutts / holes.length).toFixed(1) : "-"}/hull)
          </div>
        </PremiumCard>
      </div>

      {/* SG Breakdown */}
      {round.sgTotal !== null && (
        <PremiumCard padding="lg">
          <h2 className="text-sm font-semibold text-portal-text mb-1">
            Strokes Gained
          </h2>
          <div className="text-3xl font-bold text-portal-text mb-4 tabular-nums tracking-tight">
            {(round.sgTotal ?? 0) > 0 ? "+" : ""}
            {(round.sgTotal ?? 0).toFixed(1)}
          </div>
          <div className="space-y-3">
            {sgSections.map((sg) => {
              if (sg.value === null) return null;
              const isPositive = sg.value > 0;
              return (
                <div key={sg.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-portal-secondary" />
                    )}
                    <span className="text-sm text-portal-text">
                      {sg.label}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      isPositive
                        ? "text-primary"
                        : "text-portal-secondary"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {sg.value.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </PremiumCard>
      )}

      {/* DECADE Score */}
      {round.decadeScore !== null && (
        <PremiumCard padding="lg">
          <h2 className="text-sm font-semibold text-portal-text mb-1">
            DECADE Score
          </h2>
          <div className="text-3xl font-bold text-portal-text tabular-nums tracking-tight">
            {round.decadeScore}/100
          </div>
          <div className="w-full bg-portal-hover rounded-full h-3 mt-3">
            <div
              className="h-3 rounded-full bg-primary transition-all"
              style={{ width: `${round.decadeScore}%` }}
            />
          </div>
          <p className="text-xs text-portal-secondary mt-2">
            Strategietterlevelse og beslutningskvalitet
          </p>
        </PremiumCard>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/portal/statistikk"
          className="flex-1 text-center py-3 rounded-[20px] border border-portal-border text-portal-text font-medium hover:bg-portal-hover transition-all duration-300"
        >
          Se statistikk
        </Link>
        <Link
          href="/portal/runde/ny"
          className="flex-1 text-center py-3 rounded-[20px] bg-primary text-white font-medium hover:opacity-85 active:scale-[0.98] transition-all duration-300"
        >
          Ny runde
        </Link>
      </div>
    </div>
  );
}
