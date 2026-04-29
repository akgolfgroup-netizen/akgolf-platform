"use client";

import { FullDetailLink } from "../accordion-section";

export interface TimelineItem {
  when: string;
  what: string;
  who: string;
  rest?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  detailMeta: string;
  detailHref: string;
  emptyLabel?: string;
}

export function TimelineSection({
  items,
  detailMeta,
  detailHref,
  emptyLabel,
}: TimelineProps) {
  if (items.length === 0) {
    return (
      <>
        <div className="rounded-xl bg-white/5 p-6 text-center text-[13px] text-white/55">
          {emptyLabel ?? "Ingen aktivitet registrert ennå."}
        </div>
        <FullDetailLink meta={detailMeta} href={detailHref} />
      </>
    );
  }
  return (
    <>
      <div
        className="mt-3.5 flex flex-col gap-3.5 pl-3"
        style={{ borderLeft: "2px dashed rgba(255,255,255,0.10)" }}
      >
        {items.map((it, idx) => (
          <div key={idx} className="relative pl-4">
            <span
              className="absolute"
              style={{
                left: -19,
                top: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: it.rest
                  ? "rgba(255,255,255,0.30)"
                  : "#D1F843",
                boxShadow: it.rest
                  ? "0 0 0 3px rgba(255,255,255,0.05)"
                  : "0 0 0 3px rgba(209,248,67,0.20)",
              }}
            />
            <div
              className="font-mono text-[10px] uppercase"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {it.when}
            </div>
            <div className="mt-0.5 text-[13px] font-semibold leading-snug text-white">
              {it.what}
            </div>
            <div
              className="mt-0.5 font-mono text-[10px]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {it.who}
            </div>
          </div>
        ))}
      </div>
      <FullDetailLink meta={detailMeta} href={detailHref} />
    </>
  );
}
