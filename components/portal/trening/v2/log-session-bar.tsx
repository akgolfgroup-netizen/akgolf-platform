"use client";

import { CheckCircle2 } from "lucide-react";

export function LogSessionBar() {
  return (
    <div
      className="sticky bottom-4 backdrop-blur-xl border-[1.5px] rounded-2xl px-5 py-3.5 flex items-center gap-4 mt-6"
      style={{
        background: "rgba(13,46,35,0.92)",
        borderColor: "rgba(209,248,67,0.30)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.40), 0 0 24px rgba(209,248,67,0.10)",
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-[#D1F843] text-[#0A1F18] grid place-items-center">
        <CheckCircle2 className="w-5 h-5" strokeWidth={2.4} />
      </div>
      <div className="flex-1">
        <strong className="block text-white text-sm font-bold tracking-[-0.005em]">
          Klar til å logge dagens økt?
        </strong>
        <span className="text-xs text-white/65">
          Velg drills, sett varighet og legg til notat — coach får sammendrag
          automatisk.
        </span>
      </div>
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-sm font-semibold text-white/70 hover:bg-white/5 transition">
          Senere
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1F843] bg-[#D1F843] px-3.5 py-2 text-sm font-semibold text-[#0A1F18] hover:bg-[#C7EE3F] transition">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.4} />
          Logg økt
        </button>
      </div>
    </div>
  );
}
