"use client";

import { Target, Gauge, Zap, Crosshair } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface KpiTile {
  key: string;
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  hint?: string;
  icon: LucideIcon;
}

export interface KpiRowProps {
  carry: { value: number | null; deltaPct: number | null };
  ballSpeed: { value: number | null; deltaPct: number | null };
  smash: { value: number | null; deltaPct: number | null };
  dispersion: { value: number | null; deltaPct: number | null };
}

function fmt(v: number | null, decimals = 1): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return v.toFixed(decimals);
}

function deltaLabel(deltaPct: number | null): { text: string; tone: "positive" | "negative" | "neutral" } {
  if (deltaPct == null || !Number.isFinite(deltaPct)) {
    return { text: "—", tone: "neutral" };
  }
  const sign = deltaPct >= 0 ? "+" : "";
  return {
    text: `${sign}${deltaPct.toFixed(1)}%`,
    tone: deltaPct >= 0 ? "positive" : "negative",
  };
}

export function KpiRow({ carry, ballSpeed, smash, dispersion }: KpiRowProps) {
  const tiles: KpiTile[] = [
    {
      key: "carry",
      label: "CARRY",
      value: fmt(carry.value, 1),
      unit: "m",
      ...mapDelta(carry.deltaPct),
      icon: Target,
      hint: "snitt 90d",
    },
    {
      key: "ball",
      label: "BALL MPH",
      value: fmt(ballSpeed.value, 1),
      ...mapDelta(ballSpeed.deltaPct),
      icon: Gauge,
      hint: "snitt 90d",
    },
    {
      key: "smash",
      label: "SMASH",
      value: fmt(smash.value, 2),
      ...mapDelta(smash.deltaPct),
      icon: Zap,
      hint: "effektivitet",
    },
    {
      key: "dispersion",
      label: "DISPERSION",
      value: fmt(dispersion.value, 1),
      unit: "m",
      ...mapDelta(dispersion.deltaPct, /* invertColors */ true),
      icon: Crosshair,
      hint: "spredning",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {tiles.map((tile) => (
        <KpiCard key={tile.key} tile={tile} />
      ))}
    </div>
  );
}

function mapDelta(
  deltaPct: number | null,
  invertColors = false,
): { delta: string; deltaTone: "positive" | "negative" | "neutral" } {
  const { text, tone } = deltaLabel(deltaPct);
  // For dispersion: lavere er bedre, så snu fargene
  const finalTone = invertColors && tone !== "neutral"
    ? tone === "positive" ? "negative" : "positive"
    : tone;
  return { delta: text, deltaTone: finalTone };
}

function KpiCard({ tile }: { tile: KpiTile }) {
  const Icon = tile.icon;
  const toneClass =
    tile.deltaTone === "positive"
      ? "text-[#D1F843]"
      : tile.deltaTone === "negative"
        ? "text-[#E85D4E]"
        : "text-white/55";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#121614] px-4 py-4">
      <div className="flex items-start justify-between">
        <div className="font-mono text-[9px] text-white/55 tracking-[0.14em] uppercase">
          {tile.label}
        </div>
        <Icon className="w-4 h-4 text-white/40" />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <div
          className="font-mono text-[26px] font-bold text-white tracking-[-0.02em] tabular-nums leading-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {tile.value}
        </div>
        {tile.unit && (
          <span className="font-mono text-xs text-white/55 tabular-nums">{tile.unit}</span>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        {tile.delta && (
          <span className={`font-mono text-[11px] tabular-nums ${toneClass}`}>{tile.delta}</span>
        )}
        {tile.hint && (
          <span className="font-mono text-[9px] text-white/40 tracking-[0.1em] uppercase">
            {tile.hint}
          </span>
        )}
      </div>
    </div>
  );
}
