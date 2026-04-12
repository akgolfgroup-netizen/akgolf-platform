"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="w-10 h-10 text-grey-300 mb-3" />
        <p className="text-sm text-muted">
          Velg en dato i kalenderen for å se ledige tider
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Henter tider...</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="w-10 h-10 text-grey-300 mb-3" />
        <p className="text-sm text-muted">Ingen ledige tider denne dagen</p>
        <p className="text-xs text-grey-300 mt-1">Prøv en annen dato</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              onClick={() => onSelect(slot)}
              className={[
                "py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-text border-grey-200 hover:border-primary hover:shadow-card",
              ].join(" ")}
            >
              {timeStr}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
