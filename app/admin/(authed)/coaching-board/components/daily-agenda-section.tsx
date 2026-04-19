"use client";

/**
 * DailyAgendaSection — følger mc-alert-list-mønster fra Mission Board wireframe.
 * Alert-rader med ikon + tittel + meta + tidsstempel + handlings-knapp.
 */

import Link from "next/link";
import { ArrowRight, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { MonoLabel } from "@/components/portal/patterns";
import type { CoachingSignal, SignalSeverity } from "@/lib/portal/coaching-signals";

interface DailyAgendaSectionProps {
  signals: CoachingSignal[];
}

const SEVERITY: Record<
  SignalSeverity,
  { icon: React.ReactNode; label: string; bg: string; text: string; border: string }
> = {
  high: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Høy",
    bg: "bg-error-light",
    text: "text-error-text",
    border: "border-l-4 border-l-[var(--color-error)]",
  },
  medium: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Medium",
    bg: "bg-warning-light",
    text: "text-warning-text",
    border: "border-l-4 border-l-[var(--color-warning)]",
  },
  low: {
    icon: <Info className="h-4 w-4" />,
    label: "Lav",
    bg: "bg-grey-100",
    text: "text-grey-500",
    border: "border-l-4 border-l-grey-300",
  },
};

export function DailyAgendaSection({ signals }: DailyAgendaSectionProps) {
  const prioritized = signals
    .filter((s) => s.priorityScore >= 20)
    .slice(0, 8);

  if (prioritized.length === 0) {
    return (
      <section className="rounded-xl bg-white shadow-card p-10 text-center">
        <div className="text-sm font-medium text-grey-900">
          Ingen påtrengende varsler akkurat nå
        </div>
        <div className="text-xs text-grey-400 mt-1">
          Spillerne dine er på rett vei. Se spillerlisten under for detaljer.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <MonoLabel size="xs" uppercase className="text-primary">
          Dagsagenda
        </MonoLabel>
        <span className="text-[11px] text-grey-400 tabular-nums">
          {prioritized.length} spillere trenger oppmerksomhet
        </span>
      </div>

      <ul className="rounded-xl bg-white shadow-card divide-y divide-grey-100 overflow-hidden">
        {prioritized.map((signal) => {
          const s = SEVERITY[signal.severity];
          return (
            <li
              key={signal.userId}
              className={`flex items-start gap-4 px-5 py-4 hover:bg-grey-50 transition-colors ${s.border}`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${s.bg} ${s.text}`}
              >
                {s.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-grey-900">
                    {signal.playerName ?? "Ukjent"}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                  <span className="text-[11px] text-grey-400 tabular-nums">
                    prioritet {signal.priorityScore}
                  </span>
                </div>
                <div className="mt-0.5 text-sm text-grey-500">
                  {signal.headline}
                </div>

                {signal.evidence.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-grey-400">
                    {signal.evidence.slice(0, 3).map((e, i) => (
                      <span key={i}>
                        {e.label}
                        {e.value && (
                          <span className="ml-1 tabular-nums text-grey-500">
                            {e.value}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {signal.recommendedActions[0] && (
                  <div className="mt-2 text-xs text-grey-700">
                    →{" "}
                    <span className="font-medium">
                      {signal.recommendedActions[0].label}
                    </span>
                    {signal.recommendedActions[0].detail && (
                      <span className="text-grey-400 ml-1">
                        · {signal.recommendedActions[0].detail}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Link
                href={`/admin/elever/${signal.userId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0 ml-2 whitespace-nowrap"
              >
                Åpne
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
