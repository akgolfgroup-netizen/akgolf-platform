"use client";

/**
 * RoiCard — bruker BentoCard-pattern (glass dark).
 * Viser SG/time per aktivitet med evidens-insight.
 */

import {
  BentoCard,
  BentoEyebrow,
  MonoLabel,
} from "@/components/portal/patterns";
import type { RoiRow } from "../actions";

interface RoiCardProps {
  rows: RoiRow[];
}

export function RoiCard({ rows }: RoiCardProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest shadow-card p-5 text-center">
        <MonoLabel size="xs" uppercase className="text-on-surface-variant block">
          Hvor kommer slagene fra?
        </MonoLabel>
        <p className="mt-3 text-sm text-on-surface-variant/80">
          Ikke nok treningslogger til å regne ROI enda. Registrer økter for å se
          hvor du får mest utvikling per time.
        </p>
      </div>
    );
  }

  const maxPerHour = Math.max(...rows.map((r) => r.sgPerHour), 0.001);
  const best = rows[0];
  const onCourse = rows.find((r) => r.label === "Banegolf 18 hull");
  const ratio =
    best && onCourse && onCourse.sgPerHour > 0
      ? Math.round(best.sgPerHour / onCourse.sgPerHour)
      : null;

  return (
    <BentoCard variant="glass" padding="lg">
      <BentoEyebrow>Hvor kommer slagene fra · 90 dager</BentoEyebrow>

      <div className="mt-4 space-y-2.5">
        {rows.map((r) => {
          const fillPct = Math.min(100, (r.sgPerHour / maxPerHour) * 100);
          return (
            <div key={r.label} className="grid grid-cols-[1fr_auto] gap-x-4">
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm font-medium text-surface/90 truncate">
                    {r.label}
                  </span>
                  <span className="text-[11px] text-surface/50 tabular-nums whitespace-nowrap">
                    {r.hours}t · {r.sgDelta > 0 ? "+" : ""}
                    {r.sgDelta.toFixed(2)} SG
                  </span>
                </div>
                <div className="mt-1 h-[3px] rounded-full bg-surface-container-lowest/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-secondary-fixed"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>
              <div className="text-right text-sm font-semibold tabular-nums text-surface min-w-[72px]">
                {r.sgPerHour.toFixed(3)}
                <span className="block text-[10px] font-normal text-surface/45 mt-0.5">
                  SG/time
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {ratio !== null && ratio >= 2 && (
        <div className="mt-5 rounded-lg bg-secondary-fixed/15 border border-secondary-fixed/25 px-3 py-2.5 text-xs leading-relaxed text-secondary-fixed">
          1 time målrettet ferdighet gir ~{ratio}× mer utvikling enn 1 time
          banegolf. Evidens fra din egen trening.
        </div>
      )}
    </BentoCard>
  );
}
