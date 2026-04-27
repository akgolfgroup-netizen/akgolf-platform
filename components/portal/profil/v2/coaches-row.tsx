import { CalendarPlus, MessageCircle } from "lucide-react";
import { SectionHeading } from "./section-heading";

export interface CoachItem {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
}

interface CoachesRowProps {
  coaches: CoachItem[];
}

export function CoachesRow({ coaches }: CoachesRowProps) {
  if (coaches.length === 0) return null;
  return (
    <>
      <SectionHeading title="Mine coacher" sub={`${coaches.length} AKTIVE`} />
      <div className="grid gap-3 sm:grid-cols-2">
        {coaches.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-[#1a4a3a] bg-[#0D2E23] px-4 py-3.5"
          >
            <div
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-sm font-extrabold text-[#0A1F18]"
              style={{ background: c.color }}
            >
              {c.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">{c.name}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white/50">
                {c.role}
              </div>
            </div>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                aria-label="Send melding"
                className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Book økt"
                className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
