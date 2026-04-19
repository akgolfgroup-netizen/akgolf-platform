"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import { nb } from "date-fns/locale";

interface SessionData {
  id: string;
  date: Date | string;
  type: string;
  durationMinutes: number | null;
  focusArea?: string | null;
}

interface MonthCalendarProps {
  sessions: SessionData[];
  onSelectDate?: (date: Date, sessions: SessionData[]) => void;
}

// Type colors matching the specification
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  FYS: { 
    bg: "bg-blue-500", 
    text: "text-white", 
    border: "border-blue-500",
    label: "Fysisk" 
  },
  TEK: { 
    bg: "bg-[#16A34A]", 
    text: "text-white", 
    border: "border-[#16A34A]",
    label: "Teknikk" 
  },
  SLAG: { 
    bg: "bg-[#D4AF37]", 
    text: "text-black", 
    border: "border-[#D4AF37]",
    label: "Slagtrening" 
  },
  SPILL: { 
    bg: "bg-orange-500", 
    text: "text-white", 
    border: "border-orange-500",
    label: "Spill" 
  },
  TURN: { 
    bg: "bg-red-500", 
    text: "text-white", 
    border: "border-red-500",
    label: "Turnering" 
  },
  // Fallback mappings
  STYRKE: { bg: "bg-blue-500", text: "text-white", border: "border-blue-500", label: "Styrke" },
  TRENING: { bg: "bg-[#16A34A]", text: "text-white", border: "border-[#16A34A]", label: "Trening" },
  COACHING: { bg: "bg-purple-500", text: "text-white", border: "border-purple-500", label: "Coaching" },
  OTHER: { bg: "bg-grey-400", text: "text-white", border: "border-grey-400", label: "Annet" },
};

const getTypeColor = (type: string) => {
  const upperType = type.toUpperCase();
  return TYPE_COLORS[upperType] || TYPE_COLORS.OTHER;
};

const ALL_TYPES = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

export function MonthCalendar({ sessions, onSelectDate }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<string[]>(ALL_TYPES);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const days: Date[] = [];
    let day = calendarStart;
    
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    return days;
  }, [currentMonth]);

  const getSessionsForDay = (date: Date) => {
    return sessions.filter(s => {
      const sessionDate = typeof s.date === "string" ? parseISO(s.date) : s.date;
      const matchesDate = isSameDay(sessionDate, date);
      const matchesType = selectedTypes.some(t => 
        s.type?.toUpperCase().includes(t) || 
        s.focusArea?.toUpperCase().includes(t)
      );
      return matchesDate && matchesType;
    });
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const daySessions = getSessionsForDay(date);
    onSelectDate?.(date, daySessions);
  };

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  return (
    <PremiumCard padding="lg" className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-full hover:bg-grey-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-grey-400" />
          </motion.button>
          
          <h3 className="text-lg font-semibold text-black min-w-[140px] text-center">
            {format(currentMonth, "MMMM yyyy", { locale: nb })}
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-full hover:bg-grey-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-grey-400" />
          </motion.button>
        </div>

        {/* Quick filter indicator */}
        {selectedTypes.length < ALL_TYPES.length && (
          <span className="text-xs text-grey-400 bg-grey-100 px-2 py-1 rounded-full">
            {selectedTypes.length} av {ALL_TYPES.length} typer
          </span>
        )}
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-grey-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </div>
        {ALL_TYPES.map(type => {
          const colors = getTypeColor(type);
          const isActive = selectedTypes.includes(type);
          
          return (
            <motion.button
              key={type}
              onClick={() => toggleType(type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                isActive 
                  ? `${colors.bg} ${colors.text} ${colors.border}`
                  : "bg-white text-grey-400 border-grey-200 hover:border-grey-300"
              )}
            >
              {colors.label}
            </motion.button>
          );
        })}
      </div>

      {/* Calendar grid */}
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-grey-200 bg-grey-50">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="py-2 text-center text-xs font-medium text-grey-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const daySessions = getSessionsForDay(day);
            const hasSessions = daySessions.length > 0;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            // Get primary type color for the day
            const primaryType = daySessions[0]?.type || "OTHER";
            const typeColor = getTypeColor(primaryType);

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.005 }}
                className={cn(
                  "relative aspect-square p-1 border-b border-r border-grey-100 last:border-r-0 transition-all",
                  !isCurrentMonth && "bg-grey-50/50",
                  isSelected && "bg-accent-cta/10",
                  "hover:bg-grey-50"
                )}
              >
                {/* Date number */}
                <span className={cn(
                  "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                  isToday 
                    ? "bg-black text-white" 
                    : isCurrentMonth 
                      ? "text-black" 
                      : "text-grey-300"
                )}>
                  {format(day, "d")}
                </span>

                {/* Session indicators */}
                {hasSessions && (
                  <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
                    {daySessions.slice(0, 3).map((session, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          getTypeColor(session.type || "OTHER").bg
                        )}
                        title={`${session.type} - ${session.durationMinutes}min`}
                      />
                    ))}
                    {daySessions.length > 3 && (
                      <span className="text-[8px] text-grey-400 leading-none">
                        +{daySessions.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Full day indicator for single session */}
                {daySessions.length === 1 && (
                  <div className={cn(
                    "absolute inset-x-1 bottom-1 h-1 rounded-full opacity-50",
                    typeColor.bg
                  )} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-grey-200">
        {ALL_TYPES.map(type => {
          const colors = getTypeColor(type);
          return (
            <div key={type} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
              <span className="text-xs text-grey-400">{colors.label}</span>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}
