import { Icon } from "@/components/ui/icon";
import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Flag, Target, Circle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SummaryShotTable } from "@/components/portal/runde/summary-shot-table";
import { SummaryScorecard } from "@/components/portal/runde/summary-scorecard";

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
    score: number;
    holeNumber: number;
    par: number;
    sgTotal: number | null;
  };

  type ShotRow = {
    shotNumber: number;
    club: string;
    fromLie: string;
    fromDistance: number;
    toLie: string;
    toDistance: number;
    strokesGained: number;
    sgCategory: string;
  };

  type HoleRow = {
    holeNumber: number;
    par: number;
    lengthMeter: number;
  };

  const holes = ((round.Course as { Hole?: HoleRow[] } | null)?.Hole ?? []) as HoleRow[];
  const courseName = (round.Course as { name?: string } | null)?.name ?? "Ukjent bane";
  // coursePar brukes indirekte via holes
  const holeResults = (round.HoleResult ?? []) as HoleResultRow[];

  // Stats
  const eagles = holeResults.filter((h) => h.scoreToPar <= -2).length;
  const birdies = holeResults.filter((h) => h.scoreToPar === -1).length;
  const pars = holeResults.filter((h) => h.scoreToPar === 0).length;
  const bogeys = holeResults.filter((h) => h.scoreToPar === 1).length;
  const doubles = holeResults.filter((h) => h.scoreToPar >= 2).length;
  const girCount = holeResults.filter((h) => h.gir).length;
  const girPercentage = holeResults.length > 0 ? Math.round((girCount / holeResults.length) * 100) : 0;
  const fairwayHoles = holeResults.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;
  const fairwayPercentage = fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : 0;
  const totalPutts = holeResults.reduce((s, h) => s + h.putts, 0);
  const puttsPerHole = holeResults.length > 0 ? (totalPutts / holeResults.length).toFixed(1) : "–";
  const scrambleOpportunities = holeResults.filter((h) => !h.gir).length;
  const scrambleSuccess = holeResults.filter(
    (h) => !h.gir && h.score <= (holes.find((ch) => ch.holeNumber === h.holeNumber)?.par || 4)
  ).length;
  const scramblePercentage = scrambleOpportunities > 0 ? Math.round((scrambleSuccess / scrambleOpportunities) * 100) : 0;

  const frontNine = holeResults.filter((h) => h.holeNumber <= 9);
  const backNine = holeResults.filter((h) => h.holeNumber > 9);
  const frontNineScore = frontNine.reduce((s, h) => s + h.score, 0);
  const backNineScore = backNine.reduce((s, h) => s + h.score, 0);
  const frontNinePar = holes.filter((h) => h.holeNumber <= 9).reduce((s, h) => s + h.par, 0);
  const backNinePar = holes.filter((h) => h.holeNumber > 9).reduce((s, h) => s + h.par, 0);

  const scoreToPar = round.scoreToPar ?? 0;
  const scoreColor = scoreToPar < 0 ? "text-success" : scoreToPar === 0 ? "text-on-surface" : "text-danger";
  const scoreLabel = scoreToPar < 0 ? "Under par!" : scoreToPar === 0 ? "Par" : "Over par";

  // Shots flat list
  const flatShots: (ShotRow & { holeNumber: number })[] = [];
  for (const hr of holeResults) {
    const shots = ((hr as unknown as { Shot?: ShotRow[] }).Shot ?? []);
    for (const s of shots) {
      flatShots.push({ ...s, holeNumber: hr.holeNumber });
    }
  }

  const sgBreakdown = [
    { label: "Off The Tee", value: round.sgOffTheTee, icon: Flag, key: "OTT" },
    { label: "Approach", value: round.sgApproach, icon: Target, key: "APP" },
    { label: "Short Game", value: round.sgShortGame, icon: Circle, key: "ARG" },
    { label: "Putting", value: round.sgPutting, icon: Flag, key: "PUT" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      {/* Back navigation */}
      <Link
        href="/portal/runde/ny"
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Icon name="arrow_back" className="h-4 w-4" />
        Ny runde
      </Link>

      {/* Main Score Card */}
      <PremiumCard padding="xl" className="text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary-fixed/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm text-on-surface-variant">{courseName}</p>
          <div className="my-4">
            <span className={cn("text-7xl font-bold tabular-nums tracking-tight", scoreColor)}>
              {round.totalScore ?? "–"}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className={cn("text-xl font-medium", scoreColor)}>
              {scoreToPar > 0 ? "+" : ""}{scoreToPar}
            </span>
            <span className="text-on-surface-variant/60">•</span>
            <span className="text-on-surface-variant">{scoreLabel}</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            {new Date(round.date).toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {frontNine.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-outline-variant/30">
              <div className="text-center">
                <p className="text-xs text-on-surface-variant">Ut</p>
                <p className={cn("text-lg font-bold", frontNineScore < frontNinePar ? "text-success" : frontNineScore > frontNinePar ? "text-danger" : "text-on-surface")}>
                  {frontNineScore}
                </p>
                <p className="text-xs text-on-surface-variant/60">Par {frontNinePar}</p>
              </div>
              {backNine.length > 0 && (
                <>
                  <div className="w-px h-10 bg-surface-variant" />
                  <div className="text-center">
                    <p className="text-xs text-on-surface-variant">Inn</p>
                    <p className={cn("text-lg font-bold", backNineScore < backNinePar ? "text-success" : backNineScore > backNinePar ? "text-danger" : "text-on-surface")}>
                      {backNineScore}
                    </p>
                    <p className="text-xs text-on-surface-variant/60">Par {backNinePar}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </PremiumCard>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <PremiumCard padding="md" className="text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <Icon name="my_location" className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface tabular-nums">{fairwayPercentage}%</p>
          <p className="text-xs text-on-surface-variant">Fairway ({fairwaysHit}/{fairwayHoles.length})</p>
        </PremiumCard>
        <PremiumCard padding="md" className="text-center">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
            <Icon name="circle" className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface tabular-nums">{girPercentage}%</p>
          <p className="text-xs text-on-surface-variant">GIR ({girCount}/{holeResults.length})</p>
        </PremiumCard>
        <PremiumCard padding="md" className="text-center">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2">
            <Icon name="flag" className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface tabular-nums">{puttsPerHole}</p>
          <p className="text-xs text-on-surface-variant">Putts per hull</p>
        </PremiumCard>
        <PremiumCard padding="md" className="text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
            <Icon name="emoji_events" className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface tabular-nums">{scramblePercentage}%</p>
          <p className="text-xs text-on-surface-variant">Scramble ({scrambleSuccess}/{scrambleOpportunities})</p>
        </PremiumCard>
      </div>

      {/* Score Distribution */}
      <PremiumCard padding="lg">
        <h2 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="bar_chart" className="w-4 h-4" />
          Score-fordeling
        </h2>
        <div className="flex items-end justify-around h-32 gap-2">
          {[
            { label: "Eagle+", count: eagles, color: "bg-green-500" },
            { label: "Birdie", count: birdies, color: "bg-green-400" },
            { label: "Par", count: pars, color: "bg-on-surface" },
            { label: "Bogey", count: bogeys, color: "bg-orange-400" },
            { label: "Dobbel+", count: doubles, color: "bg-red-400" },
          ].map((item) => {
            const maxCount = Math.max(eagles, birdies, pars, bogeys, doubles, 1);
            const height = Math.max(8, (item.count / maxCount) * 100);
            return (
              <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full flex justify-center">
                  <div className={cn("w-full max-w-[50px] rounded-t-lg", item.color)} style={{ height: `${height}%`, minHeight: item.count > 0 ? 8 : 4 }} />
                  {item.count > 0 && (
                    <span className="absolute -top-5 text-xs font-bold text-on-surface">{item.count}</span>
                  )}
                </div>
                <span className="text-[10px] text-on-surface-variant text-center">{item.label}</span>
              </div>
            );
          })}
        </div>
      </PremiumCard>

      {/* Strokes Gained Breakdown */}
      {round.sgTotal !== null && (
        <PremiumCard padding="lg">
          <h2 className="text-sm font-semibold text-on-surface mb-1 flex items-center gap-2">
            <Icon name="trending_up" className="w-4 h-4" />
            Strokes Gained
          </h2>
          <div className="text-3xl font-bold text-on-surface mb-4 tabular-nums tracking-tight">
            {(round.sgTotal ?? 0) > 0 ? "+" : ""}
            {(round.sgTotal ?? 0).toFixed(1)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sgBreakdown.map((sg) => {
              if (sg.value === null) return null;
              const isPositive = sg.value > 0;
              const SgIcon = sg.icon;
              return (
                <div key={sg.key} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-1">
                    <SgIcon className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-xs text-on-surface-variant/80">{sg.label}</span>
                  </div>
                  <span className={cn("text-lg font-bold tabular-nums", isPositive ? "text-success" : "text-danger")}>
                    {isPositive ? "+" : ""}{sg.value.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </PremiumCard>
      )}

      {/* Shot table */}
      {flatShots.length > 0 && (
        <PremiumCard padding="lg">
          <h2 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="list" className="w-4 h-4" />
            Alle slag
          </h2>
          <SummaryShotTable shots={flatShots} />
        </PremiumCard>
      )}

      {/* Scorecard */}
      {holeResults.length > 0 && (
        <PremiumCard padding="lg">
          <h2 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="scoreboard" className="w-4 h-4" />
            Scorekort
          </h2>
          <SummaryScorecard holes={holes} results={holeResults} />
        </PremiumCard>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/portal/statistikk"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-outline-variant/30 text-on-surface font-medium hover:bg-surface transition-all"
        >
          <Icon name="bar_chart" className="w-4 h-4" />
          Se statistikk
        </Link>
        <Link
          href="/portal/runde/ny"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-secondary-fixed text-on-surface font-bold hover:opacity-90 transition-opacity"
        >
          <Icon name="restart_alt" className="w-4 h-4" />
          Ny runde
        </Link>
      </div>

      {/* Share */}
      <button
        className="w-full flex items-center justify-center gap-2 py-3 text-on-surface-variant hover:text-on-surface transition-colors text-sm"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "Min golfrunde",
              text: `Jeg spilte ${round.totalScore} slag på ${courseName}!`,
            });
          }
        }}
      >
        <Share2 className="w-4 h-4" />
        Del resultatet
      </button>
    </div>
  );
}
