"use client";

import { Sparkles } from "lucide-react";
import type { GapAnalysisItem } from "@/app/portal/(dashboard)/bag/actions";
import { accent, monoFont } from "./styles";

interface Props {
  gaps: GapAnalysisItem[];
}

export function RecommendationCard({ gaps }: Props) {
  if (gaps.length === 0) return null;

  return (
    <section
      className="mt-6 rounded-2xl px-7 py-6 text-white"
      style={{
        background:
          "linear-gradient(160deg, rgba(175,82,222,0.06), rgba(13,46,35,0.0)), #0D2E23",
        border: "1px solid rgba(175,82,222,0.20)",
      }}
    >
      <div
        className="mb-3.5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: "#C99CF3", fontFamily: monoFont }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI-anbefaling · gapping og utstyr
      </div>
      <h4 className="m-0 mb-2 text-[17px] font-bold leading-[1.35] tracking-[-0.02em] text-white">
        Lukk gap-rekken{" "}
        <em className="not-italic" style={{ color: accent }}>
          for jevn dekning.
        </em>
      </h4>
      <p className="m-0 mb-3.5 max-w-[70ch] text-[13px] leading-[1.55] text-white/70">
        Vi har funnet {gaps.length} hull i avstandsrekken din. Smaa justeringer av loft eller en
        klubbebytte gir deg jevn dekning fra driver til wedger.
      </p>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
        {gaps.slice(0, 3).map((g, i) => (
          <div
            key={g.between}
            className="rounded-[10px] border px-3.5 py-3"
            style={{
              background: "rgba(0,0,0,0.20)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "#C99CF3", fontFamily: monoFont }}
            >
              Tiltak {i + 1}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-white">{g.between}</div>
            <div className="mt-0.5 text-[11px] text-white/55">
              Gap {g.gap.toFixed(0)} m · {g.recommended}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
