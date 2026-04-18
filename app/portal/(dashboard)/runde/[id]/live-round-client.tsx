"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Minus,
  Plus,
  Flag,
  Target,
  Circle,
  Timer,
  MapPin,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { saveHoleResult, completeRound } from "../actions";
import { HoleNavigator } from "@/components/portal/runde/hole-navigator";
import { CourseInfo } from "@/components/portal/runde/course-info";
import { PreShotRoutine } from "@/components/portal/runde/preshot-routine";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HoleData {
  id: string;
  holeNumber: number;
  par: number;
  handicap: number | null;
  lengthMeter: number;
  greenLat?: number | null;
  greenLon?: number | null;
}

interface HoleResult {
  holeNumber: number;
  score: number;
  putts: number;
  fairwayHit: boolean | null;
  gir: boolean;
  sandSave?: boolean | null;
  scramble?: boolean | null;
  notes?: string;
  strategyFollowed?: boolean | null;
}

interface Props {
  roundId: string;
  courseName: string;
  coursePar: number;
  holes: HoleData[];
  existingResults: HoleResult[];
  decadeStrategies?: unknown[];
  preShotRoutine?: unknown;
}

export function LiveRoundClient({
  roundId,
  courseName,
  coursePar,
  holes,
  existingResults,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentHole, setCurrentHole] = useState(0);
  const [showPreShot, setShowPreShot] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  const [results, setResults] = useState<Map<number, HoleResult>>(() => {
    const map = new Map<number, HoleResult>();
    for (const r of existingResults) {
      map.set(r.holeNumber, r);
    }
    return map;
  });

  const hole = holes[currentHole];
  if (!hole) return null;

  const result = results.get(hole.holeNumber) ?? {
    holeNumber: hole.holeNumber,
    score: hole.par,
    putts: 2,
    fairwayHit: null,
    gir: false,
    sandSave: null,
    scramble: null,
    notes: "",
    strategyFollowed: null,
  };

  const totalScore = Array.from(results.values()).reduce((s, r) => s + r.score, 0);
  const holesCompleted = results.size;
  const vsPar = totalScore - Array.from(results.values()).reduce((s, r) => {
    const h = holes.find(h => h.holeNumber === r.holeNumber);
    return s + (h?.par ?? 0);
  }, 0);

  function updateResult(updates: Partial<HoleResult>) {
    const updated = { ...result, ...updates };
    const newResults = new Map(results);
    newResults.set(hole.holeNumber, updated);
    setResults(newResults);
  }

  function saveAndNavigate(direction: "prev" | "next") {
    startTransition(async () => {
      await saveHoleResult(roundId, {
        holeId: hole.id,
        holeNumber: hole.holeNumber,
        par: hole.par,
        score: result.score,
        putts: result.putts,
        fairwayHit: result.fairwayHit,
        gir: result.gir,
        sandSave: result.sandSave,
        scramble: result.scramble,
        notes: result.notes,
        strategyFollowed: result.strategyFollowed,
      });

      if (direction === "next" && currentHole < holes.length - 1) {
        setCurrentHole(currentHole + 1);
      } else if (direction === "prev" && currentHole > 0) {
        setCurrentHole(currentHole - 1);
      }
    });
  }

  function handleComplete() {
    startTransition(async () => {
      await saveHoleResult(roundId, {
        holeId: hole.id,
        holeNumber: hole.holeNumber,
        par: hole.par,
        score: result.score,
        putts: result.putts,
        fairwayHit: result.fairwayHit,
        gir: result.gir,
        sandSave: result.sandSave,
        scramble: result.scramble,
        notes: result.notes,
        strategyFollowed: result.strategyFollowed,
      });

      await completeRound(roundId);
      router.push(`/portal/runde/${roundId}/oppsummering`);
    });
  }

  const scoreToPar = result.score - hole.par;
  const scoreLabel = scoreToPar <= -2 ? "Eagle" : 
                    scoreToPar === -1 ? "Birdie" :
                    scoreToPar === 0 ? "Par" :
                    scoreToPar === 1 ? "Bogey" :
                    scoreToPar === 2 ? "Dobbel" : `+${scoreToPar}`;

  const scoreColor = scoreToPar <= -1 ? "text-green-500" :
                    scoreToPar === 0 ? "text-black" :
                    scoreToPar === 1 ? "text-orange-500" : "text-red-500";

  const completedHoles = Array.from(results.keys());

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-20">
      {/* Header Card */}
      <PremiumCard padding="md" className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-black">{courseName}</h1>
          <p className="text-sm text-grey-400">
            {holesCompleted} av {holes.length} hull • 
            <span className={cn("font-medium ml-1", vsPar > 0 ? "text-red-500" : vsPar < 0 ? "text-green-500" : "text-black")}>
              {vsPar > 0 ? "+" : ""}{vsPar}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black tabular-nums">{totalScore || "–"}</p>
          <p className="text-xs text-grey-400">Totalt</p>
        </div>
      </PremiumCard>

      {/* Hole Navigator */}
      <HoleNavigator
        currentHole={currentHole}
        totalHoles={holes.length}
        completedHoles={completedHoles}
        onNavigate={(dir) => saveAndNavigate(dir)}
        onJumpToHole={(idx) => {
          // Save current before jumping
          startTransition(async () => {
            await saveHoleResult(roundId, {
              holeId: hole.id,
              holeNumber: hole.holeNumber,
              par: hole.par,
              score: result.score,
              putts: result.putts,
              fairwayHit: result.fairwayHit,
              gir: result.gir,
            });
            setCurrentHole(idx);
          });
        }}
      />

      {/* Course Info Card */}
      <CourseInfo
        holeNumber={hole.holeNumber}
        par={hole.par}
        lengthMeter={hole.lengthMeter}
        handicapIndex={hole.handicap}
      />

      {/* Main Scorecard */}
      <PremiumCard padding="lg" className="space-y-6">
        {/* Score header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-grey-400">Din score</p>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-5xl font-bold tabular-nums", scoreColor)}>
                {result.score}
              </span>
              <span className="text-sm font-medium text-grey-400">
                ({scoreLabel})
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-grey-400">Par {hole.par}</p>
            <p className="text-xs text-grey-300 mt-1">
              {result.score > hole.par + 2 && "⛔ Dobbel+"}
              {result.score === hole.par + 2 && "⚠️ Dobbel"}
              {result.score === hole.par + 1 && "⚡ Bogey"}
              {result.score === hole.par && "✓ Par"}
              {result.score === hole.par - 1 && "🎯 Birdie"}
              {result.score <= hole.par - 2 && "🦅 Eagle!"}
            </p>
          </div>
        </div>

        {/* Score controls */}
        <div className="flex items-center justify-center gap-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => updateResult({ score: Math.max(1, result.score - 1) })}
            className="w-14 h-14 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center transition-colors"
          >
            <Minus className="w-6 h-6 text-grey-600" />
          </motion.button>
          
          <div className="flex gap-1">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => updateResult({ score: num })}
                className={cn(
                  "w-8 h-10 rounded-lg text-sm font-medium transition-all",
                  result.score === num
                    ? "bg-accent-cta text-black"
                    : "bg-grey-100 text-grey-400 hover:bg-grey-200"
                )}
              >
                {num}
              </button>
            ))}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => updateResult({ score: result.score + 1 })}
            className="w-14 h-14 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center transition-colors"
          >
            <Plus className="w-6 h-6 text-grey-600" />
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-px bg-grey-200" />

        {/* Putts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-grey-700 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              Putts
            </p>
            <span className="text-lg font-bold text-black">{result.putts}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateResult({ putts: Math.max(0, result.putts - 1) })}
              className="w-12 h-12 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center"
            >
              <Minus className="w-5 h-5 text-grey-600" />
            </motion.button>
            
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => updateResult({ putts: num })}
                  className={cn(
                    "w-10 h-10 rounded-full text-sm font-medium transition-all",
                    result.putts === num
                      ? "bg-black text-white"
                      : "bg-grey-100 text-grey-400 hover:bg-grey-200"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateResult({ putts: result.putts + 1 })}
              className="w-12 h-12 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-grey-600" />
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-grey-200" />

        {/* Fairway & GIR */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fairway (not on par 3s) */}
          {hole.par !== 3 && (
            <div>
              <p className="text-sm font-medium text-grey-700 mb-2">Fairway</p>
              <div className="flex gap-2">
                <button
                  onClick={() => updateResult({ fairwayHit: true })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                    result.fairwayHit === true
                      ? "bg-green-100 text-green-700 border-2 border-green-500"
                      : "bg-grey-100 text-grey-600 hover:bg-grey-200"
                  )}
                >
                  ✅ Treff
                </button>
                <button
                  onClick={() => updateResult({ fairwayHit: false })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                    result.fairwayHit === false
                      ? "bg-red-100 text-red-700 border-2 border-red-500"
                      : "bg-grey-100 text-grey-600 hover:bg-grey-200"
                  )}
                >
                  ❌ Bom
                </button>
              </div>
            </div>
          )}

          {/* GIR */}
          <div className={hole.par === 3 ? "col-span-2" : ""}>
            <p className="text-sm font-medium text-grey-700 mb-2">Green in Regulation</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateResult({ gir: true })}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                  result.gir === true
                    ? "bg-green-100 text-green-700 border-2 border-green-500"
                    : "bg-grey-100 text-grey-600 hover:bg-grey-200"
                )}
              >
                ✅ Ja
              </button>
              <button
                onClick={() => updateResult({ gir: false })}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                  result.gir === false
                    ? "bg-red-100 text-red-700 border-2 border-red-500"
                    : "bg-grey-100 text-grey-600 hover:bg-grey-200"
                )}
              >
                ❌ Nei
              </button>
            </div>
          </div>
        </div>

        {/* Advanced stats toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full py-2 text-sm text-grey-400 hover:text-black transition-colors"
        >
          {showNotes ? "Skjul notater" : "+ Legg til notater"}
        </button>

        {/* Notes textarea */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <textarea
                value={result.notes || ""}
                onChange={(e) => updateResult({ notes: e.target.value })}
                placeholder="Notater om dette hullet..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-grey-200 focus:outline-none focus:ring-2 focus:ring-accent-cta resize-none text-sm"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pre-shot routine button */}
        <button
          onClick={() => setShowPreShot(true)}
          className="w-full py-3 rounded-xl border-2 border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
        >
          <Timer className="w-4 h-4" />
          Start pre-shot rutine
        </button>
      </PremiumCard>

      {/* Pre-shot routine modal */}
      <AnimatePresence>
        {showPreShot && (
          <PreShotRoutine
            onComplete={() => {
              setShowPreShot(false);
            }}
            onClose={() => setShowPreShot(false)}
          />
        )}
      </AnimatePresence>

      {/* Complete round button (only on last hole) */}
      {currentHole === holes.length - 1 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleComplete}
          disabled={isPending}
          className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto py-4 rounded-2xl bg-accent-cta text-black font-bold text-lg shadow-lg shadow-accent-cta/30 hover:shadow-xl hover:shadow-accent-cta/40 transition-shadow disabled:opacity-50"
        >
          {isPending ? "Lagrer..." : "Fullfør runde"}
        </motion.button>
      )}

      {/* Mini scorecard */}
      <PremiumCard padding="md" className="overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Front 9 */}
          <table className="w-full text-xs">
            <thead>
              <tr className="text-grey-400">
                <th className="text-left font-medium py-1 pr-2">Hull</th>
                {holes.slice(0, 9).map(h => (
                  <th key={h.holeNumber} className="text-center font-medium py-1 w-8">
                    {h.holeNumber}
                  </th>
                ))}
                <th className="text-center font-medium py-1 pl-2 border-l">Ut</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-grey-400">
                <td className="py-1 pr-2">Par</td>
                {holes.slice(0, 9).map(h => (
                  <td key={h.holeNumber} className="text-center py-1">{h.par}</td>
                ))}
                <td className="text-center py-1 pl-2 border-l font-medium">
                  {holes.slice(0, 9).reduce((s, h) => s + h.par, 0)}
                </td>
              </tr>
              <tr className="font-semibold text-black">
                <td className="py-1 pr-2">Score</td>
                {holes.slice(0, 9).map(h => {
                  const r = results.get(h.holeNumber);
                  return (
                    <td key={h.holeNumber} className={cn(
                      "text-center py-1",
                      r && r.score < h.par && "text-green-500",
                      r && r.score > h.par && "text-red-500"
                    )}>
                      {r ? r.score : "–"}
                    </td>
                  );
                })}
                <td className="text-center py-1 pl-2 border-l">
                  {holes.slice(0, 9).reduce((s, h) => s + (results.get(h.holeNumber)?.score ?? 0), 0) || "–"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Back 9 */}
          {holes.length > 9 && (
            <table className="w-full text-xs mt-2 pt-2 border-t border-grey-200">
              <thead>
                <tr className="text-grey-400">
                  <th className="text-left font-medium py-1 pr-2">Hull</th>
                  {holes.slice(9).map(h => (
                    <th key={h.holeNumber} className="text-center font-medium py-1 w-8">
                      {h.holeNumber}
                    </th>
                  ))}
                  <th className="text-center font-medium py-1 pl-2 border-l">Inn</th>
                  <th className="text-center font-bold py-1 pl-2 border-l">Tot</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-grey-400">
                  <td className="py-1 pr-2">Par</td>
                  {holes.slice(9).map(h => (
                    <td key={h.holeNumber} className="text-center py-1">{h.par}</td>
                  ))}
                  <td className="text-center py-1 pl-2 border-l font-medium">
                    {holes.slice(9).reduce((s, h) => s + h.par, 0)}
                  </td>
                  <td className="text-center py-1 pl-2 border-l font-bold">{coursePar}</td>
                </tr>
                <tr className="font-semibold text-black">
                  <td className="py-1 pr-2">Score</td>
                  {holes.slice(9).map(h => {
                    const r = results.get(h.holeNumber);
                    return (
                      <td key={h.holeNumber} className={cn(
                        "text-center py-1",
                        r && r.score < h.par && "text-green-500",
                        r && r.score > h.par && "text-red-500"
                      )}>
                        {r ? r.score : "–"}
                      </td>
                    );
                  })}
                  <td className="text-center py-1 pl-2 border-l">
                    {holes.slice(9).reduce((s, h) => s + (results.get(h.holeNumber)?.score ?? 0), 0) || "–"}
                  </td>
                  <td className="text-center py-1 pl-2 border-l font-bold">
                    {totalScore || "–"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </PremiumCard>
    </div>
  );
}
