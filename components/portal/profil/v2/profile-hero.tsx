"use client";

import { MapPin, Pencil } from "lucide-react";
import Image from "next/image";

interface ProfileHeroProps {
  name: string;
  initials: string;
  image?: string | null;
  clubName: string | null;
  memberSinceYear: number | null;
  tierLabel: string;
  currentHcp: number | null;
  hcpDelta: number | null;
  sgPerRound: number | null;
  roundsThisMonth: number;
  planLabel: string;
}

export function ProfileHero({
  name,
  initials,
  image,
  clubName,
  memberSinceYear,
  tierLabel,
  currentHcp,
  hcpDelta,
  sgPerRound,
  roundsThisMonth,
  planLabel,
}: ProfileHeroProps) {
  return (
    <section className="relative mb-7 min-h-[300px] overflow-hidden rounded-[20px] border border-[#1a4a3a]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F2920] via-[#0A1F18] to-[#062017]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,31,24,0.40) 0%, rgba(10,31,24,0.55) 45%, rgba(10,31,24,0.92) 100%), linear-gradient(90deg, rgba(10,31,24,0.65) 0%, rgba(10,31,24,0.20) 50%, rgba(10,31,24,0.40) 100%), radial-gradient(ellipse at 90% 15%, rgba(209,248,67,0.18), transparent 50%)",
        }}
      />

      <button
        type="button"
        className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
      >
        <Pencil className="h-3.5 w-3.5" />
        Rediger
      </button>

      <div className="relative z-10 grid items-end gap-5 p-7 sm:grid-cols-[120px_1fr] sm:gap-7 sm:p-9 lg:grid-cols-[140px_1fr_auto]">
        <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] sm:h-[140px] sm:w-[140px]">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={140}
              height={140}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#D1F843] to-[#6FCBA1] text-[44px] font-extrabold tracking-[-0.04em] text-[#0A1F18] sm:text-[52px]">
              {initials}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none tracking-[-0.035em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-[56px]">
            {name}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-sm text-white/70">
            {clubName ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-white/50" />
                {clubName}
              </span>
            ) : null}
            {memberSinceYear !== null ? (
              <>
                <Dot />
                <span>Spiller siden {memberSinceYear}</span>
              </>
            ) : null}
            <Dot />
            <span className="inline-flex items-center rounded-full bg-[#D1F843]/15 px-2.5 py-0.5 text-xs font-semibold text-[#D1F843] ring-1 ring-[#D1F843]/30">
              {tierLabel}
            </span>
          </div>
        </div>

        <HeroMetaGrid
          currentHcp={currentHcp}
          hcpDelta={hcpDelta}
          sgPerRound={sgPerRound}
          roundsThisMonth={roundsThisMonth}
          planLabel={planLabel}
        />
      </div>
    </section>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />;
}

function HeroMetaGrid({
  currentHcp,
  hcpDelta,
  sgPerRound,
  roundsThisMonth,
  planLabel,
}: {
  currentHcp: number | null;
  hcpDelta: number | null;
  sgPerRound: number | null;
  roundsThisMonth: number;
  planLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-7 gap-y-3.5 self-end">
      <MetaCell label="HCP nå">
        <span className="text-[#D1F843]">
          {currentHcp !== null ? currentHcp.toFixed(1) : "—"}
        </span>
        {hcpDelta !== null && hcpDelta !== 0 ? (
          <small className="ml-1.5 font-semibold text-[#6FCBA1]">
            {hcpDelta < 0 ? "↓" : "↑"} {Math.abs(hcpDelta).toFixed(1)}
          </small>
        ) : null}
      </MetaCell>
      <MetaCell label="SG / runde">
        {sgPerRound !== null
          ? `${sgPerRound > 0 ? "+" : ""}${sgPerRound.toFixed(2)}`
          : "—"}
      </MetaCell>
      <MetaCell label="Runder mnd">{roundsThisMonth}</MetaCell>
      <MetaCell label="Plan">
        <span className="text-sm">{planLabel}</span>
      </MetaCell>
    </div>
  );
}

function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-bold tracking-[-0.02em] tabular-nums text-white">
        {children}
      </div>
    </div>
  );
}
