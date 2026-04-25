"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { TRENINGSOMRADER } from "@/lib/portal/training/ak-taxonomy";
import { markDrillCompleted } from "@/app/portal/(dashboard)/dashboard-actions";
import type { DrillOfTheDay } from "@/app/portal/(dashboard)/dashboard-types";

interface Props {
  drill: DrillOfTheDay | null;
}

const AREA_LABEL = new Map(TRENINGSOMRADER.map((a) => [a.code, a.label]));

export function DrillOfTheDayCard({ drill }: Props) {
  const [completed, setCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!drill) {
    return (
      <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
              Dagens drill
            </p>
            <h3 className="mt-1 text-xl font-bold text-primary">Ingen drills i bibliotek</h3>
            <p className="mt-1 text-sm text-primary/60">
              Coachen din legger til drills når dere har gjennomført en økt.
            </p>
          </div>
          <Icon name="sports_golf" size={48} className="text-primary/20" />
        </div>
      </div>
    );
  }

  const areaLabel = AREA_LABEL.get(drill.area) ?? drill.area;

  const handleComplete = () => {
    startTransition(async () => {
      try {
        await markDrillCompleted(drill.id);
        setCompleted(true);
      } catch {
        // silent — revalidate handles refresh on success
      }
    });
  };

  return (
    <div className="bento-card col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 lg:col-span-12">
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary-fixed">
          <Icon name="sports_golf" filled size={28} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
              Dagens drill
            </p>
            {drill.isFavorite ? (
              <Icon name="favorite" filled size={12} className="text-error" />
            ) : null}
          </div>
          <h3 className="mt-1 text-xl font-bold leading-tight text-primary">{drill.name}</h3>
          {drill.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-primary/70">{drill.description}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase text-primary/60">
            <span className="inline-flex items-center gap-1">
              <Icon name="category" size={14} />
              {areaLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="schedule" size={14} />
              {drill.durationMinutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="speed" size={14} />
              Nivå {drill.difficulty}
            </span>
            {drill.equipment.length > 0 ? (
              <span className="inline-flex items-center gap-1">
                <Icon name="inventory_2" size={14} />
                {drill.equipment.slice(0, 3).join(", ")}
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={isPending || completed}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-surface transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
        >
          <Icon name={completed ? "check_circle" : "check"} filled={completed} size={16} />
          {completed ? "Gjort" : isPending ? "Lagrer …" : "Marker som gjort"}
        </button>
      </div>
    </div>
  );
}
