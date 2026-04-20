"use client";




import { Icon } from "@/components/ui/icon";
/**
 * CoachingFeedbackWidget — siste tilbakemelding fra instruktør.
 *
 * Data-kilde: Message fra instruktør / CoachingSession
 * Brukes på: P1 (Dashboard), PB01 (AI-coach), PB08, PB10, N04
 */
export function CoachingFeedbackWidget() {
  // TODO: Koble til reelle data via server action
  const feedback = {
    coach: "Anders K.",
    date: "15. apr 2026",
    rating: 4,
    text: "Bra progresjon på approach denne uken. Fokuser på ryggvinkel i nedswing — du har tendens til å stå opp litt for tidlig.",
    focusArea: "Approach",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Icon name="format_quote" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-text leading-relaxed line-clamp-4">
          {feedback.text}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon name="star"
              key={i}
              className={
                "w-3 h-3 " +
                (i < feedback.rating
                  ? "text-secondary-fixed fill-accent-cta"
                  : "text-surface-variant")
              } />
          ))}
        </div>
        <span className="text-[10px] text-muted bg-surface px-1.5 py-0.5 rounded">
          {feedback.focusArea}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted">
        <span>{feedback.coach}</span>
        <span>{feedback.date}</span>
      </div>
    </div>
  );
}
