"use client";

/**
 * PlanSuggestionInbox — viser PENDING forslag på spillerens treningsplan.
 *
 * Spilleren kan:
 *   - Godta forslaget (diff appliseres på target)
 *   - Avslå forslaget (valgfri begrunnelse)
 *
 * Sprint 2 — forslags-modus.
 */

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type {
  PlanSuggestionView,
  SessionSuggestionPayload,
} from "@/lib/portal/training/plan-suggestion-types";

const SESSION_FIELD_LABELS: Record<string, string> = {
  title: "Tittel",
  description: "Beskrivelse",
  durationMinutes: "Varighet (min)",
  focusArea: "Fokus",
  facilityId: "Fasilitet",
  dayOfWeek: "Ukedag",
};

const DAY_NAMES = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

export interface PlanSuggestionInboxProps {
  suggestions: PlanSuggestionView[];
  onAccept: (suggestionId: string) => Promise<{ success: boolean; error?: string }>;
  onReject: (
    suggestionId: string,
    reason?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export function PlanSuggestionInbox({
  suggestions,
  onAccept,
  onReject,
}: PlanSuggestionInboxProps) {
  if (suggestions.length === 0) return null;

  return (
    <section
      aria-label="Forslag fra coach"
      className="rounded-2xl border border-secondary-fixed/60 bg-secondary-fixed/10 p-4"
    >
      <header className="mb-3 flex items-center gap-2">
        <Icon name="rule" size={18} className="text-on-surface" />
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-on-surface">
          {suggestions.length === 1
            ? "1 forslag fra coachen"
            : `${suggestions.length} forslag fra coachen`}
        </h2>
      </header>

      <div className="space-y-3">
        {suggestions.map((s) => (
          <SuggestionCard
            key={s.id}
            suggestion={s}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </div>
    </section>
  );
}

interface SuggestionCardProps {
  suggestion: PlanSuggestionView;
  onAccept: (id: string) => Promise<{ success: boolean; error?: string }>;
  onReject: (id: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
}

function SuggestionCard({ suggestion, onAccept, onReject }: SuggestionCardProps) {
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    setError(null);
    startTransition(async () => {
      const res = await onAccept(suggestion.id);
      if (!res.success) setError(res.error ?? "Kunne ikke godta forslaget");
    });
  };

  const handleReject = () => {
    setError(null);
    startTransition(async () => {
      const res = await onReject(suggestion.id, reason);
      if (!res.success) {
        setError(res.error ?? "Kunne ikke avslå forslaget");
      } else {
        setRejecting(false);
        setReason("");
      }
    });
  };

  const diff = suggestion.diff as SessionSuggestionPayload;
  const fields = Object.keys(diff.after);

  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3">
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface">
            {suggestion.proposedBy.name ?? "Coach"} foreslår endring
          </span>
          <p className="mt-0.5 text-sm font-semibold text-on-surface">
            {suggestion.targetLabel}
          </p>
        </div>
        <span className="font-mono text-[10px] text-on-surface-variant">
          {format(new Date(suggestion.createdAt), "d. MMM", { locale: nb })}
        </span>
      </header>

      {suggestion.rationale && (
        <p className="mb-3 rounded-lg bg-surface-container-low p-2 text-sm text-on-surface italic">
          «{suggestion.rationale}»
        </p>
      )}

      <dl className="mb-3 space-y-1.5">
        {fields.map((field) => (
          <DiffRow
            key={field}
            field={field}
            before={(diff.before as Record<string, unknown>)[field]}
            after={(diff.after as Record<string, unknown>)[field]}
          />
        ))}
      </dl>

      {error && (
        <p className="mb-2 text-[11px] text-error" role="alert">
          {error}
        </p>
      )}

      {!rejecting ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAccept}
            disabled={pending}
            className="flex-1 rounded-lg bg-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Godtar…" : "Godta"}
          </button>
          <button
            type="button"
            onClick={() => setRejecting(true)}
            disabled={pending}
            className="flex-1 rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-surface-variant hover:border-error hover:text-error disabled:opacity-50"
          >
            Avslå
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 500))}
            placeholder="Begrunnelse (valgfritt)…"
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setRejecting(false);
                setReason("");
                setError(null);
              }}
              className="rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-surface-variant hover:bg-surface-container-high"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="flex-1 rounded-lg bg-error px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-error hover:bg-error/90 disabled:opacity-50"
            >
              {pending ? "Avslår…" : "Bekreft avslag"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

interface DiffRowProps {
  field: string;
  before: unknown;
  after: unknown;
}

function DiffRow({ field, before, after }: DiffRowProps) {
  const label = SESSION_FIELD_LABELS[field] ?? field;
  return (
    <div className="grid grid-cols-[80px_1fr_auto_1fr] items-baseline gap-2 text-xs">
      <dt className="font-mono text-[10px] uppercase tracking-wide text-on-surface-variant">
        {label}
      </dt>
      <dd className={cn("text-on-surface-variant line-through", "truncate")}>
        {formatValue(field, before)}
      </dd>
      <Icon name="arrow_forward" size={12} className="text-on-surface-variant" />
      <dd className="truncate font-medium text-on-surface">
        {formatValue(field, after)}
      </dd>
    </div>
  );
}

function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "dayOfWeek" && typeof value === "number") {
    return DAY_NAMES[value - 1] ?? String(value);
  }
  if (field === "durationMinutes" && typeof value === "number") {
    return `${value} min`;
  }
  return String(value);
}
