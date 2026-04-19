"use client";



import { Icon } from "@/components/ui/icon";
import { format, addWeeks, subWeeks, startOfWeek, isSameWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";

interface WeekSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const isCurrentWeek = isSameWeek(weekStart, new Date(), { weekStartsOn: 1 });
  const weekNumber = format(weekStart, "w", { locale: nb });

  const goToPreviousWeek = () => {
    onWeekChange(subWeeks(selectedWeek, 1));
  };

  const goToNextWeek = () => {
    onWeekChange(addWeeks(selectedWeek, 1));
  };

  const goToToday = () => {
    onWeekChange(new Date());
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-xl p-3 border border-grey-200">
      {/* Previous Week */}
      <motion.button
        onClick={goToPreviousWeek}
        className="p-2 rounded-lg hover:bg-grey-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Forrige uke"
      >
        <Icon name="chevron_left" className="w-5 h-5 text-grey-400" />
      </motion.button>

      {/* Week Display */}
      <div className="flex-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <Icon name="calendar_today"Days className="w-4 h-4 text-grey-400" />
          <span className="font-semibold text-black">
            Uke {weekNumber}
          </span>
          {isCurrentWeek && (
            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
              Denne uken
            </span>
          )}
        </div>
        <p className="text-xs text-grey-400 mt-0.5">
          {format(weekStart, "d. MMM", { locale: nb })} -{" "}
          {format(addWeeks(weekStart, 1).setDate(addWeeks(weekStart, 1).getDate() - 1) ? weekStart : weekStart, "d. MMM yyyy", { locale: nb })}
        </p>
      </div>

      {/* Today Button */}
      {!isCurrentWeek && (
        <motion.button
          onClick={goToToday}
          className="px-3 py-1.5 text-xs font-medium text-black bg-grey-50 rounded-full hover:bg-grey-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          I dag
        </motion.button>
      )}

      {/* Next Week */}
      <motion.button
        onClick={goToNextWeek}
        className="p-2 rounded-lg hover:bg-grey-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Neste uke"
      >
        <Icon name="chevron_right" className="w-5 h-5 text-grey-400" />
      </motion.button>
    </div>
  );
}
