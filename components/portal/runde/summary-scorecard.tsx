"use client";

import { cn } from "@/lib/utils";

interface HoleResult {
  holeNumber: number;
  par: number;
  score: number;
  putts: number;
  fairwayHit: boolean | null;
  gir: boolean;
  sgTotal: number | null;
}

interface HoleRow {
  holeNumber: number;
  par: number;
  lengthMeter: number;
}

interface TableProps {
  holesSlice: HoleRow[];
  results: HoleResult[];
}

function ScoreTable({ holesSlice, results }: TableProps) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-on-surface-variant">
          <th className="text-left font-medium py-1 pr-2">Hull</th>
          {holesSlice.map((h) => (
            <th key={h.holeNumber} className="text-center font-medium py-1 w-8">
              {h.holeNumber}
            </th>
          ))}
          <th className="text-center font-medium py-1 pl-2 border-l">Tot</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-on-surface-variant">
          <td className="py-1 pr-2 text-left">Par</td>
          {holesSlice.map((h) => (
            <td key={h.holeNumber} className="py-1 text-center w-8">{h.par}</td>
          ))}
          <td className="py-1 text-center pl-2 border-l">
            {holesSlice.reduce((s, h) => s + h.par, 0)}
          </td>
        </tr>
        <tr className="font-semibold text-on-surface">
          <td className="py-1 pr-2 text-left">Score</td>
          {holesSlice.map((h) => {
            const r = results.find((res) => res.holeNumber === h.holeNumber);
            return (
              <td
                key={h.holeNumber}
                className={cn(
                  "py-1 text-center w-8 tabular-nums",
                  r && r.score < h.par && "text-success",
                  r && r.score > h.par && "text-danger"
                )}
              >
                {r ? r.score : "–"}
              </td>
            );
          })}
          <td className="py-1 text-center pl-2 border-l">
            {holesSlice.reduce((s, h) => s + (results.find((r) => r.holeNumber === h.holeNumber)?.score ?? 0), 0) || "–"}
          </td>
        </tr>
        <tr className="text-on-surface-variant">
          <td className="py-1 pr-2 text-left">Putts</td>
          {holesSlice.map((h) => {
            const r = results.find((res) => res.holeNumber === h.holeNumber);
            return (
              <td key={h.holeNumber} className="py-1 text-center w-8">
                {r ? r.putts : "–"}
              </td>
            );
          })}
          <td className="py-1 text-center pl-2 border-l">
            {holesSlice.reduce((s, h) => s + (results.find((r) => r.holeNumber === h.holeNumber)?.putts ?? 0), 0) || "–"}
          </td>
        </tr>
        <tr className="text-on-surface-variant">
          <td className="py-1 pr-2 text-left">SG</td>
          {holesSlice.map((h) => {
            const r = results.find((res) => res.holeNumber === h.holeNumber);
            return (
              <td key={h.holeNumber} className="py-1 text-center w-8">
                {r && r.sgTotal !== null ? (
                  <span className={cn("tabular-nums", r.sgTotal > 0 ? "text-success" : "text-danger")}>
                    {r.sgTotal > 0 ? "+" : ""}{r.sgTotal.toFixed(1)}
                  </span>
                ) : (
                  "–"
                )}
              </td>
            );
          })}
          <td className="py-1 text-center pl-2 border-l">
            {(() => {
              const total = holesSlice.reduce((s, h) => s + (results.find((r) => r.holeNumber === h.holeNumber)?.sgTotal ?? 0), 0);
              return total !== 0 ? (
                <span className={cn("tabular-nums font-semibold", total > 0 ? "text-success" : "text-danger")}>
                  {total > 0 ? "+" : ""}{total.toFixed(1)}
                </span>
              ) : (
                "–"
              );
            })()}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

interface Props {
  holes: HoleRow[];
  results: HoleResult[];
}

export function SummaryScorecard({ holes, results }: Props) {
  const front = holes.filter((h) => h.holeNumber <= 9);
  const back = holes.filter((h) => h.holeNumber > 9);

  return (
    <div className="space-y-3">
      <ScoreTable holesSlice={front} results={results} />
      {back.length > 0 && (
        <div className="pt-2 border-t border-outline-variant/30">
          <ScoreTable holesSlice={back} results={results} />
        </div>
      )}
    </div>
  );
}
