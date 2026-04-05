"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Check,
  BarChart3,
  Minus,
  Plus,
} from "lucide-react";
import { saveHoleResult, completeRound } from "../actions";

interface HoleData {
  id: string;
  holeNumber: number;
  par: number;
  handicap: number | null;
  lengthMeter: number;
}

interface HoleResult {
  holeNumber: number;
  score: number;
  putts: number;
  fairwayHit: boolean | null;
  gir: boolean;
}

interface Props {
  roundId: string;
  courseName: string;
  coursePar: number;
  holes: HoleData[];
  existingResults: HoleResult[];
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
  };

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
        ? "text-[var(--color-error)]"
        : scoreToPar === 0
          ? "text-[var(--color-grey-900)]"
          : scoreToPar === 1
            ? "text-[var(--color-grey-600)]"
            : "text-[var(--color-grey-400)]";

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
          <h1 className="text-lg font-bold text-[var(--color-grey-900)]">{courseName}</h1>
          <div className="text-sm text-[var(--color-grey-500)]">
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
                    ? "bg-[var(--color-brand)] text-white"
                    : hasResult
                      ? "bg-[var(--color-grey-200)] text-[var(--color-grey-700)]"
                      : "bg-[var(--color-grey-100)] text-[var(--color-grey-400)]"
                }`}
              >
                {h.holeNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hull-info */}
      <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-[var(--color-grey-900)]">
              Hull {hole.holeNumber}
            </div>
            <div className="text-sm text-[var(--color-grey-500)] mt-0.5">
              Par {hole.par} — {hole.lengthMeter}m
              {hole.handicap && ` — HCP ${hole.handicap}`}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${scoreColor}`}>{result.score}</div>
            <div className="text-xs text-[var(--color-grey-500)]">{scoreLabel}</div>
          </div>
        </div>

        {/* Score */}
        <div>
          <label className="text-sm font-medium text-[var(--color-grey-600)] mb-2 block">
            Score
          </label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => updateResult({ score: Math.max(1, result.score - 1) })}
              className="h-12 w-12 rounded-full border border-[var(--color-grey-200)] flex items-center justify-center hover:bg-[var(--color-grey-100)] transition-colors"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-5xl font-bold text-[var(--color-grey-900)] w-20 text-center tabular-nums">
              {result.score}
            </span>
            <button
              onClick={() => updateResult({ score: result.score + 1 })}
              className="h-12 w-12 rounded-full border border-[var(--color-grey-200)] flex items-center justify-center hover:bg-[var(--color-grey-100)] transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Putts */}
        <div>
          <label className="text-sm font-medium text-[var(--color-grey-600)] mb-2 block">
            Putts
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => updateResult({ putts: Math.max(0, result.putts - 1) })}
              className="h-10 w-10 rounded-full border border-[var(--color-grey-200)] flex items-center justify-center hover:bg-[var(--color-grey-100)]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-3xl font-bold text-[var(--color-grey-900)] w-14 text-center tabular-nums">
              {result.putts}
            </span>
            <button
              onClick={() => updateResult({ putts: result.putts + 1 })}
              className="h-10 w-10 rounded-full border border-[var(--color-grey-200)] flex items-center justify-center hover:bg-[var(--color-grey-100)]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Fairway + GIR */}
        <div className="grid grid-cols-2 gap-3">
          {hole.par !== 3 && (
            <div>
              <label className="text-sm font-medium text-[var(--color-grey-600)] mb-2 block">
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
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      result.fairwayHit === opt.value
                        ? opt.value
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success-text)] border border-[var(--color-success)]"
                          : "bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]"
                        : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)] border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={hole.par === 3 ? "col-span-2" : ""}>
            <label className="text-sm font-medium text-[var(--color-grey-600)] mb-2 block">
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
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    result.gir === opt.value
                      ? opt.value
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success-text)] border border-[var(--color-success)]"
                        : "bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]"
                      : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)] border border-transparent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={() => setCurrentHole(Math.max(0, currentHole - 1))}
          disabled={currentHole === 0}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-600)] hover:bg-[var(--color-grey-100)] disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Forrige
        </button>

        {currentHole < holes.length - 1 ? (
          <button
            onClick={saveAndNext}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-brand)] text-white font-semibold hover:bg-[var(--color-brand)]/90 disabled:opacity-50 transition-colors"
          >
            <Check className="h-4 w-4" />
            {isPending ? "Lagrer..." : "Lagre & neste"}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-brand)] text-white font-semibold hover:bg-[var(--color-brand)]/90 disabled:opacity-50 transition-colors"
          >
            <Flag className="h-4 w-4" />
            {isPending ? "Fullforter..." : "Fullfor runde"}
          </button>
        )}
      </div>

      {/* Mini-scorecard */}
      <div className="mt-6 bg-white rounded-2xl border border-[var(--color-grey-200)] p-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--color-grey-500)]">
              <th className="text-left font-medium pb-2">Hull</th>
              {holes.slice(0, 9).map((h) => (
                <th key={h.holeNumber} className="text-center font-medium pb-2 w-8">
                  {h.holeNumber}
                </th>
              ))}
              <th className="text-center font-medium pb-2 border-l border-[var(--color-grey-200)] pl-2">
                Ut
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-[var(--color-grey-400)]">
              <td className="py-1">Par</td>
              {holes.slice(0, 9).map((h) => (
                <td key={h.holeNumber} className="text-center py-1">
                  {h.par}
                </td>
              ))}
              <td className="text-center py-1 border-l border-[var(--color-grey-200)] pl-2 font-medium">
                {holes.slice(0, 9).reduce((s, h) => s + h.par, 0)}
              </td>
            </tr>
            <tr className="font-semibold text-[var(--color-grey-900)]">
              <td className="py-1">Score</td>
              {holes.slice(0, 9).map((h) => {
                const r = results.get(h.holeNumber);
                return (
                  <td key={h.holeNumber} className="text-center py-1">
                    {r ? r.score : "-"}
                  </td>
                );
              })}
              <td className="text-center py-1 border-l border-[var(--color-grey-200)] pl-2">
                {holes
                  .slice(0, 9)
                  .reduce((s, h) => s + (results.get(h.holeNumber)?.score ?? 0), 0) || "-"}
              </td>
            </tr>
          </tbody>
        </table>

        {holes.length > 9 && (
          <table className="w-full text-xs mt-3 border-t border-[var(--color-grey-100)] pt-3">
            <thead>
              <tr className="text-[var(--color-grey-500)]">
                <th className="text-left font-medium pb-2">Hull</th>
                {holes.slice(9).map((h) => (
                  <th key={h.holeNumber} className="text-center font-medium pb-2 w-8">
                    {h.holeNumber}
                  </th>
                ))}
                <th className="text-center font-medium pb-2 border-l border-[var(--color-grey-200)] pl-2">
                  Inn
                </th>
                <th className="text-center font-bold pb-2 border-l border-[var(--color-grey-200)] pl-2">
                  Tot
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[var(--color-grey-400)]">
                <td className="py-1">Par</td>
                {holes.slice(9).map((h) => (
                  <td key={h.holeNumber} className="text-center py-1">
                    {h.par}
                  </td>
                ))}
                <td className="text-center py-1 border-l border-[var(--color-grey-200)] pl-2 font-medium">
                  {holes.slice(9).reduce((s, h) => s + h.par, 0)}
                </td>
                <td className="text-center py-1 border-l border-[var(--color-grey-200)] pl-2 font-bold">
                  {coursePar}
                </td>
              </tr>
              <tr className="font-semibold text-[var(--color-grey-900)]">
                <td className="py-1">Score</td>
                {holes.slice(9).map((h) => {
                  const r = results.get(h.holeNumber);
                  return (
                    <td key={h.holeNumber} className="text-center py-1">
                      {r ? r.score : "-"}
                    </td>
                  );
                })}
                <td className="text-center py-1 border-l border-[var(--color-grey-200)] pl-2">
                  {holes
                    .slice(9)
                    .reduce((s, h) => s + (results.get(h.holeNumber)?.score ?? 0), 0) || "-"}
                </td>
                <td className="text-center py-1 border-l border-[var(--color-grey-200)] pl-2 font-bold">
                  {totalScore || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
