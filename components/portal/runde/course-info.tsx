"use client";

import { Flag, Ruler, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";

interface HoleHistory {
  best: number;
  worst: number;
  average: number;
  timesPlayed: number;
}

interface CourseInfoProps {
  holeNumber: number;
  par: number;
  lengthMeter: number;
  handicapIndex: number | null;
  history?: HoleHistory;
  className?: string;
}

export function CourseInfo({
  holeNumber,
  par,
  lengthMeter,
  handicapIndex,
  history,
  className,
}: CourseInfoProps) {
  const getDifficultyLabel = (hcp: number | null) => {
    if (hcp === null) return null;
    if (hcp <= 3) return { text: "Vanskelig", color: "text-red-500", bg: "bg-red-50" };
    if (hcp <= 9) return { text: "Middels", color: "text-orange-500", bg: "bg-orange-50" };
    return { text: "Enkel", color: "text-green-500", bg: "bg-green-50" };
  };

  const difficulty = getDifficultyLabel(handicapIndex);

  return (
    <PremiumCard padding="lg" className={className}>
      {/* Header with hole number */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent-cta flex items-center justify-center shadow-lg shadow-accent-cta/30">
            <span className="text-3xl font-bold text-black">{holeNumber}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Hull {holeNumber}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-grey-400">Par {par}</span>
              {handicapIndex && (
                <>
                  <span className="text-grey-300">•</span>
                  <span className="text-sm text-grey-400">HCP {handicapIndex}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {difficulty && (
          <div className={cn("px-3 py-1.5 rounded-full text-xs font-medium", difficulty.bg, difficulty.color)}>
            {difficulty.text}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Length */}
        <div className="text-center p-3 bg-grey-50 rounded-xl">
          <Ruler className="w-5 h-5 text-grey-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-black">{lengthMeter}</p>
          <p className="text-xs text-grey-400">meter</p>
        </div>

        {/* Par indicator */}
        <div className="text-center p-3 bg-grey-50 rounded-xl">
          <Flag className="w-5 h-5 text-grey-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-black">{par}</p>
          <p className="text-xs text-grey-400">par</p>
        </div>

        {/* Handicap */}
        <div className="text-center p-3 bg-grey-50 rounded-xl">
          <TrendingUp className="w-5 h-5 text-grey-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-black">{handicapIndex || "–"}</p>
          <p className="text-xs text-grey-400">handicap</p>
        </div>
      </div>

      {/* Personal history */}
      {history && history.timesPlayed > 0 && (
        <div className="mt-6 pt-6 border-t border-grey-200">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-grey-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-400">
              Din historikk på dette hullet
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-grey-400 mb-1">Beste</p>
              <p className={cn(
                "text-xl font-bold",
                history.best <= par - 1 ? "text-red-500" : "text-black"
              )}>
                {history.best}
              </p>
              {history.best <= par - 1 && (
                <p className="text-[10px] text-red-500 font-medium">
                  {par - history.best === 1 ? "Birdie" : "Eagle"}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-grey-400 mb-1">Snitt</p>
              <p className={cn(
                "text-xl font-bold",
                history.average > par ? "text-orange-500" : "text-black"
              )}>
                {history.average.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-grey-400 mb-1">Verste</p>
              <p className="text-xl font-bold text-black">{history.worst}</p>
            </div>
          </div>

          <p className="text-xs text-grey-400 text-center mt-3">
            Spilt {history.timesPlayed} {history.timesPlayed === 1 ? "gang" : "ganger"}
          </p>
        </div>
      )}

      {!history && (
        <div className="mt-6 pt-6 border-t border-grey-200">
          <div className="flex items-center gap-2 text-grey-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs">Ingen historikk for dette hullet ennå</p>
          </div>
        </div>
      )}
    </PremiumCard>
  );
}
