"use client";

import { HelpCircle } from "lucide-react";

interface KartleggingHeroProps {
  completed: number;
  total: number;
  estimatedMinutesLeft: number;
  location?: string;
}

export function KartleggingHero({
  completed,
  total,
  estimatedMinutesLeft,
  location,
}: KartleggingHeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[20px] p-8"
      style={{
        background:
          "radial-gradient(circle at 90% 20%, rgba(209,248,67,0.18), transparent 50%), linear-gradient(135deg, rgba(13,46,35,0.96), rgba(10,31,24,1))",
        border: "1.5px solid rgba(209,248,67,0.30)",
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        Tre tester · ca. 60 min totalt
      </div>
      <h1
        className="mt-2 mb-1.5 text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-white max-w-[22ch]"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        Kartlegg utgangspunktet ditt
      </h1>
      <p
        className="text-[14px] mb-5 max-w-[60ch]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Disse tre testene gir oss baseline for SG-mål og fokusområder. Du får en
        personlig plan etter du har fullført, og kan bruke samme tester månedlig
        for å måle utviklingen.
      </p>

      <div className="flex flex-wrap items-center gap-7">
        <HeroMeta label="Fullført" value={`${completed} av ${total}`} />
        <HeroMeta label="Estimert tid igjen" value={`~ ${estimatedMinutesLeft} min`} />
        {location && <HeroMeta label="Lokasjon" value={location} small />}
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[12px] font-semibold transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Spørsmål? Spør Anders
        </button>
      </div>
    </section>
  );
}

function HeroMeta({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {label}
      </div>
      <div
        className="font-extrabold text-white tracking-tight mt-1"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: small ? "14px" : "18px",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
