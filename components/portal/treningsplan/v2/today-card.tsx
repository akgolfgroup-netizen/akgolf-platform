import Link from "next/link";
import { Check, CheckCircle2, MessageCircle, Play, X } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import type { V2EventLite } from "./types";

interface TodayExercise {
  id: string;
  name: string;
  meta?: string;
  durationMinutes: number;
  done: boolean;
}

export function TodayCard({
  event,
  exercises,
  coachName,
  weekDetailHref,
}: {
  event: V2EventLite;
  exercises: TodayExercise[];
  coachName?: string;
  weekDetailHref: string;
}) {
  const totalMin = exercises.reduce((s, x) => s + x.durationMinutes, 0) || event.dur;

  return (
    <div
      className={cn(
        "relative mb-5 overflow-hidden rounded-2xl border-[1.5px] p-7",
        "border-accent/30",
        "bg-[linear-gradient(135deg,rgba(15,31,24,0.95),rgba(10,31,24,1))]",
      )}
    >
      <span className="absolute inset-x-0 top-0 h-[3px] bg-accent" />

      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
        {event.title}
        {coachName ? ` · av ${coachName}` : ""}
      </div>
      <h2 className="m-0 mb-1.5 text-[28px] font-extrabold tracking-[-0.025em] text-white font-[family-name:var(--font-inter-tight)]">
        Dagens økt
      </h2>
      {event.description && (
        <p className="m-0 mb-4 text-[14px] text-white/70">{event.description}</p>
      )}

      <div className="flex flex-col gap-2.5">
        {exercises.map((ex, i) => (
          <ExerciseRow key={ex.id} ex={ex} index={i + 1} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={weekDetailHref}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-4 py-2",
            "bg-accent text-ink",
            "text-[12px] font-bold uppercase tracking-[0.06em]",
            "hover:brightness-95 transition",
          )}
        >
          <Play className="h-3.5 w-3.5" /> Start hele økten
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white/85 hover:bg-white/[0.08] transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Spør coach
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-white/55 hover:text-white/85 transition-colors"
        >
          <X className="h-3.5 w-3.5" /> Hopp over i dag
        </button>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.06em] text-white/40">
        Totalt {totalMin} min
      </div>
    </div>
  );
}

function ExerciseRow({ ex, index }: { ex: TodayExercise; index: number }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[32px_1fr_auto_auto] items-center gap-3.5 rounded-[10px] border px-4 py-3.5",
        "cursor-pointer transition",
        ex.done
          ? "border-success/20 bg-success/5 opacity-85"
          : "border-white/[0.05] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]",
      )}
    >
      <div
        className={cn(
          "grid h-[30px] w-[30px] place-items-center rounded-lg font-mono text-[11px] font-bold",
          ex.done
            ? "bg-success/20 text-success"
            : "bg-accent/15 text-accent",
        )}
      >
        {ex.done ? <Check className="h-3.5 w-3.5" /> : index}
      </div>
      <div>
        <div className={cn("text-[14px] font-semibold", ex.done ? "text-white/50 line-through" : "text-white")}>
          {ex.name}
        </div>
        {ex.meta && <div className="mt-0.5 text-[12px] text-white/55">{ex.meta}</div>}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-white/70">
        {ex.durationMinutes} min
      </div>
      {ex.done ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : (
        <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-accent">
          Start
        </span>
      )}
    </div>
  );
}
