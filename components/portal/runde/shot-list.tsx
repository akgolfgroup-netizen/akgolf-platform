"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shot {
  shotNumber: number;
  club: string;
  fromLie: string;
  fromDistance: number;
  toLie: string;
  toDistance: number;
  strokesGained: number;
}

interface ShotListProps {
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

export function ShotList({ shots }: ShotListProps) {
  if (shots.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-on-surface-variant">
        Slag i dette hullet
      </p>
      <div className="space-y-1.5">
        {shots.map((shot) => {
          const sg = shot.strokesGained ?? 0;
          const sgPositive = sg > 0.05;
          const sgNegative = sg < -0.05;
          return (
            <div
              key={shot.shotNumber}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">
                  {shot.shotNumber}
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {shot.club}
                  </p>
                  <p className="text-xs text-on-surface-variant/70">
                    {lieLabel(shot.fromLie)} → {lieLabel(shot.toLie)}{" "}
                    <span className="tabular-nums">
                      {Math.round(shot.fromDistance)}m →{" "}
                      {Math.round(shot.toDistance)}m
                    </span>
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold tabular-nums",
                  sgPositive
                    ? "bg-green-100 text-green-700"
                    : sgNegative
                      ? "bg-red-100 text-red-700"
                      : "bg-surface-container text-on-surface-variant"
                )}
              >
                {sgPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : sgNegative ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                {sg > 0 ? "+" : ""}
                {sg.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hull-total SG */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-on-surface-variant">
          SG totalt for hull
        </span>
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            shots.reduce((s, sh) => s + (sh.strokesGained ?? 0), 0) > 0
              ? "text-green-600"
              : "text-red-500"
          )}
        >
          {shots.reduce((s, sh) => s + (sh.strokesGained ?? 0), 0) > 0
            ? "+"
            : ""}
          {shots
            .reduce((s, sh) => s + (sh.strokesGained ?? 0), 0)
            .toFixed(2)}
        </span>
      </div>
    </div>
  );
}
