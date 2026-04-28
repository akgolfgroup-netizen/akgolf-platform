"use client";

import { Zap } from "lucide-react";

interface HqHeroProps {
  initials: string;
  name: string;
  membershipNumber?: string | null;
  clubName?: string | null;
  age?: number | null;
  memberSince?: number | null;
  planLabel?: string | null;
  currentHcp: number | null;
  hcpDelta: number | null;
  sgPerRound: number | null;
  sgDelta: number | null;
  roundsThisMonth: number;
}

export function HqHero({
  initials,
  name,
  membershipNumber,
  clubName,
  age,
  memberSince,
  planLabel,
  currentHcp,
  hcpDelta,
  sgPerRound,
  sgDelta,
  roundsThisMonth,
}: HqHeroProps) {
  return (
    <section
      className="relative mr-0 lg:mr-[22px] mt-[22px] overflow-hidden"
      style={{
        minHeight: 280,
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(10,31,24,0.30) 0%, rgba(10,31,24,0.55) 60%, rgba(10,31,24,0.92) 100%), linear-gradient(135deg, #0F2920 0%, #0A1F18 60%, #062017 100%)",
      }}
    >
      {planLabel ? (
        <div
          className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[11px] uppercase"
          style={{
            background: "#D1F843",
            color: "#0A1F18",
            letterSpacing: "0.16em",
            fontWeight: 800,
          }}
        >
          <Zap className="h-3 w-3" strokeWidth={2.5} />
          {planLabel}
        </div>
      ) : null}

      <div
        className="relative z-[1] grid items-center gap-6 p-7 sm:p-9"
        style={{
          minHeight: 280,
          gridTemplateColumns: "130px 1fr",
        }}
      >
        <div
          className="grid place-items-center self-end font-extrabold tracking-[-0.04em]"
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "#D1F843",
            color: "#0A1F18",
            fontSize: 48,
            boxShadow:
              "0 0 0 4px rgba(10,31,24,0.6), 0 0 60px rgba(209,248,67,0.45), 0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          {initials}
        </div>

        <div>
          <div
            className="mb-1.5 font-mono text-[10px] uppercase"
            style={{
              letterSpacing: "0.16em",
              color: "#D1F843",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            Spiller
            {membershipNumber ? ` · medlemsnummer ${membershipNumber}` : ""}
          </div>
          <h1
            className="m-0 font-extrabold leading-none tracking-[-0.035em] text-white"
            style={{
              fontFamily: "var(--font-inter-tight, Inter)",
              fontSize: 52,
              textShadow: "0 2px 24px rgba(0,0,0,0.7)",
            }}
          >
            {name}
          </h1>
          <div
            className="mt-2.5 text-[14px] font-medium text-white/85"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            {[
              clubName,
              age !== null && age !== undefined ? `${age} år` : null,
              memberSince ? `Spiller siden ${memberSince}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>

        <div className="col-span-full mt-4 flex flex-wrap gap-4 lg:col-span-1 lg:col-start-2 lg:mt-2">
          <Kpi label="HCP nå" value={currentHcp} delta={hcpDelta} />
          <Kpi
            label="SG / runde"
            value={sgPerRound}
            delta={sgDelta}
            format={(v) => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2))}
          />
          <Kpi
            label="Runder · mnd"
            value={roundsThisMonth}
            format={(v) => String(v)}
            isInt
          />
        </div>
      </div>
    </section>
  );
}

interface KpiProps {
  label: string;
  value: number | null;
  delta?: number | null;
  format?: (v: number) => string;
  isInt?: boolean;
}

function Kpi({ label, value, delta, format, isInt }: KpiProps) {
  const formatted =
    value === null
      ? "—"
      : format
        ? format(value)
        : isInt
          ? String(value)
          : value.toFixed(1);
  return (
    <div
      style={{
        background: "rgba(10,31,24,0.50)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "14px 18px",
        minWidth: 110,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase"
        style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)" }}
      >
        {label}
      </div>
      <div
        className="mt-1 font-extrabold tracking-[-0.03em] tabular-nums leading-none text-white"
        style={{
          fontFamily: "var(--font-inter-tight, Inter)",
          fontSize: 28,
        }}
      >
        {formatted}
        {delta !== null && delta !== undefined && delta !== 0 ? (
          <span
            className="ml-1.5 font-mono text-[11px] font-bold"
            style={{
              color: delta < 0 ? "#6FCBA1" : "#E47C7C",
              letterSpacing: "0.04em",
            }}
          >
            {delta < 0 ? "" : "+"}
            {delta.toFixed(delta < 1 && delta > -1 ? 2 : 1)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
