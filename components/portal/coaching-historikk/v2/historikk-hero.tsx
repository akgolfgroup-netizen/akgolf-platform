"use client";

import { CalendarPlus, Download, MessageCircle } from "lucide-react";
import Link from "next/link";
import { accent, monoFont, heroShellStyle } from "./styles";

interface Props {
  totalSessions: number;
  last90: number;
  totalMinutes: number;
  notesCount: number;
  primaryCoach: string | null;
}

export function HistorikkHero({
  totalSessions,
  last90,
  totalMinutes,
  notesCount,
  primaryCoach,
}: Props) {
  const hours = Math.round(totalMinutes / 60);

  return (
    <section
      style={heroShellStyle}
      className="mb-6 grid items-center gap-7 p-7 text-white lg:grid-cols-[1.4fr_1fr]"
    >
      <div>
        <div
          className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          Reise med coach
        </div>
        <h2 className="text-[26px] font-bold leading-[1.2] tracking-[-0.025em] text-white sm:text-[28px]">
          {totalSessions === 0 ? (
            <>
              Ingen okter logget{" "}
              <em className="not-italic" style={{ color: accent }}>
                — book din forste.
              </em>
            </>
          ) : (
            <>
              {totalSessions} okter{" "}
              <em className="not-italic" style={{ color: accent }}>
                med {primaryCoach ?? "din coach"}.
              </em>
            </>
          )}
        </h2>
        <p className="mt-3 max-w-[55ch] text-[14px] leading-[1.6] text-white/70">
          {totalSessions === 0
            ? "Start din coaching-reise. Hver okt blir lagret med notater, video og maledata du kan se tilbake pa nar som helst."
            : "Klikk en okt for full notat, video og malinger. AI-oppsummeringer fra coachen er sokbar tekst."}
        </p>

        <div className="mt-[18px] flex flex-wrap gap-2">
          <Link
            href="/portal/bookinger/ny"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: accent, color: "#0A1F18" }}
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Book ny okt
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/10"
            style={{
              borderColor: "rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Eksporter PDF
          </button>
          <Link
            href="/portal/meldinger"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Send melding
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Antall okter" value={String(totalSessions)} delta={`${last90} siste 90d`} />
        <Stat
          label="Coaching-timer"
          value={String(hours)}
          unit="t"
          delta={totalSessions > 0 ? `${(hours / Math.max(1, totalSessions)).toFixed(1)} t snitt` : "Ingen okter"}
        />
        <Stat
          label="Notater"
          value={String(notesCount)}
          delta={notesCount > 0 ? "Tilgjengelig" : "Ingen enna"}
        />
        <Stat
          label="Primaer coach"
          value={primaryCoach ? primaryCoach.split(" ")[0] : "—"}
          delta={primaryCoach ? "Aktiv" : "Velg coach ved booking"}
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
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
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
        className="mt-1.5 text-[22px] font-bold leading-none tracking-[-0.02em] text-white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
        {unit ? <span className="ml-1 text-[12px] font-medium text-white/50">{unit}</span> : null}
      </div>
      {delta ? (
        <div
          className="mt-1 text-[10px] font-bold text-[#6FCBA1]"
          style={{ fontFamily: monoFont }}
        >
          {delta}
        </div>
      ) : null}
    </div>
  );
}
