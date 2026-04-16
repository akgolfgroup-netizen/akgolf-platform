"use client";

import { motion } from "framer-motion";
import { Clock, Target, Star, ChevronRight, Dumbbell } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";
import { format, isToday, isSameDay, subDays } from "date-fns";
import { nb } from "date-fns/locale";

interface Session {
  id: string;
  date: Date | string;
  type: string;
  focusArea?: string | null;
  durationMinutes: number | null;
  intensity?: number | null;
  rating?: number | null;
  notes?: string | null;
}

interface RecentSessionsListProps {
  sessions: Session[];
  onSelectSession?: (session: Session) => void;
  maxItems?: number;
}

const TYPE_COLORS: Record<string, { bg: string; icon: string; label: string }> = {
  STYRKE: { bg: "bg-blue-500", icon: "text-white", label: "Styrke" },
  TEKNIKK: { bg: "bg-[#16A34A]", icon: "text-white", label: "Teknikk" },
  SLAG: { bg: "bg-[#D4AF37]", icon: "text-black", label: "Slag" },
  SPILL: { bg: "bg-orange-500", icon: "text-white", label: "Spill" },
  TURN: { bg: "bg-red-500", icon: "text-white", label: "Turnering" },
  MENTAL: { bg: "bg-purple-500", icon: "text-white", label: "Mental" },
  OTHER: { bg: "bg-grey-400", icon: "text-white", label: "Annet" },
};

const getTypeInfo = (type: string) => {
  const upperType = type?.toUpperCase() || "OTHER";
  return TYPE_COLORS[upperType] || TYPE_COLORS.OTHER;
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  if (isToday(d)) return "I dag";
  const yesterday = subDays(new Date(), 1);
  if (isSameDay(d, yesterday)) return "I går";
  return format(d, "EEEE", { locale: nb });
};

export function RecentSessionsList({ 
  sessions, 
  onSelectSession,
  maxItems = 5 
}: RecentSessionsListProps) {
  const sortedSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  if (sortedSessions.length === 0) {
    return (
      <PremiumCard padding="lg" className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-grey-100 flex items-center justify-center mx-auto mb-3">
          <Dumbbell className="w-6 h-6 text-grey-400" />
        </div>
        <p className="text-sm text-grey-400">Ingen økter logget ennå</p>
        <p className="text-xs text-grey-300 mt-1">Start din første økt i dag!</p>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard padding="md" className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400">
          Siste økter
        </h3>
        <span className="text-xs text-grey-400">{sessions.length} totalt</span>
      </div>

      <div className="space-y-2">
        {sortedSessions.map((session, idx) => {
          const typeInfo = getTypeInfo(session.type || "");
          
          return (
            <motion.button
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectSession?.(session)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-grey-50 transition-colors text-left group"
            >
              {/* Type icon */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                typeInfo.bg
              )}>
                <span className={cn("text-xs font-bold", typeInfo.icon)}>
                  {session.type?.slice(0, 2) || "TR"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-black truncate">
                    {typeInfo.label}
                  </p>
                  <span className="text-xs text-grey-300">
                    {formatDate(session.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-grey-400">
                  {session.durationMinutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.durationMinutes} min
                    </span>
                  )}
                  {session.focusArea && (
                    <span className="flex items-center gap-1 truncate">
                      <Target className="w-3 h-3" />
                      {session.focusArea}
                    </span>
                  )}
                </div>
              </div>

              {/* Intensity/rating indicator */}
              {session.intensity && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-accent-cta fill-accent-cta" />
                  <span className="font-medium text-black">{session.intensity}</span>
                </div>
              )}

              {/* Chevron */}
              <ChevronRight className="w-4 h-4 text-grey-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </PremiumCard>
  );
}
