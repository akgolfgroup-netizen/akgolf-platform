"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { parseTimeRange } from "@/lib/portal/availability/parse-time-range";

interface DateOverride {
  id: string;
  date: string; // ISO
  startTime: string;
  endTime: string;
}

interface WeeklyDefault {
  dayOfWeek: number; // 0 = søndag (JS), vi bruker 1=man...
  startTime: string;
  endTime: string;
}

interface Props {
  instructorId: string;
  weeklyDefaults: WeeklyDefault[]; // 0 = søndag, 1 = mandag osv. (getUTCDay-kompatibelt)
}

export default function AvailabilityMonthCalendar({ instructorId, weeklyDefaults }: Props) {
  const [anchor, setAnchor] = useState(new Date());
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCell, setOpenCell] = useState<string | null>(null); // ISO date
  const [cellInput, setCellInput] = useState("");
  const [cellError, setCellError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = useMemo(() => eachDayOfInterval({ start: gridStart, end: gridEnd }), [gridStart, gridEnd]);

  const fetchOverrides = useCallback(async () => {
    if (!instructorId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        instructorId,
        from: gridStart.toISOString(),
        to: gridEnd.toISOString(),
      });
      const res = await fetch(`/api/portal/admin/availability/date?${params}`);
      if (res.ok) {
        const { overrides } = (await res.json()) as { overrides: DateOverride[] };
        setOverrides(overrides);
      }
    } finally {
      setLoading(false);
    }
  }, [instructorId, gridStart, gridEnd]);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  useEffect(() => {
    if (openCell && inputRef.current) inputRef.current.focus();
  }, [openCell]);

  const getOverride = (d: Date) =>
    overrides.find((o) => isSameDay(new Date(o.date), d));

  const getWeeklyDefault = (d: Date) => {
    const dow = d.getUTCDay();
    return weeklyDefaults.find((w) => w.dayOfWeek === dow);
  };

  const openEditor = (d: Date) => {
    const iso = d.toISOString();
    const existing = getOverride(d);
    setOpenCell(iso);
    setCellInput(existing ? `${existing.startTime.slice(0, 5)}-${existing.endTime.slice(0, 5)}` : "");
    setCellError(null);
  };

  const save = async (d: Date) => {
    setCellError(null);
    const parsed = parseTimeRange(cellInput);
    if ("error" in parsed) {
      setCellError(parsed.error);
      return;
    }
    if ("off" in parsed && parsed.off) {
      setCellError("Fri-dager: bruk BlockedTime (kommer i egen iterasjon)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/portal/admin/availability/date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructorId,
          date: d.toISOString(),
          startTime: parsed.start,
          endTime: parsed.end,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Ukjent feil" }));
        setCellError(error ?? "Kunne ikke lagre");
        return;
      }
      await fetchOverrides();
      setOpenCell(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (override: DateOverride) => {
    setSaving(true);
    try {
      await fetch("/api/portal/admin/availability/date", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: override.id }),
      });
      await fetchOverrides();
      setOpenCell(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-on-surface">
          {format(anchor, "MMMM yyyy", { locale: nb })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAnchor(subMonths(anchor, 1))}
            className="p-1.5 rounded-lg hover:bg-surface-variant"
            aria-label="Forrige måned"
          >
            <Icon name="chevron_left" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAnchor(new Date())}
            className="px-3 py-1 text-xs font-medium rounded-lg hover:bg-surface-variant"
          >
            I dag
          </button>
          <button
            onClick={() => setAnchor(addMonths(anchor, 1))}
            className="p-1.5 rounded-lg hover:bg-surface-variant"
            aria-label="Neste måned"
          >
            <Icon name="chevron_right" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[10px] font-medium text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/30">
        {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((d) => (
          <div key={d} className="py-2 text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d) => {
          const iso = d.toISOString();
          const inMonth = isSameMonth(d, anchor);
          const override = getOverride(d);
          const defaultW = getWeeklyDefault(d);
          const isOpen = openCell === iso;
          return (
            <div
              key={iso}
              className={cn(
                "relative border-b border-r border-outline-variant/30 min-h-[72px] p-1.5 text-xs transition-colors",
                !inMonth && "bg-surface/50 text-on-surface-variant/50",
                isToday(d) && "bg-success-text/5",
                override && "border-l-2 border-l-success-text"
              )}
            >
              <button
                onClick={() => openEditor(d)}
                className="w-full text-left space-y-0.5 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <span className={cn("font-semibold", isToday(d) && "text-success-text")}>
                    {format(d, "d")}
                  </span>
                  {override && <Icon name="edit" className="w-3 h-3 text-success-text" />}
                </div>
                {override ? (
                  <div className="text-[10px] font-medium text-on-surface tabular-nums">
                    {override.startTime.slice(0, 5)}–{override.endTime.slice(0, 5)}
                  </div>
                ) : defaultW ? (
                  <div className="text-[10px] text-on-surface-variant/70 tabular-nums">
                    {defaultW.startTime.slice(0, 5)}–{defaultW.endTime.slice(0, 5)}
                  </div>
                ) : (
                  <div className="text-[10px] text-on-surface-variant/50">—</div>
                )}
              </button>

              {isOpen && (
                <div className="absolute z-20 top-full left-0 mt-1 w-60 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-3 space-y-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={cellInput}
                    onChange={(e) => setCellInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save(d);
                      if (e.key === "Escape") setOpenCell(null);
                    }}
                    placeholder="f.eks. 10-18"
                    className="w-full text-sm bg-surface border border-outline-variant/30 rounded px-2 py-1 text-on-surface focus:outline-none focus:border-success-text"
                  />
                  {cellError && <div className="text-[11px] text-error">{cellError}</div>}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => save(d)}
                      disabled={saving}
                      className="flex-1 px-2 py-1 text-xs font-medium bg-on-surface text-surface rounded hover:opacity-90"
                    >
                      Lagre
                    </button>
                    {override && (
                      <button
                        onClick={() => remove(override)}
                        disabled={saving}
                        className="px-2 py-1 text-xs font-medium text-on-surface-variant hover:text-error"
                      >
                        Tilbakestill
                      </button>
                    )}
                    <button
                      onClick={() => setOpenCell(null)}
                      className="px-2 py-1 text-xs text-on-surface-variant hover:text-on-surface"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="p-3 text-center text-xs text-on-surface-variant">
          <Icon name="progress_activity" className="w-3 h-3 animate-spin inline mr-1" />
          Henter overstyringer…
        </div>
      )}
    </div>
  );
}
