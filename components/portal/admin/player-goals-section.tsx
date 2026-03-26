"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Target, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetDate: Date | null;
  status: string;
  targetValue: number | null;
  currentValue: number | null;
}

interface PlayerGoalsSectionProps {
  goals: Goal[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Target }> = {
  ACTIVE: { label: "Aktiv", color: "bg-blue-100 text-blue-700", icon: Target },
  COMPLETED: { label: "Oppnådd", color: "bg-green-100 text-green-700", icon: CheckCircle },
  PENDING: { label: "Venter", color: "bg-amber-100 text-amber-700", icon: Clock },
};

export function PlayerGoalsSection({ goals }: PlayerGoalsSectionProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Ingen mål satt av spilleren ennå.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const config = STATUS_CONFIG[goal.status] ?? STATUS_CONFIG.ACTIVE;
        const Icon = config.icon;
        const progress = goal.targetValue && goal.currentValue
          ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
          : null;

        return (
          <div
            key={goal.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-white border border-gray-200">
                  <Icon className="w-4 h-4 text-[#B07D4F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{goal.title}</p>
                  {goal.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{goal.description}</p>
                  )}
                  {goal.targetDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Mål: {format(new Date(goal.targetDate), "d. MMM yyyy", { locale: nb })}
                    </p>
                  )}
                </div>
              </div>
              <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
            </div>

            {/* Progress bar if applicable */}
            {progress !== null && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Fremgang
                  </span>
                  <span className="font-medium text-gray-700">
                    {goal.currentValue} / {goal.targetValue}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B07D4F] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
