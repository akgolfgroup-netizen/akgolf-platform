"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarDays, Loader2 } from "lucide-react";

interface TimeSlotsProps {
  date: Date | null;
  slots: string[];
  loading: boolean;
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export function TimeSlots({ date, slots, loading, selectedSlot, onSelect }: TimeSlotsProps) {
  if (!date) {
    return (
      <div className="bg-card border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
        <CalendarDays className="w-9 h-9 text-ink-subtle mb-3" strokeWidth={1.5} />
        <p className="text-[13px] text-ink-muted leading-relaxed">
          Velg en dato i kalenderen for a se ledige tider.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card border border-line rounded-2xl p-6 flex items-center justify-center gap-2.5 min-h-[220px]">
        <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
        <span className="text-[13px] text-ink-muted">Henter tider...</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-card border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
        <CalendarDays className="w-9 h-9 text-ink-subtle mb-3" strokeWidth={1.5} />
        <p className="text-[13px] text-ink-muted">Ingen ledige tider denne dagen.</p>
        <p className="text-[12px] text-ink-subtle mt-1">Prov en annen dato.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-line rounded-2xl p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
        {format(date, "EEEE d. MMMM", { locale: nb })}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot, index) => {
          const slotDate = new Date(slot);
          const timeStr = format(slotDate, "HH:mm");
          const isSelected = selectedSlot === slot;

          return (
            <motion.button
              key={slot}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              onClick={() => onSelect(slot)}
              className={`py-2.5 px-3 rounded-full text-[13px] font-semibold tabular-nums transition-all duration-200 border ${
                isSelected
                  ? "bg-ink text-card border-ink shadow-card"
                  : "bg-card text-ink border-line hover:border-ink/30 hover:bg-surface-soft"
              }`}
            >
              {timeStr}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
