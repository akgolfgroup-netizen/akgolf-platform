"use client";

/**
 * PyramidDistributionEditor — 5 slidere for AK-pyramidens nivåer
 * (FYS/TEK/SLAG/SPILL/TURN). Tvinger sum = 100% ved proporsjonal
 * justering av de øvrige nivåene når én slider flyttes.
 *
 * Autoritativ kilde: AK Masterdokument v2.0 seksjon 3 (Pyramide).
 */

import { PYRAMIDE, type PyramideCode } from "@/lib/portal/training/ak-taxonomy";
import { cn } from "@/lib/utils";

export type PyramidDistribution = Record<PyramideCode, number>;

const PYRAMID_CODES: readonly PyramideCode[] = PYRAMIDE.map((p) => p.code);

export const DEFAULT_DISTRIBUTION: PyramidDistribution = {
  FYS: 20,
  TEK: 25,
  SLAG: 25,
  SPILL: 20,
  TURN: 10,
};

export interface PyramidPreset {
  id: string;
  label: string;
  description: string;
  distribution: PyramidDistribution;
}

/**
 * AK-defaults per periode (jf. ak-formula.ts PERIOD_TYPES.primaryPyramid).
 */
export const PYRAMID_PRESETS: readonly PyramidPreset[] = [
  {
    id: "grunnperiode",
    label: "Grunnperiode",
    description: "Bygg fundament — vekt på FYS og TEK",
    distribution: { FYS: 30, TEK: 35, SLAG: 20, SPILL: 10, TURN: 5 },
  },
  {
    id: "spesialiseringsperiode",
    label: "Spesialiseringsperiode",
    description: "Overfør teknikk til slag — vekt på TEK og SLAG",
    distribution: { FYS: 20, TEK: 25, SLAG: 30, SPILL: 20, TURN: 5 },
  },
  {
    id: "turneringsperiode",
    label: "Turneringsperiode",
    description: "Konkurranseforberedelse — vekt på SPILL og TURN",
    distribution: { FYS: 10, TEK: 10, SLAG: 20, SPILL: 30, TURN: 30 },
  },
] as const;

interface PyramidDistributionEditorProps {
  value: PyramidDistribution;
  onChange: (next: PyramidDistribution) => void;
  /** Vis preset-knapper. Default true. */
  showPresets?: boolean;
  /** Fast på 100 % – kun visning, ingen edit. Default false. */
  readOnly?: boolean;
}

export function PyramidDistributionEditor({
  value,
  onChange,
  showPresets = true,
  readOnly = false,
}: PyramidDistributionEditorProps) {
  const total = sumDistribution(value);

  const handleSliderChange = (code: PyramideCode, raw: number) => {
    if (readOnly) return;
    const next = adjustDistribution(value, code, raw);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
          AK-pyramide — fordeling per uke
        </p>
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            total === 100 ? "text-primary" : "text-error"
          )}
          aria-live="polite"
        >
          {total}%
        </span>
      </div>

      <div className="space-y-3">
        {PYRAMIDE.map((level) => (
          <PyramidSlider
            key={level.code}
            code={level.code}
            label={level.label}
            description={level.description}
            color={level.color}
            value={value[level.code]}
            onChange={(v) => handleSliderChange(level.code, v)}
            readOnly={readOnly}
          />
        ))}
      </div>

      {showPresets && !readOnly && (
        <div className="border-t border-outline-variant pt-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            Hurtigvalg
          </p>
          <div className="flex flex-wrap gap-2">
            {PYRAMID_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange({ ...preset.distribution })}
                className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-surface hover:border-primary hover:text-primary"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...DEFAULT_DISTRIBUTION })}
              className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-surface-variant hover:border-on-surface-variant"
              title="Allround-fordeling"
            >
              Tilbakestill
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface PyramidSliderProps {
  code: PyramideCode;
  label: string;
  description: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
  readOnly?: boolean;
}

function PyramidSlider({
  code,
  label,
  description,
  color,
  value,
  onChange,
  readOnly = false,
}: PyramidSliderProps) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface">
            {code}
          </span>
          <span className="text-xs text-on-surface-variant">— {label}</span>
        </div>
        <span className="font-mono text-xs tabular-nums text-on-surface">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={readOnly}
        aria-label={`${label} prosent (${description})`}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-container accent-primary disabled:cursor-default"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, var(--color-surface-container) ${value}%, var(--color-surface-container) 100%)`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

export function sumDistribution(d: PyramidDistribution): number {
  return PYRAMID_CODES.reduce((acc, c) => acc + (d[c] ?? 0), 0);
}

export function isValidDistribution(d: PyramidDistribution): boolean {
  return sumDistribution(d) === 100 &&
    PYRAMID_CODES.every((c) => d[c] >= 0 && d[c] <= 100);
}

/**
 * Justerer fordelingen slik at sum forblir 100 % når én slider endres.
 * De andre nivåene skaleres proporsjonalt (avrundet til 5 %-trinn).
 */
export function adjustDistribution(
  current: PyramidDistribution,
  changed: PyramideCode,
  newValue: number
): PyramidDistribution {
  const clamped = Math.max(0, Math.min(100, Math.round(newValue / 5) * 5));
  const others = PYRAMID_CODES.filter((c) => c !== changed);
  const remaining = 100 - clamped;
  const currentOthersSum = others.reduce((acc, c) => acc + current[c], 0);

  const next: PyramidDistribution = { ...current, [changed]: clamped };

  if (currentOthersSum === 0) {
    // Fordel jevnt blant de andre
    const each = Math.floor(remaining / others.length / 5) * 5;
    let leftover = remaining - each * others.length;
    for (const c of others) {
      next[c] = each;
      if (leftover >= 5) {
        next[c] += 5;
        leftover -= 5;
      }
    }
    return next;
  }

  // Skaler proporsjonalt
  let allocated = 0;
  for (let i = 0; i < others.length; i++) {
    const c = others[i];
    if (i === others.length - 1) {
      next[c] = Math.max(0, remaining - allocated);
    } else {
      const share = Math.round((current[c] / currentOthersSum) * remaining / 5) * 5;
      next[c] = Math.max(0, share);
      allocated += next[c];
    }
  }

  // Sikre at summen er nøyaktig 100
  const finalSum = sumDistribution(next);
  if (finalSum !== 100) {
    const diff = 100 - finalSum;
    const target = others.find((c) => next[c] + diff >= 0 && next[c] + diff <= 100);
    if (target) next[target] += diff;
  }

  return next;
}
