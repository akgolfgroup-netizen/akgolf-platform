"use client";

import { ShieldCheck } from "lucide-react";
import { accent } from "./styles";

export function PrivacyFooter() {
  return (
    <div
      className="mt-6 flex items-center gap-3.5 rounded-xl border-2 border-dashed px-6 py-5 text-[12px] leading-[1.5] text-white/60"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.10)",
      }}
    >
      <ShieldCheck className="h-[18px] w-[18px] flex-shrink-0" style={{ color: accent }} />
      <div>
        <strong className="font-semibold text-white">Du deler privat.</strong> Profilen din er ikke
        offentlig. Innlegg er synlig for venner og grupper du velger. Coach ser oktdata uansett, men
        aldri innlegg du ikke deler eksplisitt. Endre i Innstillinger → Personvern.
      </div>
    </div>
  );
}
