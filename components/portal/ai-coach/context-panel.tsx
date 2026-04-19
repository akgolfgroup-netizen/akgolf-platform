"use client";

import { 
  TrendingUp, 
  Target, 
  Calendar, 
  FileText, 
  Trophy,
  Clock,
  MapPin
} from "lucide-react";
import type { ChatContext } from "@/app/portal/(dashboard)/ai-coach/actions";

interface ContextPanelProps {
  context: ChatContext;
}

export function ContextPanel({ context }: ContextPanelProps) {
  const latestRound = context.recentRounds[0];
  const latestTraining = context.recentTrainingLogs[0];

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-3 flex items-center gap-2">
          <Target className="w-3.5 h-3.5" />
          Din profil
        </h3>
        <div className="space-y-2">
          <ContextItem
            icon={<Trophy className="w-4 h-4" />}
            label="Handicap"
            value={context.handicap !== null ? `HCP ${context.handicap}` : "Ikke registrert"}
          />
          <ContextItem
            icon={<TrendingUp className="w-4 h-4" />}
            label="Siste runde"
            value={latestRound 
              ? `${latestRound.totalScore ?? "?"} slag${latestRound.courseName ? ` (${latestRound.courseName})` : ""}`
              : "Ingen runder registrert"
            }
          />
        </div>
      </div>

      {/* Recent Activity */}
      {latestRound && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Siste aktivitet
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-grey-50 border border-grey-100">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-grey-200 flex items-center justify-center text-grey-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-black truncate">
                  {latestRound.courseName || "Ukjent bane"}
                </p>
                <p className="text-xs text-grey-400">
                  {formatDate(latestRound.date)} • {latestRound.totalScore ?? "?"} slag
                </p>
                {latestRound.sgTotal !== null && (
                  <p className="text-xs text-grey-500 mt-1">
                    SG: {latestRound.sgTotal.toFixed(1)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Plan */}
      {context.activePlan && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-3 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Aktiv plan
          </h3>
          <div className="p-3 rounded-lg bg-ai-light border border-ai/15">
            <p className="text-sm font-medium text-ai-text">
              {context.activePlan.title}
            </p>
            <p className="text-xs text-ai-text mt-0.5 capitalize">
              {context.activePlan.periodType}
            </p>
            <p className="text-xs text-ai mt-1">
              {formatDate(context.activePlan.startDate)} - {formatDate(context.activePlan.endDate)}
            </p>
          </div>
        </div>
      )}

      {/* Recent Training */}
      {latestTraining && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Siste trening
          </h3>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-grey-50 border border-grey-100">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-grey-200 flex items-center justify-center text-grey-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-black">
                {latestTraining.focusArea || "Generell trening"}
              </p>
              <p className="text-xs text-grey-400">
                {formatDate(latestTraining.date)} • {latestTraining.durationMinutes ?? "?"} min
              </p>
              {latestTraining.rating && (
                <p className="text-xs text-grey-500 mt-1">
                  Vurdering: {latestTraining.rating}/5
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Tournaments */}
      {context.upcomingTournaments.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-3 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" />
            Kommende turneringer
          </h3>
          <div className="space-y-2">
            {context.upcomingTournaments.slice(0, 2).map((tournament, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-grey-50 border border-grey-100"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-grey-200 flex items-center justify-center text-grey-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-black truncate">
                    {tournament.name}
                  </p>
                  <p className="text-xs text-grey-400">
                    {formatDate(tournament.startDate)}
                    {tournament.course && ` • ${tournament.course}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContextItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-grey-400">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-grey-400">{label}</p>
        <p className="font-medium text-black truncate">{value}</p>
      </div>
    </div>
  );
}
