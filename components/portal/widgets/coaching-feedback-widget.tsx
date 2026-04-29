"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { getRecentCoachingFeedback } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * CoachingFeedbackWidget — siste tilbakemelding fra instruktor.
 *
 * Data-kilde: CoachingSession via getRecentCoachingFeedback()
 * Brukes pa: P1 (Dashboard), PB01 (AI-coach), PB08, PB10, N04
 */
export function CoachingFeedbackWidget() {
  const { data, loading } = useWidgetData(getRecentCoachingFeedback, null);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-16 bg-surface-container animate-pulse rounded" />
        <div className="h-4 bg-surface-container animate-pulse rounded w-1/2" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-xs text-muted py-4 text-center">
        Ingen coaching-tilbakemelding ennå.
      </p>
    );
  }

  const dateLabel = format(new Date(data.date), "d. MMM yyyy", { locale: nb });
  const rating = data.rating ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Icon
          name="format_quote"
          className="w-4 h-4 text-primary shrink-0 mt-0.5"
        />
        <p className="text-xs text-text leading-relaxed line-clamp-4">
          {data.text || "Ingen tekst registrert."}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              name="star"
              key={i}
              className={
                "w-3 h-3 " +
                (i < rating
                  ? "text-secondary-fixed fill-accent-cta"
                  : "text-surface-variant")
              }
            />
          ))}
        </div>
        {data.focusArea ? (
          <span className="text-[10px] text-muted bg-surface px-1.5 py-0.5 rounded">
            {data.focusArea}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted">
        <span>{data.coach}</span>
        <span>{dateLabel}</span>
      </div>
    </div>
  );
}
