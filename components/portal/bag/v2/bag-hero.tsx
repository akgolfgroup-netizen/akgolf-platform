"use client";

import { Plus, Ruler, MessageCircle } from "lucide-react";
import type { PlayerClubData } from "@/app/portal/(dashboard)/bag/actions";
import { accent, monoFont, heroShellStyle } from "./styles";

interface Props {
  clubs: PlayerClubData[];
  flagCount: number;
  onAdd: () => void;
}

function avgIronGap(clubs: PlayerClubData[]): number | null {
  const irons = clubs
    .filter((c) => /jern|iron|^[3-9]i$|^[3-9] iron$/i.test(c.name) && (c.avgCarry ?? 0) > 0)
    .sort((a, b) => (b.avgCarry ?? 0) - (a.avgCarry ?? 0));
  if (irons.length < 2) return null;
  const gaps: number[] = [];
  for (let i = 0; i < irons.length - 1; i++) {
    gaps.push((irons[i].avgCarry ?? 0) - (irons[i + 1].avgCarry ?? 0));
  }
  if (gaps.length === 0) return null;
  return gaps.reduce((a, b) => a + b, 0) / gaps.length;
}

export function BagHero({ clubs, flagCount, onAdd }: Props) {
  const driver = clubs.find((c) => /driver/i.test(c.name));
  const driverCarry = driver?.avgCarry ?? null;
  const ironGap = avgIronGap(clubs);

  return (
    <section
      style={heroShellStyle}
      className="mb-6 grid items-center gap-7 p-7 text-white lg:grid-cols-[1.2fr_1fr]"
    >
      <div>
        <div
          className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          Bag-status
        </div>
        <h2 className="text-[26px] font-bold leading-[1.2] tracking-[-0.025em] text-white sm:text-[28px]">
          {clubs.length === 14 ? (
            <>
              Sterk WITB{" "}
              <em className="not-italic" style={{ color: accent }}>
                med {flagCount} gap-flagg.
              </em>
            </>
          ) : (
            <>
              {clubs.length} klubber{" "}
              <em className="not-italic" style={{ color: accent }}>
                — bygg ut til 14.
              </em>
            </>
          )}
        </h2>
        <p className="mt-3 max-w-[55ch] text-[14px] leading-[1.6] text-white/70">
          {clubs.length === 0
            ? "Legg til klubbene dine for a fa avstandsoversikt, gap-analyse og anbefalinger."
            : "Carry-distansene oppdateres fra Trackman-okter. Sjekk gap-rekken under for hull i bagen for neste turnering."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: accent, color: "#0A1F18" }}
          >
            <Plus className="h-3.5 w-3.5" />
            Logg ny klubb
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/10"
            style={{
              borderColor: "rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Ruler className="h-3.5 w-3.5" />
            Trackman-test
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Spor coach om gap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Klubber i bag" value={`${clubs.length}`} unit={`/ 14`} delta={clubs.length === 14 ? "Lovlig oppsett" : "Ikke fullt"} />
        <Stat
          label="Driver carry"
          value={driverCarry != null ? `${driverCarry}` : "—"}
          unit={driverCarry != null ? "m" : undefined}
          delta={driverCarry != null ? "Snitt fra Trackman" : "Ingen data"}
        />
        <Stat
          label="Snitt-gap jern"
          value={ironGap != null ? ironGap.toFixed(1) : "—"}
          unit={ironGap != null ? "m" : undefined}
          delta={ironGap != null ? "Innenfor 10–15" : "Trenger data"}
        />
        <Stat
          label="Gap-flagg"
          value={String(flagCount)}
          delta={flagCount > 0 ? "Sjekk gap-rekken" : "Ingen flagg"}
          tone={flagCount > 0 ? "warn" : "ok"}
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
  delta,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  tone?: "ok" | "warn";
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
        {unit ? <span className="ml-1 text-[12px] font-medium text-white/50">{unit}</span> : null}
      </div>
      {delta ? (
        <div
          className="mt-1 text-[10px] font-bold"
          style={{
            fontFamily: monoFont,
            color: tone === "warn" ? "#E8B967" : "#6FCBA1",
          }}
        >
          {delta}
        </div>
      ) : null}
    </div>
  );
}
