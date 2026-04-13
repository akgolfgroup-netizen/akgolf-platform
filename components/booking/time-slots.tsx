"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Loader2, Calendar } from "lucide-react";
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
        <Calendar className="w-10 h-10 text-[#A5B2AD] mb-3" />
        <p className="text-sm text-[#324D45]">
          Velg en dato i kalenderen for å se ledige tider
        </p>
      </PremiumCard>
    );
  }

  if (loading) {
    return (
      <PremiumCard className="flex items-center justify-center gap-2 py-12" padding="lg" hover="none">
        <Loader2 className="w-4 h-4 animate-spin text-[#7A8C85]" />
        <span className="text-sm text-[#324D45]">Henter tider...</span>
      </PremiumCard>
    );
  }

  if (slots.length === 0) {
    return (
      <PremiumCard className="flex flex-col items-center justify-center py-12 text-center" padding="lg" hover="none">
        <Calendar className="w-10 h-10 text-[#A5B2AD] mb-3" />
        <p className="text-sm text-[#324D45]">Ingen ledige tider denne dagen</p>
        <p className="text-xs text-[#7A8C85] mt-1">Prøv en annen dato</p>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard hover="none">
      <p className="text-xs font-semibold text-[#7A8C85] uppercase tracking-wider mb-3">
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
                  ? "bg-[#0A1F18] text-white border-[#0A1F18] shadow-sm"
                  : "bg-white text-[#0A1F18] border-[#D5DFDB] hover:border-[#A5B2AD]"
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
