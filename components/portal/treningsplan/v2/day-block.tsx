import { Check, ExternalLink, Play, Video } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { AkTag } from "./ak-tag";
import { pyramidToAkTag, type V2Exercise } from "./types";

const DOWS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export interface DayBlockExercise extends V2Exercise {
  meta?: string[];
  durationMinutes: number;
  done: boolean;
  hasVideo?: boolean;
}

export interface DayBlockData {
  /** 0–6 (Mon=0) */
  weekdayIndex: number;
  dayNumber: number;
  isToday?: boolean;
  isRest?: boolean;
  title: string;
  meta: string;
  /** Hovedfokus-pyramide, brukes for tag */
  focus?: string;
  /** Statustekst i hjørnet, f.eks. "3 / 3 ferdig" */
  statusText?: string;
  /** "Logget" pill etter statusen */
  loggedPill?: boolean;
  /** Vis Start-knapp for økten (ikke ferdig) */
  showStart?: boolean;
  exercises: DayBlockExercise[];
}

export function DayBlock({ day }: { day: DayBlockData }) {
  return (
    <div
      className={cn(
        "mb-3 rounded-2xl border p-6",
        "border-[var(--akgolf-line-dark,#1a4a3a)] bg-[var(--akgolf-card-dark,#0D2E23)]",
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center justify-between border-b border-dashed pb-3.5",
          "border-[var(--akgolf-line-dark,#1a4a3a)]",
        )}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "grid h-11 w-11 place-items-center rounded-[10px] text-center",
              day.isRest
                ? "border border-dashed border-white/10 bg-transparent"
                : day.isToday
                  ? "border border-[rgba(209,248,67,0.25)] bg-[rgba(209,248,67,0.10)]"
                  : "bg-white/[0.05]",
            )}
          >
            <div
              className={cn(
                "font-mono text-[8px] uppercase tracking-[0.12em]",
                day.isToday
                  ? "text-[var(--akgolf-accent,#D1F843)]"
                  : "text-white/55",
              )}
            >
              {DOWS[day.weekdayIndex]}
            </div>
            <div
              className={cn(
                "font-sans text-[16px] font-extrabold leading-none tracking-[-0.02em]",
                day.isToday
                  ? "text-[var(--akgolf-accent,#D1F843)]"
                  : "text-white",
              )}
            >
              {String(day.dayNumber).padStart(2, "0")}
            </div>
          </div>
          <div>
            <div
              className={cn(
                "text-[16px] font-bold",
                day.isRest ? "text-white/50" : "text-white",
              )}
            >
              {day.title}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white/55">
              {day.meta}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white/55">
          {day.focus && <AkTag kind={pyramidToAkTag(day.focus)} />}
          {day.statusText && <span>{day.statusText}</span>}
          {day.loggedPill && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(118,193,156,0.18)] px-2 py-0.5 text-[#6FCBA1]">
              ✓ Logget
            </span>
          )}
          {day.showStart && !day.isRest && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--akgolf-accent,#D1F843)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#0A1F18]"
            >
              <Play className="h-3 w-3" /> Start
            </button>
          )}
        </div>
      </div>

      {!day.isRest && (
        <div className="space-y-1.5">
          {day.exercises.map((ex) => (
            <ExerciseRow key={ex.id} ex={ex} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseRow({ ex }: { ex: DayBlockExercise }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[28px_1fr_auto_auto] items-center gap-3.5 rounded-[10px] px-3.5 py-3.5",
        "bg-white/[0.03] transition hover:bg-white/[0.06]",
      )}
    >
      <span
        className={cn(
          "grid h-[22px] w-[22px] place-items-center rounded-full border-2",
          ex.done
            ? "border-[var(--akgolf-accent,#D1F843)] bg-[var(--akgolf-accent,#D1F843)]"
            : "border-white/20",
        )}
      >
        {ex.done && <Check className="h-3 w-3 stroke-[3] text-[#0A1F18]" />}
      </span>
      <div>
        <div
          className={cn(
            "text-[14px] font-semibold",
            ex.done ? "text-white/50 line-through" : "text-white",
          )}
        >
          {ex.name}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[12px] text-white/55">
          {ex.pyramid && <AkTag kind={pyramidToAkTag(ex.pyramid)} />}
          {ex.meta?.map((m, i) => <span key={i}>{m}</span>)}
          {ex.hasVideo && (
            <span className="inline-flex items-center gap-1">
              <Video className="h-2.5 w-2.5 text-[var(--akgolf-accent,#D1F843)]" />
              Coach video-notat
            </span>
          )}
          {ex.testNumber && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              🔬 Test
            </span>
          )}
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-white/65">
        {ex.durationMinutes} min
      </span>
      <ExternalLink className="h-4 w-4 text-white/50" />
    </div>
  );
}
