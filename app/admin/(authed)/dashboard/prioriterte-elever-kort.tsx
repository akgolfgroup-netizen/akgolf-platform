"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";

export interface PrioritertElev {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  adherencePct: number;
  plannedSessionsThisWeek: number;
  completedSessionsThisWeek: number;
  lastActivity: Date | null;
  currentHcp: number | null;
  hcpTrend: "down" | "up" | "same" | null;
}

function formatLastActivity(date: Date | null): string {
  if (!date) return "Aldri";
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "1 dag siden";
  if (diffDays < 7) return `${diffDays} dager siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
  return `${Math.floor(diffDays / 30)} mnd siden`;
}

function AdherenceBadge({ pct }: { pct: number }) {
  const colorClass =
    pct >= 80
      ? "bg-success/10 text-success"
      : pct >= 50
        ? "bg-warning/10 text-warning"
        : "bg-error/10 text-error";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
        colorClass
      )}
    >
      {pct}%
    </span>
  );
}

export function PrioriterteEleverKort({ elever }: { elever: PrioritertElev[] }) {
  const allGood = elever.length === 0 || elever.every((e) => e.adherencePct >= 80 && e.lastActivity && new Date().getTime() - new Date(e.lastActivity).getTime() < 2 * 24 * 60 * 60 * 1000);

  if (allGood) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-success/10 text-success">
            <Icon name="check_circle" className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-on-surface">
            Prioriterte elever denne uken
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Icon name="emoji_events" className="w-10 h-10 text-success/40 mb-3" />
          <p className="text-sm font-medium text-on-surface">Alle elever folger planen!</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Ingen trenger ekstra oppmerksomhet denne uken
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-error/10 text-error">
            <Icon name="priority_high" className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-on-surface">
            Trenger oppmerksomhet
          </h3>
        </div>
        <Link
          href="/admin/elever/oversikt"
          className="text-xs text-on-surface-variant hover:text-on-surface font-medium inline-flex items-center gap-1 transition-colors"
        >
          Se alle
          <Icon name="arrow_forward" className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {elever.map((elev) => (
          <div
            key={elev.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            {elev.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={elev.image}
                alt={elev.name ?? ""}
                className="w-9 h-9 rounded-full object-cover bg-surface-container shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {elev.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">
                {elev.name ?? "Ukjent"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <AdherenceBadge pct={elev.adherencePct} />
                <span className="text-[10px] text-on-surface-variant">
                  {formatLastActivity(elev.lastActivity)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {elev.currentHcp !== null && (
                <span className="text-xs font-medium text-on-surface tabular-nums">
                  {elev.currentHcp.toFixed(1)}
                  {elev.hcpTrend === "down" && (
                    <Icon name="trending_down" className="w-3.5 h-3.5 text-success inline ml-0.5" />
                  )}
                  {elev.hcpTrend === "up" && (
                    <Icon name="trending_up" className="w-3.5 h-3.5 text-error inline ml-0.5" />
                  )}
                </span>
              )}
              <Link href={`/admin/treningsplan?studentId=${elev.id}`}>
                <button className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface">
                  <Icon name="notebook" className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
