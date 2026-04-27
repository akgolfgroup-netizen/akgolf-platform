"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";

export interface TimelineEntry {
  id: string;
  date: Date;
  title: string;
  meta: string;
  tags: string[];
  variant?: "default" | "chip" | "round";
}

interface TimelineListProps {
  entries: TimelineEntry[];
}

const dotColor: Record<string, string> = {
  default: "#D1F843",
  chip: "#AF52DE",
  round: "#0A1F18",
};

export function TimelineList({ entries }: TimelineListProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-card border border-[color:var(--color-line)] rounded-2xl p-5">
        <p className="text-sm text-ink-muted m-0">
          Ingen okter logget enna. Logg din forste okt for a komme i gang.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[color:var(--color-line)] rounded-2xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="m-0 text-sm font-bold">Siste okter</h3>
        <div className="font-mono text-[10px] text-[#7A8C85] tracking-wider uppercase">
          {format(entries[0].date, "d. MMM", { locale: nb })} →{" "}
          {format(entries[entries.length - 1].date, "d. MMM", { locale: nb })}
        </div>
      </div>
      <div className="flex flex-col">
        {entries.map((e, idx) => {
          const variant = e.variant ?? "default";
          const isLast = idx === entries.length - 1;
          const dn = format(e.date, "d.MM", { locale: nb });
          const dnDay = format(e.date, "EEE", { locale: nb }).toUpperCase();
          return (
            <div
              key={e.id}
              className="grid gap-3 py-3 relative"
              style={{ gridTemplateColumns: "80px 14px 1fr" }}
            >
              {!isLast ? (
                <div
                  className="absolute w-[2px] bg-[color:var(--color-line)]"
                  style={{ left: 89, top: 20, bottom: -10 }}
                />
              ) : null}
              <div className="font-mono text-[10px] text-[#7A8C85] tracking-wider text-right pt-1.5">
                {dn}
                <br />
                <span className="text-ink font-bold">{dnDay}</span>
              </div>
              <div
                className="w-3.5 h-3.5 rounded-full bg-card mt-1.5 relative z-[2]"
                style={{
                  border: `3px solid ${dotColor[variant]}`,
                }}
              />
              <div className="bg-[#F5F8F7] rounded-xl px-3.5 py-3">
                <div className="text-[13px] font-semibold text-ink">
                  {e.title}
                </div>
                <div className="text-xs text-[#5A6E66] mt-0.5">{e.meta}</div>
                {e.tags.length > 0 ? (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-ink/5 text-[#324D45] tracking-wider uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
