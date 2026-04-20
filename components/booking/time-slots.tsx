"use client";


import { Icon } from "@/components/ui/icon";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { motion } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";

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
      <PremiumCard className="flex flex-col items-center justify-center py-12 text-center" padding="lg" hover="none">
        <Icon name="calendar_today" className="w-10 h-10 text-on-surface-variant/60 mb-3" />
        <p className="text-sm text-on-surface-variant">
          Velg en dato i kalenderen for å se ledige tider
        </p>
      </PremiumCard>
    );
  }

  if (loading) {
    return (
      <PremiumCard className="flex items-center justify-center gap-2 py-12" padding="lg" hover="none">
        <Icon name="progress_activity" className="w-4 h-4 animate-spin text-on-surface-variant" />
        <span className="text-sm text-on-surface-variant">Henter tider...</span>
      </PremiumCard>
    );
  }

  if (slots.length === 0) {
    return (
      <PremiumCard className="flex flex-col items-center justify-center py-12 text-center" padding="lg" hover="none">
        <Icon name="calendar_today" className="w-10 h-10 text-on-surface-variant/60 mb-3" />
        <p className="text-sm text-on-surface-variant">Ingen ledige tider denne dagen</p>
        <p className="text-xs text-on-surface-variant mt-1">Prøv en annen dato</p>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard hover="none">
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
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
              className={cn(
                "py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-on-surface text-surface border-black shadow-sm"
                  : "bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:border-outline-variant/50"
              )}
            >
              {timeStr}
            </motion.button>
          );
        })}
      </div>
    </PremiumCard>
  );
}
