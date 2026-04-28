"use client";

import { ExternalLink } from "lucide-react";

interface CoachStripProps {
  initials: string;
  name: string;
  planLabel: string;
  onDetails?: () => void;
}

export function CoachStrip({
  initials,
  name,
  planLabel,
  onDetails,
}: CoachStripProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-[14px] px-5.5 py-4.5"
      style={{
        background: "#0D2E23",
        border: "1px solid #1A4A3A",
      }}
    >
      <div
        className="grid h-12 w-12 place-items-center rounded-full text-base font-bold"
        style={{ background: "#D1F843", color: "#0A1F18" }}
      >
        {initials}
      </div>
      <div className="flex-1">
        <div
          className="font-mono text-xs uppercase"
          style={{
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.08em",
          }}
        >
          Hovedcoach
        </div>
        <div className="mt-0.5 text-base font-bold text-white">{name}</div>
      </div>
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          background: "rgba(209,248,67,0.18)",
          color: "#D1F843",
        }}
      >
        {planLabel}
      </span>
      <button
        type="button"
        onClick={onDetails}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/10"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Plan-detaljer
      </button>
    </div>
  );
}
