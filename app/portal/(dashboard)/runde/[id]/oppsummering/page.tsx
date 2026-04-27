import { Icon } from "@/components/ui/icon";
import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Flag, Target, Circle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  };
  
  const holes = (round.HoleResult ?? []) as HoleResultRow[];
  const courseName = (round.Course as { name?: string; par?: number; Hole?: { holeNumber: number; par: number; lengthMeter: number }[] } | null)?.name ?? "Ukjent bane";
  const coursePar = (round.Course as { par?: number } | null)?.par ?? 72;
  const courseHoles = (round.Course as { Hole?: { holeNumber: number; par: number; lengthMeter: number }[] } | null)?.Hole ?? [];

  // Calculate statistics
  const eagles = holes.filter((h) => h.scoreToPar <= -2).length;
  const birdies = holes.filter((h) => h.scoreToPar === -1).length;
  const pars = holes.filter((h) => h.scoreToPar === 0).length;
  const bogeys = holes.filter((h) => h.scoreToPar === 1).length;
  const doubles = holes.filter((h) => h.scoreToPar >= 2).length;

  const girCount = holes.filter((h) => h.gir).length;
  const girPercentage = holes.length > 0 ? Math.round((girCount / holes.length) * 100) : 0;
  
  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;
  const fairwayPercentage = fairwayHoles.length > 0 ? Math.round((fairwaysHit / fairwayHoles.length) * 100) : 0;
  
  const totalPutts = holes.reduce((s, h) => s + h.putts, 0);
  const puttsPerHole = holes.length > 0 ? (totalPutts / holes.length).toFixed(1) : "–";
  
  // Scramble calculation (up and down when missing GIR)
  const scrambleOpportunities = holes.filter(h => !h.gir).length;
  const scrambleSuccess = holes.filter(h => !h.gir && h.score <= (courseHoles.find(ch => ch.holeNumber === h.holeNumber)?.par || 4)).length;
  const scramblePercentage = scrambleOpportunities > 0 
    ? Math.round((scrambleSuccess / scrambleOpportunities) * 100) 
    : 0;

  // Find best and worst holes
  const bestHole = holes.length > 0 ? holes.reduce((min, h) => h.scoreToPar < min.scoreToPar ? h : min) : null;
  const worstHole = holes.length > 0 ? holes.reduce((max, h) => h.scoreToPar > max.scoreToPar ? h : max) : null;

  // Calculate 9-hole splits
  const frontNine = holes.filter(h => h.holeNumber <= 9);
  const backNine = holes.filter(h => h.holeNumber > 9);
  const frontNineScore = frontNine.reduce((s, h) => s + h.score, 0);
  const backNineScore = backNine.reduce((s, h) => s + h.score, 0);
  const frontNinePar = courseHoles.filter(h => h.holeNumber <= 9).reduce((s, h) => s + h.par, 0);
  const backNinePar = courseHoles.filter(h => h.holeNumber > 9).reduce((s, h) => s + h.par, 0);

  const scoreToPar = round.scoreToPar ?? 0;
  const scoreColor = scoreToPar < 0 ? "text-green-500" : scoreToPar === 0 ? "text-on-surface" : "text-red-500";
  const scoreLabel = scoreToPar < 0 ? "Under par!" : scoreToPar === 0 ? "Par" : "Over par";

  const sgSections = [
    { label: "Off The Tee", value: round.sgOffTheTee, icon: Flag },
    { label: "Approach", value: round.sgApproach, icon: Target },
    { label: "Short Game", value: round.sgShortGame, icon: Circle },
    { label: "Putting", value: round.sgPutting, icon: Flag },
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
        {/* Background decoration */}
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
            {new Date(round.date).toLocaleDateString("nb-NO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          {/* 9-hole splits */}
          {frontNine.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-outline-variant/30">
              <div className="text-center">
                <p className="text-xs text-on-surface-variant">Ut</p>
                <p className={cn(
                  "text-lg font-bold",
                  frontNineScore < frontNinePar ? "text-green-500" : frontNineScore > frontNinePar ? "text-red-500" : "text-on-surface"
                )}>
                  {frontNineScore}
                </p>
                <p className="text-xs text-on-surface-variant/60">Par {frontNinePar}</p>
              </div>
              {backNine.length > 0 && (
                <>
                  <div className="w-px h-10 bg-surface-variant" />
                  <div className="text-center">
                    <p className="text-xs text-on-surface-variant">Inn</p>
                    <p className={cn(
                      "text-lg font-bold",
                      backNineScore < backNinePar ? "text-green-500" : backNineScore > backNinePar ? "text-red-500" : "text-on-surface"
                    )}>
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
          <p className="text-xs text-on-surface-variant">GIR ({girCount}/{holes.length})</p>
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
            { label: "Eagle+", count: eagles, color: "bg-green-500", emoji: "🦅" },
            { label: "Birdie", count: birdies, color: "bg-green-400", emoji: "🎯" },
            { label: "Par", count: pars, color: "bg-on-surface", emoji: "✓" },
            { label: "Bogey", count: bogeys, color: "bg-orange-400", emoji: "⚡" },
            { label: "Dobbel+", count: doubles, color: "bg-red-400", emoji: "⛔" },
          ].map((item) => {
            const maxCount = Math.max(eagles, birdies, pars, bogeys, doubles, 1);
            const height = Math.max(8, (item.count / maxCount) * 100);
            
            return (
              <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full flex justify-center">
                  <div
                    className={cn("w-full max-w-[50px] rounded-t-lg", item.color)}
                    style={{ height: `${height}%`, minHeight: item.count > 0 ? 8 : 4 }}
                  />
                  {item.count > 0 && (
                    <span className="absolute -top-5 text-xs font-bold text-on-surface">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-lg">{item.emoji}</span>
                <span className="text-[10px] text-on-surface-variant text-center">{item.label}</span>
              </div>
            );
          })}
        </div>
      </PremiumCard>

      {/* Best/Worst Holes */}
      {(bestHole || worstHole) && (
        <PremiumCard padding="lg">
          <h2 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="workspace_premium" className="w-4 h-4" />
            Høydepunkter
          </h2>
          
          <div className="space-y-3">
            {bestHole && bestHole.scoreToPar < 0 && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-surface font-bold">
                    {bestHole.holeNumber}
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Beste hull</p>
                    <p className="text-xs text-green-600">
                      {bestHole.scoreToPar === -1 ? "Birdie" : "Eagle"} på par {courseHoles.find(h => h.holeNumber === bestHole.holeNumber)?.par || "?"}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {bestHole.score > 0 ? "+" : ""}{bestHole.scoreToPar}
                </span>
              </div>
            )}
            
            {worstHole && worstHole.scoreToPar > 1 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-surface font-bold">
                    {worstHole.holeNumber}
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Tøffeste hull</p>
                    <p className="text-xs text-red-600">
                      +{worstHole.scoreToPar} på par {courseHoles.find(h => h.holeNumber === worstHole.holeNumber)?.par || "?"}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  +{worstHole.scoreToPar}
                </span>
              </div>
            )}
          </div>
        </PremiumCard>
      )}

      {/* Strokes Gained */}
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
          
          <div className="space-y-3">
            {sgSections.map((sg) => {
              if (sg.value === null) return null;
              const isPositive = sg.value > 0;
              const Icon = sg.icon;
              
              return (
                <div key={sg.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-sm text-on-surface-variant/80">{sg.label}</span>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      isPositive ? "text-green-600" : "text-red-500"
                    )}
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
          <h2 className="text-sm font-semibold text-on-surface mb-1">DECADE Score</h2>
          <div className="text-3xl font-bold text-on-surface mb-4 tabular-nums tracking-tight">
            {round.decadeScore}/100
          </div>
          <div className="h-3 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary-fixed"
              style={{ width: `${round.decadeScore}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Strategietterlevelse og beslutningskvalitet
          </p>
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

      {/* Share button */}
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
