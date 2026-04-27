"use client";

import { Search } from "lucide-react";

export interface ContextItem {
  title: string;
  meta: string;
  active?: boolean;
}

export interface QuickQuestion {
  text: string;
}

interface ContextRailProps {
  contextItems: ContextItem[];
  quickQuestions: QuickQuestion[];
  onPickQuestion: (text: string) => void;
}

/**
 * Venstre kontekst-rail for AI Coach (v2).
 * Viser aktive datakilder + hurtigsporsmal.
 */
export function ContextRail({
  contextItems,
  quickQuestions,
  onPickQuestion,
}: ContextRailProps) {
  return (
    <aside
      className="border-r border-[color:var(--color-line)] bg-[#F5F8F7] overflow-y-auto"
      style={{ padding: "20px 16px" }}
    >
      <h4 className="m-0 mb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-[#7A8C85]">
        Kontekst · aktiv
      </h4>
      {contextItems.map((item, idx) => (
        <div
          key={idx}
          className={[
            "p-2.5 mb-2 cursor-pointer rounded-lg border bg-card transition-colors",
            item.active
              ? "border-[#AF52DE] bg-[#FAF5FF]"
              : "border-[color:var(--color-line)] hover:border-[#AF52DE]",
          ].join(" ")}
        >
          <div className="text-xs font-semibold text-ink">{item.title}</div>
          <div className="font-mono text-[10px] text-[#5A6E66] mt-0.5">
            {item.meta}
          </div>
        </div>
      ))}

      <h4 className="mt-5 mb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-[#7A8C85] flex items-center gap-1.5">
        <Search className="w-3 h-3" />
        Hurtigsporsmal
      </h4>
      {quickQuestions.map((q, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onPickQuestion(q.text)}
          className="w-full text-left p-2.5 mb-2 rounded-lg border border-[#AF52DE]/20 bg-[#FAF5FF] hover:border-[#AF52DE] transition-colors"
        >
          <div className="text-xs font-semibold text-ink">{q.text}</div>
        </button>
      ))}
    </aside>
  );
}
