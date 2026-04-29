"use client";

import { useMemo } from "react";
import type { TrainingAnalysisResult } from "@/lib/portal/training/analysis-actions";
import {
  labelForPyramide,
  labelForOmraade,
  labelForLFase,
} from "@/lib/portal/training/ak-taxonomy";
import { Clock, Dumbbell, CalendarDays } from "lucide-react";

// ─── Hjelpefunksjoner ───────────────────────────────────────────────

function fmtHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} t`;
  return `${h},${Math.round(m / 6)} t`;
}

function sortEntries(
  map: Record<string, { sessions: number; minutes: number }>
): [string, { sessions: number; minutes: number }][] {
  return Object.entries(map).sort((a, b) => b[1].minutes - a[1].minutes);
}

function labelForKey(key: string, type: "pyramid" | "area" | "lPhase" | "cs" | "env" | "press"): string {
  switch (type) {
    case "pyramid":
      return labelForPyramide(key);
    case "area":
      return labelForOmraade(key);
    case "lPhase":
      return labelForLFase(key);
    case "cs":
      return key;
    case "env":
      return key;
    case "press":
      return key;
    default:
      return key;
  }
}

// ─── Kort-komponent ─────────────────────────────────────────────────

interface AggCardProps {
  title: string;
  entries: [string, { sessions: number; minutes: number }][];
  type: "pyramid" | "area" | "lPhase" | "cs" | "env" | "press";
  maxItems?: number;
  colorClass?: string;
}

function AggCard({ title, entries, type, maxItems = 6, colorClass = "bg-primary" }: AggCardProps) {
  const totalMinutes = entries.reduce((s, [, v]) => s + v.minutes, 0);

  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-card">
      <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-ink-subtle">Ingen data</p>
      ) : (
        <div className="space-y-2">
          {entries.slice(0, maxItems).map(([key, val]) => {
            const pct = totalMinutes > 0 ? (val.minutes / totalMinutes) * 100 : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink truncate pr-2">
                    {labelForKey(key, type)}
                  </span>
                  <span className="text-ink-subtle shrink-0">
                    {val.sessions} økter · {fmtHours(val.minutes)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClass}`}
                    style={{ width: `${pct}%`, opacity: 0.85 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sammenligningskort ─────────────────────────────────────────────

interface CompareCardProps {
  title: string;
  a: TrainingAnalysisResult;
  b: TrainingAnalysisResult;
}

function CompareCard({ title, a, b }: CompareCardProps) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-card">
      <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-ink-subtle uppercase tracking-wide">Filter A</p>
          <p className="text-2xl font-bold text-ink font-[family-name:var(--font-jetbrains-mono)]">
            {a.totalSessions}
          </p>
          <p className="text-sm text-ink-muted">økter</p>
          <p className="text-lg font-semibold text-ink">{fmtHours(a.totalMinutes)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-ink-subtle uppercase tracking-wide">Filter B</p>
          <p className="text-2xl font-bold text-ink font-[family-name:var(--font-jetbrains-mono)]">
            {b.totalSessions}
          </p>
          <p className="text-sm text-ink-muted">økter</p>
          <p className="text-lg font-semibold text-ink">{fmtHours(b.totalMinutes)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Hovedkomponent ─────────────────────────────────────────────────

interface AnalysisResultsProps {
  result: TrainingAnalysisResult;
  compareResult?: { filterA: TrainingAnalysisResult; filterB: TrainingAnalysisResult } | null;
}

export function AnalysisResults({ result, compareResult }: AnalysisResultsProps) {
  const hasData = result.totalSessions > 0;

  const pyramidEntries = useMemo(() => sortEntries(result.byPyramid), [result.byPyramid]);
  const areaEntries = useMemo(() => sortEntries(result.byArea), [result.byArea]);
  const lPhaseEntries = useMemo(() => sortEntries(result.byLPhase), [result.byLPhase]);
  const csEntries = useMemo(() => sortEntries(result.byCsLevel), [result.byCsLevel]);
  const envEntries = useMemo(() => sortEntries(result.byEnvironment), [result.byEnvironment]);
  const pressEntries = useMemo(() => sortEntries(result.byPressure), [result.byPressure]);

  if (!hasData) {
    return (
      <div className="rounded-xl border border-line bg-card p-8 shadow-card text-center">
        <Dumbbell className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-ink mb-1">
          Ingen økter matcher
        </h3>
        <p className="text-sm text-ink-muted">
          Prøv å fjerne noen filtre eller utvide perioden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPI-rad */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-card p-4 shadow-card text-center">
          <Dumbbell className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-ink font-[family-name:var(--font-jetbrains-mono)]">
            {result.totalSessions}
          </p>
          <p className="text-xs text-ink-muted mt-1">Økter</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4 shadow-card text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-ink font-[family-name:var(--font-jetbrains-mono)]">
            {fmtHours(result.totalMinutes)}
          </p>
          <p className="text-xs text-ink-muted mt-1">Timer</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4 shadow-card text-center">
          <CalendarDays className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-ink font-[family-name:var(--font-jetbrains-mono)]">
            {result.totalWeeks}
          </p>
          <p className="text-xs text-ink-muted mt-1">Uker</p>
        </div>
      </div>

      {/* Sammenligningsoversikt */}
      {compareResult && (
        <CompareCard
          title="Sammenligning"
          a={compareResult.filterA}
          b={compareResult.filterB}
        />
      )}

      {/* Dimensjonskort */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AggCard title="Per pyramide" entries={pyramidEntries} type="pyramid" colorClass="bg-primary" />
        <AggCard title="Per område" entries={areaEntries} type="area" colorClass="bg-[var(--color-data-blue)]" />
        <AggCard title="Per L-fase" entries={lPhaseEntries} type="lPhase" colorClass="bg-[var(--color-data-sage)]" />
        <AggCard title="Per CS-nivå" entries={csEntries} type="cs" colorClass="bg-[var(--color-data-amber)]" />
        <AggCard title="Per miljø" entries={envEntries} type="env" colorClass="bg-[var(--color-data-violet)]" />
        <AggCard title="Per pressnivå" entries={pressEntries} type="press" colorClass="bg-[var(--color-data-coral)]" />
      </div>
    </div>
  );
}
