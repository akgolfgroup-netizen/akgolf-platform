"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  analyzeTraining,
  compareTrainingFilters,
  type TrainingAnalysisResult,
  type TrainingFilter,

} from "@/lib/portal/training/analysis-actions";
import {
  AnalysisFilterBar,
  LocalFilterBar,
  buildFilterFromSearchParams,
} from "@/components/portal/training/analysis-filter-bar";
import { AnalysisResults } from "@/components/portal/training/analysis-results";
import { AnalysisTrendChart } from "@/components/portal/training/analysis-trend-chart";
import { BarChart3 } from "lucide-react";

// ─── Hovedkomponent ─────────────────────────────────────────────────

function AnalysisPageInner() {
  const searchParams = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const [resultA, setResultA] = useState<TrainingAnalysisResult | null>(null);
  const [resultB, setResultB] = useState<TrainingAnalysisResult | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const { filter: filterA } = useMemo(() => buildFilterFromSearchParams(sp), [sp]);

  // Initielt Filter B: samme som A men med periode forrige 90 dager
  const defaultFilterB = useMemo((): TrainingFilter => {
    const to = filterA.fromDate ? new Date(filterA.fromDate.getTime() - 1) : new Date();
    const from = new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);
    return {
      userId: filterA.userId,
      fromDate: from,
      toDate: to,
    };
  }, [filterA.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [filterB, setFilterB] = useState<TrainingFilter>(defaultFilterB);

  // Last data ved endring av filter A
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        if (compareMode) {
          const res = await compareTrainingFilters(filterA, filterB);
          if (!cancelled) {
            setResultA(res.filterA);
            setResultB(res.filterB);
          }
        } else {
          const res = await analyzeTraining(filterA);
          if (!cancelled) {
            setResultA(res);
            setResultB(null);
          }
        }
      } catch (e) {
        console.error("Analysefeil:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [sp, compareMode, filterA, filterB]);

  const toggleCompare = useCallback(() => {
    setCompareMode((prev) => {
      const next = !prev;
      if (next) {
        // Reset filter B til default når vi slår på sammenligning
        const to = filterA.fromDate ? new Date(filterA.fromDate.getTime() - 1) : new Date();
        const from = new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);
        setFilterB({
          userId: filterA.userId,
          fromDate: from,
          toDate: to,
        });
      }
      return next;
    });
  }, [filterA]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink font-[family-name:var(--font-inter-tight)]">
            Treningsanalyse
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Filtrer og analyser treningsdata på tvers av dimensjoner
          </p>
        </div>
      </div>

      {/* Filter A */}
      <AnalysisFilterBar compareMode={compareMode} onToggleCompare={toggleCompare} />

      {/* Filter B (sammenligning) */}
      {compareMode && (
        <div className="rounded-xl border-2 border-dashed border-accent/40 bg-accent-soft/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-ink">Sammenlign med</span>
          </div>
          <LocalFilterBar value={filterB} onChange={setFilterB} />
        </div>
      )}

      {/* Lasteindikator */}
      {loading && (
        <div className="rounded-xl border border-line bg-card p-8 shadow-card">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-surface rounded w-1/3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 bg-surface rounded-xl" />
              <div className="h-24 bg-surface rounded-xl" />
              <div className="h-24 bg-surface rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Resultater */}
      {!loading && resultA && (
        <>
          {compareMode && resultB ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-ink">Filter A</span>
                </div>
                <AnalysisResults result={resultA} compareResult={null} />
                <AnalysisTrendChart data={resultA.weeklyTrend} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm font-semibold text-ink">Filter B</span>
                </div>
                <AnalysisResults result={resultB} compareResult={null} />
                <AnalysisTrendChart data={resultB.weeklyTrend} />
              </div>
            </div>
          ) : (
            <>
              <AnalysisResults result={resultA} compareResult={null} />
              <AnalysisTrendChart data={resultA.weeklyTrend} />
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── Wrapper med Suspense ───────────────────────────────────────────

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface rounded w-1/3" />
            <div className="h-4 bg-surface rounded w-1/2" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 bg-surface rounded-xl" />
              <div className="h-24 bg-surface rounded-xl" />
              <div className="h-24 bg-surface rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <AnalysisPageInner />
    </Suspense>
  );
}
