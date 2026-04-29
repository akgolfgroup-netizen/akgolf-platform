"use client";

import { Download, Save } from "lucide-react";

export interface LabHeaderProps {
  sessionNumber?: string;
  isLive?: boolean;
  location?: string;
  shotCount: number;
  durationLabel: string;
  onSave?: () => void;
  onExport?: () => void;
}

export function LabHeader({
  sessionNumber = "0418",
  isLive = false,
  location = "TrackMan Lab",
  shotCount,
  durationLabel,
  onSave,
  onExport,
}: LabHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div>
        {isLive ? (
          <div className="font-mono text-[10px] text-[#D1F843] tracking-[0.14em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D1F843] animate-pulse" />
            LIVE · SESJON #{sessionNumber}
          </div>
        ) : (
          <div className="font-mono text-[10px] text-white/55 tracking-[0.14em]">
            TRACKMAN · OVERSIKT
          </div>
        )}
        <h1 className="m-1 mt-1 mb-0.5 font-display text-[26px] font-bold tracking-[-0.03em] text-[#F7FAF8]">
          TrackMan Lab
        </h1>
        <div className="text-[13px] text-[#A5B2AD]">
          {location} · {shotCount.toLocaleString("nb-NO")} slag logget · {durationLabel}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-white">
          <span
            className={[
              "w-1.5 h-1.5 rounded-full",
              isLive ? "bg-[#D1F843] animate-pulse" : "bg-white/40",
            ].join(" ")}
          />
          {isLive ? "Tilkoblet" : "Frakoblet"}
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-transparent px-3.5 py-2 text-sm font-semibold text-white hover:bg-white/5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Last ned CSV
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1F843] bg-[#D1F843] px-3.5 py-2 text-sm font-semibold text-[#0A1F18] hover:bg-[#C7EE3F] transition"
        >
          <Save className="w-3.5 h-3.5" strokeWidth={2.4} />
          Lagre sesjon
        </button>
      </div>
    </div>
  );
}
