"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

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
  STYRKE: { bg: "bg-primary-container", icon: "text-surface", label: "Styrke" },
  TEKNIKK: { bg: "bg-primary", icon: "text-surface", label: "Teknikk" },
  SLAG: { bg: "bg-secondary-fixed", icon: "text-on-surface", label: "Slag" },
  SPILL: { bg: "bg-tertiary-container", icon: "text-surface", label: "Spill" },
  TURN: { bg: "bg-error", icon: "text-surface", label: "Turnering" },
  MENTAL: { bg: "bg-primary-container/80", icon: "text-surface", label: "Mental" },
  OTHER: { bg: "bg-surface-variant", icon: "text-on-surface-variant", label: "Annet" },
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
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
          <Icon name="fitness_center" className="w-6 h-6 text-on-surface-variant" />
        </div>
        <p className="text-sm text-on-surface-variant">Ingen økter logget ennå</p>
        <p className="text-xs text-on-surface-variant/60 mt-1">Start din første økt i dag!</p>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard padding="md" className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
          Siste økter
        </h3>
        <span className="text-xs text-on-surface-variant">{sessions.length} totalt</span>
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
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors text-left group"
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
                  <p className="text-sm font-medium text-on-surface truncate">
                    {typeInfo.label}
                  </p>
                  <span className="text-xs text-on-surface-variant/60">
                    {formatDate(session.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  {session.durationMinutes && (
                    <span className="flex items-center gap-1">
                      <Icon name="schedule" className="w-3 h-3" />
                      {session.durationMinutes} min
                    </span>
                  )}
                  {session.focusArea && (
                    <span className="flex items-center gap-1 truncate">
                      <Icon name="my_location" className="w-3 h-3" />
                      {session.focusArea}
                    </span>
                  )}
                </div>
              </div>

              {/* Intensity/rating indicator */}
              {session.intensity && (
                <div className="flex items-center gap-1 text-xs">
                  <Icon name="star" className="w-3 h-3 text-secondary-fixed fill-secondary-fixed" />
                  <span className="font-medium text-on-surface">{session.intensity}</span>
                </div>
              )}

              {/* Chevron */}
              <Icon name="chevron_right" className="w-4 h-4 text-on-surface-variant/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </PremiumCard>
  );
}
