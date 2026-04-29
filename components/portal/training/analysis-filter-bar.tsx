"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, BarChart3 } from "lucide-react";
import type { TrainingFilter } from "@/lib/portal/training/analysis-actions";
import {
  PARAM_MAP,
  type PeriodeKey,
  countActiveFilters,
  filterStateFromSearchParams,
  buildFilterFromSearchParams,
  getPeriodDates,
} from "./analysis-filter-types";
import { FilterControls } from "./analysis-filter-controls";

// ─── URL-basert filter-bar ──────────────────────────────────────────

interface AnalysisFilterBarProps {
  compareMode: boolean;
  onToggleCompare: () => void;
}

export function AnalysisFilterBar({ compareMode, onToggleCompare }: AnalysisFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sp = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const periode = (sp.get("periode") as PeriodeKey) ?? "90d";
  const fromStr = sp.get("from");
  const toStr = sp.get("to");
  const filters = useMemo(() => filterStateFromSearchParams(sp), [sp]);
  const activeCount = useMemo(() => countActiveFilters(sp), [sp]);

  const updateParam = useCallback(
    (key: string, values: string[]) => {
      const next = new URLSearchParams(sp.toString());
      if (values.length === 0) {
        next.delete(key);
      } else {
        next.set(key, values.join(","));
      }
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  const setPeriode = useCallback(
    (key: PeriodeKey) => {
      const next = new URLSearchParams(sp.toString());
      next.set("periode", key);
      if (key !== "custom") {
        next.delete("from");
        next.delete("to");
      }
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  const setCustomDate = useCallback(
    (type: "from" | "to", value: string) => {
      const next = new URLSearchParams(sp.toString());
      next.set("periode", "custom");
      next.set(type, value);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  const clearAll = useCallback(() => {
    router.replace("?", { scroll: false });
  }, [router]);

  const handleFilterChange = useCallback(
    (dim: keyof typeof PARAM_MAP, values: string[]) => {
      updateParam(PARAM_MAP[dim], values);
    },
    [updateParam]
  );

  return (
    <div className="space-y-3">
      {/* Mobil: collapse-pille */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center gap-2 w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-line bg-card shadow-card text-sm font-medium text-ink"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtre {activeCount > 0 ? `(${activeCount} aktive)` : ""}</span>
          <ChevronDown
            className={`w-4 h-4 ml-auto transition-transform ${mobileOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div className={`${mobileOpen ? "block" : "hidden"} lg:block space-y-3`}>
        <FilterControls
          filters={filters}
          periode={periode}
          fromStr={fromStr}
          toStr={toStr}
          onFilterChange={handleFilterChange}
          onPeriodeChange={setPeriode}
          onCustomDateChange={setCustomDate}
          onClear={clearAll}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleCompare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] transition-colors ${
              compareMode
                ? "bg-accent text-ink"
                : "bg-surface text-ink-muted hover:bg-primary-soft hover:text-primary border border-line"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Sammenlign
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lokal filter-bar (for Filter B i sammenlign-modus) ─────────────

interface LocalFilterBarProps {
  value: TrainingFilter;
  onChange: (filter: TrainingFilter) => void;
}

export function LocalFilterBar({ value, onChange }: LocalFilterBarProps) {
  function derivePeriode(fromDate?: Date): PeriodeKey {
    if (!fromDate) return "90d";
    const now = new Date();
    const diff = now.getTime() - fromDate.getTime();
    const days = Math.round(diff / (24 * 60 * 60 * 1000));
    if (days <= 8) return "7d";
    if (days <= 35) return "30d";
    if (days <= 95) return "90d";
    if (days <= 370) return "1y";
    return "custom";
  }

  const periode: PeriodeKey = derivePeriode(value.fromDate);
  const fromStr = value.fromDate ? value.fromDate.toISOString().split("T")[0] : null;
  const toStr = value.toDate ? value.toDate.toISOString().split("T")[0] : null;

  const filters = useMemo(() => ({
    pyramid: value.pyramidCodes ?? [],
    area: value.areas ?? [],
    lPhase: value.lPhases ?? [],
    cs: value.csLevels ?? [],
    env: value.environments ?? [],
    press: value.pressureLevels ?? [],
  }), [value]);

  const handleFilterChange = useCallback(
    (dim: keyof typeof PARAM_MAP, values: string[]) => {
      const keyMap = {
        pyramid: "pyramidCodes",
        area: "areas",
        lPhase: "lPhases",
        cs: "csLevels",
        env: "environments",
        press: "pressureLevels",
      } as const;
      onChange({ ...value, [keyMap[dim]]: values.length > 0 ? values : undefined });
    },
    [value, onChange]
  );

  const setPeriode = useCallback(
    (key: PeriodeKey) => {
      const { from, to } = getPeriodDates(key, null, null);
      onChange({ ...value, fromDate: from, toDate: to });
    },
    [value, onChange]
  );

  const setCustomDate = useCallback(
    (type: "from" | "to", dateVal: string) => {
      const d = new Date(dateVal + (type === "from" ? "T00:00:00" : "T23:59:59"));
      onChange({ ...value, [type === "from" ? "fromDate" : "toDate"]: d });
    },
    [value, onChange]
  );

  const clearAll = useCallback(() => {
    const { from, to } = getPeriodDates("90d", null, null);
    onChange({
      userId: value.userId,
      fromDate: from,
      toDate: to,
    });
  }, [value, onChange]);

  return (
    <FilterControls
      filters={filters}
      periode={periode}
      fromStr={fromStr}
      toStr={toStr}
      onFilterChange={handleFilterChange}
      onPeriodeChange={setPeriode}
      onCustomDateChange={setCustomDate}
      onClear={clearAll}
    />
  );
}

export { buildFilterFromSearchParams };
