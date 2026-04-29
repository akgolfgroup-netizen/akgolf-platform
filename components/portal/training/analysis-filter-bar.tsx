"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal, BarChart3 } from "lucide-react";
import {
  PYRAMIDE,
  TRENINGSOMRADER,
  L_FASER,
  CS_NIVAER,
  M_MILJO,
  PR_PRESS,
} from "@/lib/portal/training/ak-taxonomy";
import type { TrainingFilter } from "@/lib/portal/training/analysis-actions";

// ─── Konstanter ─────────────────────────────────────────────────────

const PERIODE_OPTIONS = [
  { key: "7d", label: "Siste 7 dager", days: 7 },
  { key: "30d", label: "Siste 30 dager", days: 30 },
  { key: "90d", label: "Siste 90 dager", days: 90 },
  { key: "1y", label: "Siste år", days: 365 },
  { key: "custom", label: "Egendefinert", days: 0 },
] as const;

type PeriodeKey = (typeof PERIODE_OPTIONS)[number]["key"];

const PARAM_MAP = {
  pyramid: "p",
  area: "a",
  lPhase: "l",
  cs: "cs",
  env: "m",
  press: "pr",
} as const;

// ─── Hjelpefunksjoner ───────────────────────────────────────────────

function parseArrayParam(sp: URLSearchParams, key: string): string[] {
  const raw = sp.get(key);
  return raw ? raw.split(",").filter(Boolean) : [];
}

function formatDateInput(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getPeriodDates(
  periode: PeriodeKey,
  fromStr: string | null,
  toStr: string | null
): { from: Date; to: Date } {
  const to = toStr ? new Date(toStr + "T23:59:59") : new Date();
  const opt = PERIODE_OPTIONS.find((o) => o.key === periode);
  if (opt && opt.days > 0) {
    const from = new Date();
    from.setDate(from.getDate() - opt.days);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }
  const from = fromStr
    ? new Date(fromStr + "T00:00:00")
    : new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);
  return { from, to };
}

function countActiveFilters(sp: URLSearchParams): number {
  let count = 0;
  Object.values(PARAM_MAP).forEach((k) => {
    if (sp.get(k)) count++;
  });
  if (sp.get("periode") && sp.get("periode") !== "90d") count++;
  if (sp.get("from") || sp.get("to")) count++;
  return count;
}

// ─── MultiSelect-komponent ──────────────────────────────────────────

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    },
    [selected, onChange]
  );

  const display =
    selected.length === 0
      ? label
      : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label ?? label
      : `${label} (${selected.length})`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-2 w-full min-h-[44px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors touch-manipulation ${
          selected.length > 0
            ? "border-primary bg-primary-soft text-primary"
            : "border-line bg-card text-ink-muted hover:border-primary/50"
        }`}
      >
        <span className="truncate">{display}</span>
        <ChevronDown className="w-4 h-4 shrink-0 opacity-60" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1 w-64 max-h-72 overflow-auto rounded-xl border border-line bg-card shadow-card p-2">
            <div className="flex flex-wrap gap-1.5">
              {options.map((opt) => {
                const isSel = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors min-h-[36px] ${
                      isSel
                        ? "bg-primary text-white"
                        : "bg-surface text-ink-muted hover:bg-primary-soft hover:text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="mt-2 w-full text-center text-xs text-ink-subtle hover:text-danger py-1"
              >
                Tøm valg
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Filter-kontroller (delt UI) ────────────────────────────────────

interface FilterControlsProps {
  filters: {
    pyramid: string[];
    area: string[];
    lPhase: string[];
    cs: string[];
    env: string[];
    press: string[];
  };
  periode: PeriodeKey;
  fromStr: string | null;
  toStr: string | null;
  onFilterChange: (key: keyof typeof PARAM_MAP, values: string[]) => void;
  onPeriodeChange: (key: PeriodeKey) => void;
  onCustomDateChange: (type: "from" | "to", value: string) => void;
  onClear: () => void;
}

function FilterControls({
  filters,
  periode,
  fromStr,
  toStr,
  onFilterChange,
  onPeriodeChange,
  onCustomDateChange,
  onClear,
}: FilterControlsProps) {
  const { from, to } = getPeriodDates(periode, fromStr, toStr);

  const pyramidOpts = PYRAMIDE.map((p) => ({ value: p.code, label: p.label }));
  const areaOpts = TRENINGSOMRADER.map((a) => ({ value: a.code, label: a.label }));
  const lPhaseOpts = L_FASER.map((f) => ({ value: f.code, label: f.label }));
  const csOpts = CS_NIVAER.map((c) => ({ value: c.code, label: c.code }));
  const envOpts = M_MILJO.map((m) => ({ value: m.code, label: m.label }));
  const pressOpts = PR_PRESS.map((p) => ({ value: p.code, label: p.label }));

  const activeCount =
    filters.pyramid.length +
    filters.area.length +
    filters.lPhase.length +
    filters.cs.length +
    filters.env.length +
    filters.press.length +
    (periode !== "90d" ? 1 : 0) +
    (fromStr || toStr ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Dimensjonsfiltre */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <MultiSelect
          label="Pyramide"
          options={pyramidOpts}
          selected={filters.pyramid}
          onChange={(v) => onFilterChange("pyramid", v)}
        />
        <MultiSelect
          label="Område"
          options={areaOpts}
          selected={filters.area}
          onChange={(v) => onFilterChange("area", v)}
        />
        <MultiSelect
          label="L-fase"
          options={lPhaseOpts}
          selected={filters.lPhase}
          onChange={(v) => onFilterChange("lPhase", v)}
        />
        <MultiSelect
          label="CS-nivå"
          options={csOpts}
          selected={filters.cs}
          onChange={(v) => onFilterChange("cs", v)}
        />
        <MultiSelect
          label="Miljø"
          options={envOpts}
          selected={filters.env}
          onChange={(v) => onFilterChange("env", v)}
        />
        <MultiSelect
          label="Press"
          options={pressOpts}
          selected={filters.press}
          onChange={(v) => onFilterChange("press", v)}
        />
      </div>

      {/* Periode + handlinger */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {PERIODE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onPeriodeChange(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] transition-colors ${
                periode === opt.key
                  ? "bg-primary text-white"
                  : "bg-surface text-ink-muted hover:bg-primary-soft hover:text-primary border border-line"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {periode === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={formatDateInput(from)}
              onChange={(e) => onCustomDateChange("from", e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-line bg-card text-sm text-ink min-h-[36px]"
            />
            <span className="text-ink-subtle text-sm">–</span>
            <input
              type="date"
              value={formatDateInput(to)}
              onChange={(e) => onCustomDateChange("to", e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-line bg-card text-sm text-ink min-h-[36px]"
            />
          </div>
        )}

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] text-ink-subtle hover:text-danger hover:bg-danger/5 transition-colors border border-line ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            Tøm filtre
          </button>
        )}
      </div>
    </div>
  );
}

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

  const filters = useMemo(
    () => ({
      pyramid: parseArrayParam(sp, PARAM_MAP.pyramid),
      area: parseArrayParam(sp, PARAM_MAP.area),
      lPhase: parseArrayParam(sp, PARAM_MAP.lPhase),
      cs: parseArrayParam(sp, PARAM_MAP.cs),
      env: parseArrayParam(sp, PARAM_MAP.env),
      press: parseArrayParam(sp, PARAM_MAP.press),
    }),
    [sp]
  );

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

  const fromStr = value.fromDate ? formatDateInput(value.fromDate) : null;
  const toStr = value.toDate ? formatDateInput(value.toDate) : null;

  const filters = useMemo(
    () => ({
      pyramid: value.pyramidCodes ?? [],
      area: value.areas ?? [],
      lPhase: value.lPhases ?? [],
      cs: value.csLevels ?? [],
      env: value.environments ?? [],
      press: value.pressureLevels ?? [],
    }),
    [value]
  );

  const handleFilterChange = useCallback(
    (dim: keyof typeof PARAM_MAP, values: string[]) => {
      const keyMap: Record<keyof typeof PARAM_MAP, keyof TrainingFilter> = {
        pyramid: "pyramidCodes",
        area: "areas",
        lPhase: "lPhases",
        cs: "csLevels",
        env: "environments",
        press: "pressureLevels",
      };
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

// ─── Eksport av filter-utledning for page.tsx ───────────────────────

export function buildFilterFromSearchParams(
  sp: URLSearchParams,
  userId?: string
): { filter: TrainingFilter; periodeLabel: string } {
  const periode = (sp.get("periode") as PeriodeKey) ?? "90d";
  const fromStr = sp.get("from");
  const toStr = sp.get("to");
  const { from, to } = getPeriodDates(periode, fromStr, toStr);

  const periodeLabel =
    PERIODE_OPTIONS.find((o) => o.key === periode)?.label ?? "Siste 90 dager";

  const filter: TrainingFilter = {
    userId,
    pyramidCodes: parseArrayParam(sp, PARAM_MAP.pyramid),
    areas: parseArrayParam(sp, PARAM_MAP.area),
    lPhases: parseArrayParam(sp, PARAM_MAP.lPhase),
    csLevels: parseArrayParam(sp, PARAM_MAP.cs),
    environments: parseArrayParam(sp, PARAM_MAP.env),
    pressureLevels: parseArrayParam(sp, PARAM_MAP.press),
    fromDate: from,
    toDate: to,
  };

  return { filter, periodeLabel };
}
