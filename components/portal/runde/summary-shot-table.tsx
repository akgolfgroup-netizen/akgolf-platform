"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Shot {
  shotNumber: number;
  holeNumber: number;
  club: string;
  fromLie: string;
  fromDistance: number;
  toLie: string;
  toDistance: number;
  strokesGained: number;
  sgCategory: string;
}

interface Props {
  shots: Shot[];
}

function lieLabel(lie: string): string {
  const map: Record<string, string> = {
    tee: "Tee",
    fairway: "Fairway",
    "semi-rough": "Semi-rough",
    rough: "Rough",
    "fairway-bunker": "FW-bunker",
    "greenside-bunker": "GS-bunker",
    green: "Green",
    recovery: "Recovery",
  };
  return map[lie] ?? lie;
}

function sgBadge(sg: number) {
  const positive = sg > 0.05;
  const negative = sg < -0.05;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold tabular-nums",
        positive ? "bg-green-100 text-green-700" : negative ? "bg-red-100 text-red-700" : "bg-surface-container text-on-surface-variant"
      )}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : negative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
      {sg > 0 ? "+" : ""}{sg.toFixed(2)}
    </span>
  );
}

export function SummaryShotTable({ shots }: Props) {
  if (shots.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-on-surface-variant border-b border-outline-variant/30">
            <th className="text-left font-medium py-2 pr-2">Hull</th>
            <th className="text-left font-medium py-2 pr-2">#</th>
            <th className="text-left font-medium py-2 pr-2">Kolle</th>
            <th className="text-left font-medium py-2 pr-2">Fra</th>
            <th className="text-right font-medium py-2 pr-2">Dist</th>
            <th className="text-left font-medium py-2 pr-2">Til</th>
            <th className="text-right font-medium py-2 pr-2">Dist</th>
            <th className="text-right font-medium py-2">SG</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {shots.map((s, i) => (
            <tr key={i} className="text-on-surface">
              <td className="py-2 pr-2 tabular-nums">{s.holeNumber}</td>
              <td className="py-2 pr-2 tabular-nums">{s.shotNumber}</td>
              <td className="py-2 pr-2 font-medium">{s.club}</td>
              <td className="py-2 pr-2">{lieLabel(s.fromLie)}</td>
              <td className="py-2 pr-2 text-right tabular-nums">{Math.round(s.fromDistance)}m</td>
              <td className="py-2 pr-2">{lieLabel(s.toLie)}</td>
              <td className="py-2 pr-2 text-right tabular-nums">{Math.round(s.toDistance)}m</td>
              <td className="py-2 text-right">{sgBadge(s.strokesGained)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
