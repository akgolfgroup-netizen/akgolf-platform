"use client";


import { Icon } from "@/components/ui/icon";
import * as React from "react";

import {
  endOfMonth,
  endOfToday,
  format,
  startOfMonth,
  startOfToday,
  subDays,
  subMonths,
} from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface AdminDateRange {
  from: Date;
  to: Date;
}

interface AdminDateRangePickerProps {
  value?: AdminDateRange;
  onChange?: (range: AdminDateRange) => void;
  className?: string;
  placeholder?: string;
}

interface Preset {
  id: string;
  label: string;
  getRange: () => AdminDateRange;
}

const PRESETS: Preset[] = [
  {
    id: "today",
    label: "I dag",
    getRange: () => ({ from: startOfToday(), to: endOfToday() }),
  },
  {
    id: "last7",
    label: "Siste 7 dager",
    getRange: () => ({ from: subDays(startOfToday(), 6), to: endOfToday() }),
  },
  {
    id: "last30",
    label: "Siste 30 dager",
    getRange: () => ({ from: subDays(startOfToday(), 29), to: endOfToday() }),
  },
  {
    id: "last90",
    label: "Siste 90 dager",
    getRange: () => ({ from: subDays(startOfToday(), 89), to: endOfToday() }),
  },
  {
    id: "thisMonth",
    label: "Denne måneden",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    id: "lastMonth",
    label: "Forrige måned",
    getRange: () => {
      const date = subMonths(new Date(), 1);
      return { from: startOfMonth(date), to: endOfMonth(date) };
    },
  },
];

export function AdminDateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Velg periode",
}: AdminDateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [fromInput, setFromInput] = React.useState(
    value ? format(value.from, "yyyy-MM-dd") : "",
  );
  const [toInput, setToInput] = React.useState(
    value ? format(value.to, "yyyy-MM-dd") : "",
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value) {
      setFromInput(format(value.from, "yyyy-MM-dd"));
      setToInput(format(value.to, "yyyy-MM-dd"));
    }
  }, [value]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const applyPreset = (preset: Preset) => {
    const range = preset.getRange();
    setFromInput(format(range.from, "yyyy-MM-dd"));
    setToInput(format(range.to, "yyyy-MM-dd"));
    onChange?.(range);
    setOpen(false);
  };

  const applyCustom = () => {
    if (!fromInput || !toInput) return;
    const from = new Date(fromInput);
    const to = new Date(toInput);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return;
    onChange?.({ from, to });
    setOpen(false);
  };

  const displayLabel = value
    ? `${format(value.from, "d. MMM", { locale: nb })} – ${format(value.to, "d. MMM yyyy", { locale: nb })}`
    : placeholder;

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="admin-btn admin-btn-secondary"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="calendar_today" className="w-4 h-4" />
        {displayLabel}
        <Icon name="expand_more" className="w-4 h-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 rounded-xl shadow-xl z-50 p-3 min-w-[320px]"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-muted)",
          }}
        >
          <div className="grid grid-cols-2 gap-1 mb-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-left text-xs px-3 py-2 rounded-lg transition-colors hover:bg-on-surface/5"
                style={{ color: "var(--color-text)" }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div
            className="border-t pt-3"
            style={{ borderColor: "var(--color-muted)" }}
          >
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label
                  className="text-[10px] uppercase tracking-wide font-semibold"
                  style={{ color: "var(--color-muted)" }}
                >
                  Fra
                </label>
                <input
                  type="date"
                  value={fromInput}
                  onChange={(event) => setFromInput(event.target.value)}
                  className="admin-input mt-0.5"
                />
              </div>
              <div>
                <label
                  className="text-[10px] uppercase tracking-wide font-semibold"
                  style={{ color: "var(--color-muted)" }}
                >
                  Til
                </label>
                <input
                  type="date"
                  value={toInput}
                  onChange={(event) => setToInput(event.target.value)}
                  className="admin-input mt-0.5"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={applyCustom}
              className="admin-btn admin-btn-primary w-full"
            >
              Bruk periode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
