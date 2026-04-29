"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { getNextCompetition } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * NextCompetitionWidget — nedtelling til neste konkurranse.
 *
 * Data-kilde: Tournament + TournamentPrep via getNextCompetition()
 * Brukes pa: P1 (Dashboard), P3 (Kalender), N02 (Konkurranseforberedelse)
 */
export function NextCompetitionWidget() {
  const { data, loading } = useWidgetData(getNextCompetition, null);

  if (loading) {
    return <div className="h-24 bg-surface-container animate-pulse rounded-xl" />;
  }

  if (!data) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen kommende turneringer.
      </p>
    );
  }

  const dateLabel = format(new Date(data.date), "d. MMMM yyyy", { locale: nb });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft">
          <span className="text-lg font-bold text-primary">{data.daysLeft}</span>
        </div>
        <div>
          <p className="text-xs text-muted">dager igjen</p>
          <p className="text-sm font-semibold text-text truncate max-w-[160px]">
            {data.tournamentName}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Icon name="calendar_today" className="w-3.5 h-3.5" />
          <span>{dateLabel}</span>
        </div>
        {data.location ? (
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Icon name="location_on" className="w-3.5 h-3.5" />
            <span>{data.location}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
