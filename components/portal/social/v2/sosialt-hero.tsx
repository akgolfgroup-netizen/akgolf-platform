"use client";

import { Plus, Users, Shield } from "lucide-react";
import { accent, monoFont, heroShellStyle } from "./styles";

interface Props {
  friendsCount: number;
  pendingCount: number;
  onAdd: () => void;
}

export function SosialtHero({ friendsCount, pendingCount, onAdd }: Props) {
  return (
    <section
      style={heroShellStyle}
      className="mb-6 grid items-center gap-7 p-7 text-white lg:grid-cols-[1.3fr_1fr]"
    >
      <div>
        <div
          className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          Felleskap
        </div>
        <h2 className="text-[26px] font-bold leading-[1.2] tracking-[-0.025em] text-white sm:text-[28px]">
          {friendsCount === 0 ? (
            <>
              Bygg ditt golf-nettverk{" "}
              <em className="not-italic" style={{ color: accent }}>
                — start med en venn.
              </em>
            </>
          ) : (
            <>
              Treningskompiser, runder,{" "}
              <em className="not-italic" style={{ color: accent }}>
                framgang.
              </em>
            </>
          )}
        </h2>
        <p className="mt-3 max-w-[55ch] text-[14px] leading-[1.6] text-white/70">
          Du deler bare med venner du har valgt. Alt annet er privat. Coach ser ovingsdata uansett —
          aldri innlegg du ikke deler eksplisitt.
        </p>

        <div className="mt-[18px] flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: accent, color: "#0A1F18" }}
          >
            <Plus className="h-3.5 w-3.5" />
            Legg til venn
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/10"
            style={{
              borderColor: "rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Users className="h-3.5 w-3.5" />
            Mine grupper
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            <Shield className="h-3.5 w-3.5" />
            Personvern
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Venner" value={String(friendsCount)} />
        <Stat label="Forespørsler" value={String(pendingCount)} tone={pendingCount > 0 ? "warn" : undefined} />
        <Stat label="Aktive grupper" value="—" />
        <Stat label="Profil" value="Privat" />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) {
  return (
    <div
      className="rounded-xl border px-4 py-3.5 text-white"
      style={{
        background: "rgba(0,0,0,0.18)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/55"
        style={{ fontFamily: monoFont }}
      >
        {label}
      </div>
      <div
        className="mt-1.5 text-[22px] font-bold leading-none tracking-[-0.02em]"
        style={{
          fontVariantNumeric: "tabular-nums",
          color: tone === "warn" ? "#E8B967" : "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}
