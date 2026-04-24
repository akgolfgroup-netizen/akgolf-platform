"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { MonoLabel } from "@/components/portal/patterns";
import {
  getLatestAggregatedInsights,
  regenerateAggregatedInsights,
  type AggregatedInsightsPayload,
} from "@/app/portal/(dashboard)/trackman/actions";

interface Props {
  initial: AggregatedInsightsPayload;
}

const SEVERITY_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  positive: { bg: "bg-success/10", text: "text-success", icon: "trending_up" },
  attention: { bg: "bg-warning/10", text: "text-warning", icon: "priority_high" },
  neutral: { bg: "bg-surface-container", text: "text-on-surface-variant", icon: "info" },
};

function formatCooldown(until: string): string {
  const ms = new Date(until).getTime() - Date.now();
  if (ms <= 0) return "";
  const hours = Math.ceil(ms / (1000 * 60 * 60));
  return `Oppdateres om ${hours} time${hours !== 1 ? "r" : ""}`;
}

export function AggregatedInsightsCard({ initial }: Props) {
  const [payload, setPayload] = useState<AggregatedInsightsPayload>(initial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const cooldownActive =
    payload.cooldownUntil !== null && new Date(payload.cooldownUntil) > new Date();

  const handleRegenerate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const fresh = cooldownActive
          ? await getLatestAggregatedInsights()
          : await regenerateAggregatedInsights();
        setPayload(fresh);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Kunne ikke oppdatere innsikter");
      }
    });
  };

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <MonoLabel size="xs" uppercase className="mb-1 block text-on-surface-variant">
            AI-innsikter
          </MonoLabel>
          <h2 className="text-lg font-semibold text-on-surface">
            Mønstre på tvers av dine siste sesjoner
          </h2>
          {payload.generatedAt && (
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Generert{" "}
              {new Date(payload.generatedAt).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {cooldownActive && payload.cooldownUntil && (
                <> · {formatCooldown(payload.cooldownUntil)}</>
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isPending || cooldownActive}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
          title={cooldownActive ? formatCooldown(payload.cooldownUntil!) : "Generer nye innsikter"}
        >
          <Icon
            name={isPending ? "progress_activity" : "refresh"}
            className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
          />
          {isPending ? "Oppdaterer..." : payload.insights.length === 0 ? "Generer" : "Oppdater"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-error/10 p-3 text-sm text-error">{error}</p>
      )}

      {payload.insights.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-surface py-8 text-center">
          <Icon name="insights" className="h-8 w-8 text-on-surface-variant opacity-40" />
          <p className="text-sm text-on-surface-variant">
            Ingen innsikter ennå. Last opp TrackMan-data og klikk &ldquo;Generer&rdquo;.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {payload.insights.map((insight, idx) => {
            const style = SEVERITY_STYLE[insight.severity] ?? SEVERITY_STYLE.neutral;
            return (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-outline-variant/20 bg-surface p-4"
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${style.bg}`}>
                  <Icon name={style.icon} className={`h-4 w-4 ${style.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold text-on-surface">
                    {insight.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-on-surface-variant">
                    {insight.body}
                  </p>
                </div>
                <MonoLabel size="xs" uppercase className="flex-shrink-0 text-on-surface-variant/70">
                  {insight.category}
                </MonoLabel>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
