"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Check,
  Minus,
  Plus,
  Timer,
} from "lucide-react";
import { saveHoleResult, completeRound } from "../actions";
import { DecadePanel } from "@/components/portal/runde/decade-panel";
import { PreShotGuide } from "@/components/portal/runde/pre-shot-guide";
import { GPSDistance } from "@/components/portal/runde/gps-distance";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import type { DecadeHoleStrategy } from "@/lib/portal/golf/decade-caddy";
import type { PreShotRoutine } from "@/lib/portal/golf/decade-caddy";

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
  strategyFollowed?: boolean | null;
}

interface Props {
  roundId: string;
  courseName: string;
  coursePar: number;
  holes: HoleData[];
  existingResults: HoleResult[];
  decadeStrategies?: DecadeHoleStrategy[];
  preShotRoutine?: PreShotRoutine;
}

export function LiveRoundClient({
  roundId,
  courseName,
  coursePar,
  holes,
  existingResults,
  decadeStrategies,
  preShotRoutine,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentHole, setCurrentHole] = useState(0);
  const [showPreShot, setShowPreShot] = useState(false);
  const [preRoutineCompleted, setPreRoutineCompleted] = useState<Set<number>>(new Set());
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
    fairwayHit: hole.par === 3 ? null : null,
    gir: false,
    strategyFollowed: null,
  };

  const currentStrategy =
    decadeStrategies?.find((s) => s.holeNumber === hole.holeNumber) ?? null;

  const totalScore = Array.from(results.values()).reduce((s, r) => s + r.score, 0);
  const totalPar = Array.from(results.values()).reduce((s, r) => {
    const h = holes.find((h) => h.holeNumber === r.holeNumber);
    return s + (h?.par ?? 0);
  }, 0);
  const vsParTotal = totalScore - totalPar;

  function updateResult(updates: Partial<HoleResult>) {
    const updated = { ...result, ...updates };
    const newResults = new Map(results);
    newResults.set(hole.holeNumber, updated);
    setResults(newResults);
  }

  function saveAndNext() {
    startTransition(async () => {
      await saveHoleResult(roundId, {
        holeId: hole.id,
        holeNumber: hole.holeNumber,
        par: hole.par,
        score: result.score,
        putts: result.putts,
        fairwayHit: result.fairwayHit,
        gir: result.gir,
        strategyFollowed: result.strategyFollowed,
      });

      if (currentHole < holes.length - 1) {
        setCurrentHole(currentHole + 1);
      }
    });
  }

  function handleComplete() {
    startTransition(async () => {
      // Lagre siste hull forst
      await saveHoleResult(roundId, {
        holeId: hole.id,
        holeNumber: hole.holeNumber,
        par: hole.par,
        score: result.score,
        putts: result.putts,
        fairwayHit: result.fairwayHit,
        gir: result.gir,
        strategyFollowed: result.strategyFollowed,
      });

      await completeRound(roundId);
      router.push(`/portal/runde/${roundId}/oppsummering`);
    });
  }

  const scoreToPar = result.score - hole.par;
  const scoreColor =
    scoreToPar <= -2
      ? "text-yellow-500"
      : scoreToPar === -1
        ? "text-error"
        : scoreToPar === 0
          ? "text-black"
          : scoreToPar === 1
            ? "text-grey-400"
            : "text-grey-400";

  const scoreLabel =
    scoreToPar <= -2
      ? "Eagle"
      : scoreToPar === -1
        ? "Birdie"
        : scoreToPar === 0
          ? "Par"
          : scoreToPar === 1
            ? "Bogey"
            : scoreToPar === 2
              ? "Dobbel"
              : `+${scoreToPar}`;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-black">{courseName}</h1>
          <div className="text-sm text-grey-400">
            {results.size} av {holes.length} hull
            {results.size > 0 && (
              <span className="ml-2 font-medium">
                {vsParTotal > 0 ? "+" : ""}
                {vsParTotal} ({totalScore})
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {holes.map((h, i) => {
            const hasResult = results.has(h.holeNumber);
            return (
              <button
                key={h.holeNumber}
                onClick={() => setCurrentHole(i)}
                className={`w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                  i === currentHole
                    ? "bg-black text-white"
                    : hasResult
                      ? "bg-grey-50 text-black"
                      : "bg-grey-50 text-grey-400"
                }`}
              >
                {h.holeNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* DECADE Strategi-panel */}
      <DecadePanel strategy={currentStrategy} />

      {/* Hull-info */}
      <PremiumCard className="p-6 space-y-6" noHover>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-black">
              Hull {hole.holeNumber}
            </div>
            <div className="text-sm text-grey-400 mt-0.5">
              Par {hole.par} — {hole.lengthMeter}m
              {hole.handicap && ` — HCP ${hole.handicap}`}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold tabular-nums tracking-tight ${scoreColor}`}>{result.score}</div>
            <div className="text-xs text-grey-400">{scoreLabel}</div>
          </div>
        </div>

        {/* GPS-avstand */}
        <GPSDistance
          greenLat={hole.greenLat ?? null}
          greenLon={hole.greenLon ?? null}
        />

        {/* Score */}
        <div>
          <label className="text-sm font-medium text-grey-400 mb-2 block">
            Score
          </label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => updateResult({ score: Math.max(1, result.score - 1) })}
              className="h-12 w-12 rounded-full border border-grey-200 flex items-center justify-center hover:bg-grey-50 transition-colors"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-5xl font-bold text-black w-20 text-center tabular-nums tracking-tight">
              {result.score}
            </span>
            <button
              onClick={() => updateResult({ score: result.score + 1 })}
              className="h-12 w-12 rounded-full border border-grey-200 flex items-center justify-center hover:bg-grey-50 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Putts */}
        <div>
          <label className="text-sm font-medium text-grey-400 mb-2 block">
            Putts
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => updateResult({ putts: Math.max(0, result.putts - 1) })}
              className="h-12 w-12 rounded-full border border-grey-200 flex items-center justify-center hover:bg-grey-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-3xl font-bold text-black w-14 text-center tabular-nums tracking-tight">
              {result.putts}
            </span>
            <button
              onClick={() => updateResult({ putts: result.putts + 1 })}
              className="h-12 w-12 rounded-full border border-grey-200 flex items-center justify-center hover:bg-grey-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Fairway + GIR */}
        <div className="grid grid-cols-2 gap-3">
          {hole.par !== 3 && (
            <div>
              <label className="text-sm font-medium text-grey-400 mb-2 block">
                Fairway
              </label>
              <div className="flex gap-2">
                {[
                  { value: true, label: "Treff" },
                  { value: false, label: "Bom" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => updateResult({ fairwayHit: opt.value })}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                      result.fairwayHit === opt.value
                        ? opt.value
                          ? "bg-success-light text-success border border-success"
                          : "bg-error-light text-error border border-error"
                        : "bg-grey-50 text-grey-400 border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={hole.par === 3 ? "col-span-2" : ""}>
            <label className="text-sm font-medium text-grey-400 mb-2 block">
              GIR
            </label>
            <div className="flex gap-2">
              {[
                { value: true, label: "Ja" },
                { value: false, label: "Nei" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => updateResult({ gir: opt.value })}
                  className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                    result.gir === opt.value
                      ? opt.value
                        ? "bg-success-light text-success border border-success"
                        : "bg-error-light text-error border border-error"
                      : "bg-grey-50 text-grey-400 border border-transparent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fulgte strategi? + Pre-shot rutine */}
        {currentStrategy && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-grey-400 mb-2 block">
                Fulgte strategi?
              </label>
              <div className="flex gap-2">
                {[
                  { value: true, label: "Ja" },
                  { value: false, label: "Nei" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() =>
                      updateResult({ strategyFollowed: opt.value })
                    }
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                      result.strategyFollowed === opt.value
                        ? opt.value
                          ? "bg-success-light text-success border border-success"
                          : "bg-error-light text-error border border-error"
                        : "bg-grey-50 text-grey-400 border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {preShotRoutine && (
              <button
                onClick={() => setShowPreShot(true)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all ${
                  preRoutineCompleted.has(hole.holeNumber)
                    ? "bg-success-light text-success border border-success"
                    : "border border-purple-500/20 text-purple-500"
                }`}
                style={
                  !preRoutineCompleted.has(hole.holeNumber)
                    ? { backgroundColor: "#FAF5FF" }
                    : undefined
                }
              >
                <Timer className="h-4 w-4" />
                {preRoutineCompleted.has(hole.holeNumber)
                  ? "Pre-shot rutine fullfort"
                  : "Start pre-shot rutine"}
              </button>
            )}
          </div>
        )}
      </PremiumCard>

      {/* Pre-shot rutine overlay */}
      {showPreShot && preShotRoutine && (
        <PreShotGuide
          routine={preShotRoutine}
          onComplete={() => {
            setPreRoutineCompleted(
              (prev) => new Set([...prev, hole.holeNumber])
            );
            setShowPreShot(false);
          }}
          onClose={() => setShowPreShot(false)}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={() => setCurrentHole(Math.max(0, currentHole - 1))}
          disabled={currentHole === 0}
          className="flex items-center gap-2 px-4 py-3 rounded-full border border-grey-200 bg-white text-grey-400 hover:border-grey-300 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Forrige
        </button>

        {currentHole < holes.length - 1 ? (
          <button
            onClick={saveAndNext}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-accent-cta text-black font-semibold hover:opacity-85 active:scale-[0.98] disabled:opacity-50 transition-all duration-300"
          >
            <Check className="h-4 w-4" />
            {isPending ? "Lagrer..." : "Lagre & neste"}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-accent-cta text-black font-semibold hover:opacity-85 active:scale-[0.98] disabled:opacity-50 transition-all duration-300"
          >
            <Flag className="h-4 w-4" />
            {isPending ? "Fullforter..." : "Fullfor runde"}
          </button>
        )}
      </div>

      {/* Mini-scorecard */}
      <PremiumCard className="mt-6 p-4 overflow-x-auto" noHover>
        <table className="w-full text-xs tabular-nums">
          <thead>
            <tr className="text-grey-400">
              <th className="text-left font-medium pb-2">Hull</th>
              {holes.slice(0, 9).map((h) => (
                <th key={h.holeNumber} className="text-center font-medium pb-2 w-8">
                  {h.holeNumber}
                </th>
              ))}
              <th className="text-center font-medium pb-2 border-l border-grey-200 pl-2">
                Ut
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-grey-400">
              <td className="py-1">Par</td>
              {holes.slice(0, 9).map((h) => (
                <td key={h.holeNumber} className="text-center py-1">
                  {h.par}
                </td>
              ))}
              <td className="text-center py-1 border-l border-grey-200 pl-2 font-medium">
                {holes.slice(0, 9).reduce((s, h) => s + h.par, 0)}
              </td>
            </tr>
            <tr className="font-semibold text-black">
              <td className="py-1">Score</td>
              {holes.slice(0, 9).map((h) => {
                const r = results.get(h.holeNumber);
                return (
                  <td key={h.holeNumber} className="text-center py-1">
                    {r ? r.score : "-"}
                  </td>
                );
              })}
              <td className="text-center py-1 border-l border-grey-200 pl-2">
                {holes
                  .slice(0, 9)
                  .reduce((s, h) => s + (results.get(h.holeNumber)?.score ?? 0), 0) || "-"}
              </td>
            </tr>
          </tbody>
        </table>

        {holes.length > 9 && (
          <table className="w-full text-xs tabular-nums mt-3 border-t border-grey-200 pt-3">
            <thead>
              <tr className="text-grey-400">
                <th className="text-left font-medium pb-2">Hull</th>
                {holes.slice(9).map((h) => (
                  <th key={h.holeNumber} className="text-center font-medium pb-2 w-8">
                    {h.holeNumber}
                  </th>
                ))}
                <th className="text-center font-medium pb-2 border-l border-grey-200 pl-2">
                  Inn
                </th>
                <th className="text-center font-bold pb-2 border-l border-grey-200 pl-2">
                  Tot
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-grey-400">
                <td className="py-1">Par</td>
                {holes.slice(9).map((h) => (
                  <td key={h.holeNumber} className="text-center py-1">
                    {h.par}
                  </td>
                ))}
                <td className="text-center py-1 border-l border-grey-200 pl-2 font-medium">
                  {holes.slice(9).reduce((s, h) => s + h.par, 0)}
                </td>
                <td className="text-center py-1 border-l border-grey-200 pl-2 font-bold">
                  {coursePar}
                </td>
              </tr>
              <tr className="font-semibold text-black">
                <td className="py-1">Score</td>
                {holes.slice(9).map((h) => {
                  const r = results.get(h.holeNumber);
                  return (
                    <td key={h.holeNumber} className="text-center py-1">
                      {r ? r.score : "-"}
                    </td>
                  );
                })}
                <td className="text-center py-1 border-l border-grey-200 pl-2">
                  {holes
                    .slice(9)
                    .reduce((s, h) => s + (results.get(h.holeNumber)?.score ?? 0), 0) || "-"}
                </td>
                <td className="text-center py-1 border-l border-grey-200 pl-2 font-bold">
                  {totalScore || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </PremiumCard>
    </div>
  );
}
