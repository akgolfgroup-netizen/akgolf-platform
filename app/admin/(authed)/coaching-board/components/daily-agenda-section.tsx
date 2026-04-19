"use client";

import Link from "next/link";
import { ArrowRight, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { CoachingSignal, SignalSeverity } from "@/lib/portal/coaching-signals";

interface DailyAgendaSectionProps {
  signals: CoachingSignal[];
}

const SEVERITY_STYLES: Record<
  SignalSeverity,
  { bg: string; border: string; icon: React.ReactNode; label: string }
> = {
  high: {
    bg: "bg-error-light",
    border: "border-l-4 border-l-[var(--color-error)]",
    icon: <AlertCircle className="h-4 w-4 text-error-text" />,
    label: "Høy",
  },
  medium: {
    bg: "bg-warning-light",
    border: "border-l-4 border-l-[var(--color-warning)]",
    icon: <AlertTriangle className="h-4 w-4 text-warning-text" />,
    label: "Medium",
  },
  low: {
    bg: "bg-[var(--hg-surface-raised)]",
    border: "border-l-4 border-l-[var(--hg-border)]",
    icon: <Info className="h-4 w-4 text-[var(--hg-text-muted)]" />,
    label: "Lav",
  },
};

export function DailyAgendaSection({ signals }: DailyAgendaSectionProps) {
  const prioritized = signals
    .filter((s) => s.priorityScore >= 20)
    .slice(0, 8);

  if (prioritized.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--hg-border-subtle)] bg-[var(--hg-surface)] p-10 text-center">
        <div className="text-sm font-medium text-[var(--hg-text)]">
          Ingen påtrengende varsler akkurat nå
        </div>
        <div className="text-xs text-[var(--hg-text-muted)] mt-1">
          Spillerne dine er på rett vei. Se spillerlisten under for detaljer.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--hg-text)] tracking-[-0.01em]">
          Dagsagenda
        </h2>
        <span className="text-[11px] text-[var(--hg-text-muted)] tabular-nums">
          {prioritized.length} spillere trenger oppmerksomhet
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {prioritized.map((signal) => {
          const style = SEVERITY_STYLES[signal.severity];
          return (
            <div
              key={signal.userId}
              className={`rounded-xl bg-[var(--hg-surface)] p-4 ${style.border} shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {style.icon}
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                      {style.label}
                    </span>
                    <span className="text-[11px] tabular-nums text-[var(--hg-text-muted)]">
                      ({signal.priorityScore})
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[var(--hg-text)] truncate">
                    {signal.playerName ?? "Ukjent"}
                  </div>
                  <div className="text-xs text-[var(--hg-text-secondary)] mt-0.5">
                    {signal.headline}
                  </div>
                </div>

                <Link
                  href={`/admin/elever/${signal.userId}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                >
                  Åpne
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {signal.evidence.length > 0 && (
                <div className="mt-3 space-y-1">
                  {signal.evidence.slice(0, 3).map((e, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 text-[11px]"
                    >
                      <span className="text-[var(--hg-text-muted)]">
                        {e.label}
                      </span>
                      {e.value && (
                        <span className="tabular-nums text-[var(--hg-text-secondary)]">
                          {e.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {signal.recommendedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--hg-border-subtle)] space-y-1.5">
                  {signal.recommendedActions.slice(0, 2).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-[var(--color-primary)] mt-0.5">
                        →
                      </span>
                      <div className="flex-1">
                        <div className="text-[var(--hg-text)]">{rec.label}</div>
                        {rec.detail && (
                          <div className="text-[11px] text-[var(--hg-text-muted)] mt-0.5">
                            {rec.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
