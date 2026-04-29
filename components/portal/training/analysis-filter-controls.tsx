"use client";

import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  PYRAMIDE,
  TRENINGSOMRADER,
  L_FASER,
  CS_NIVAER,
  M_MILJO,
  PR_PRESS,
} from "@/lib/portal/training/ak-taxonomy";
import {
  type PeriodeKey,
  formatDateInput,
  getPeriodDates,
} from "./analysis-filter-types";

// ─── MultiSelect ────────────────────────────────────────────────────

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

// ─── FilterControls ─────────────────────────────────────────────────

export interface FilterControlsProps {
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
  onFilterChange: (key: "pyramid" | "area" | "lPhase" | "cs" | "env" | "press", values: string[]) => void;
  onPeriodeChange: (key: PeriodeKey) => void;
  onCustomDateChange: (type: "from" | "to", value: string) => void;
  onClear: () => void;
}

export function FilterControls({
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
          {[
            { key: "7d", label: "Siste 7 dager" },
            { key: "30d", label: "Siste 30 dager" },
            { key: "90d", label: "Siste 90 dager" },
            { key: "1y", label: "Siste år" },
            { key: "custom", label: "Egendefinert" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onPeriodeChange(opt.key as PeriodeKey)}
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
            <ChevronDown className="w-3.5 h-3.5 rotate-90" />
            Tøm filtre
          </button>
        )}
      </div>
    </div>
  );
}
