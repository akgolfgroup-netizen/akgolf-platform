"use client";

import { Flag, Sparkles, ArrowRight, CalendarPlus } from "lucide-react";

interface FocusStripProps {
  weekNumber: number;
  focusText: string;
  fromMeta: string;
  aiSuggestionLabel?: string;
  aiSubLabel?: string;
}

export function FocusStrip({
  weekNumber,
  focusText,
  fromMeta,
  aiSuggestionLabel = "Generer økt for fredag",
  aiSubLabel = "AI · 3-15 ledig kl 14",
}: FocusStripProps) {
  return (
    <div
      className="grid gap-3.5 mb-5"
      style={{ gridTemplateColumns: "1fr auto auto" }}
    >
      {/* Focus card */}
      <div
        className="flex items-center gap-3.5 rounded-[14px] px-5 py-3.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(209,248,67,0.14), rgba(209,248,67,0.04))",
          border: "1px solid rgba(209,248,67,0.28)",
        }}
      >
        <div
          className="w-9 h-9 rounded-[10px] grid place-items-center shrink-0"
          style={{ background: "#D1F843", color: "#0A1F18" }}
        >
          <Flag className="w-4.5 h-4.5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{
              color: "#D1F843",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            Ukens fokus · uke {weekNumber}
          </div>
          <div className="text-[14px] text-white font-semibold mt-0.5 leading-[1.35]">
            {focusText}
          </div>
          <div
            className="font-mono text-[10px] mt-1 tracking-[0.06em]"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {fromMeta}
          </div>
        </div>
      </div>

      {/* AI CTA */}
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-[14px] px-5 transition-transform hover:-translate-y-px"
        style={{
          background: "#D1F843",
          color: "#0A1F18",
          border: "none",
          fontWeight: 800,
          fontSize: "13px",
          letterSpacing: "-0.005em",
        }}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-left">
          {aiSuggestionLabel}
          <span
            className="block font-mono text-[9px] uppercase tracking-[0.10em] opacity-65 mt-0.5 font-bold"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {aiSubLabel}
          </span>
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Export */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-[14px] px-4.5 text-[13px] font-semibold"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "#fff",
          padding: "0 18px",
        }}
      >
        <CalendarPlus className="w-3.5 h-3.5 opacity-70" />
        Eksporter til Apple/Google
      </button>
    </div>
  );
}
