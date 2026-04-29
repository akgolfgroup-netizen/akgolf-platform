"use client";

import { Calendar, MapPin, Users, Trophy, CheckCircle2, ExternalLink, Map as MapIcon } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useEffect, useState } from "react";
import type { TournamentWithPlan } from "@/modules/tournament-planner";
import { accent, monoFont, heroShellStyle, success } from "./styles";

interface Props {
  tournament: TournamentWithPlan | null;
}

function diffParts(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((ms / (1000 * 60)) % 60);
  const secs = Math.floor((ms / 1000) % 60);
  return { days, hours, mins, secs };
}

export function TurneringerHero({ tournament }: Props) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!tournament) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [tournament]);
  // Hindre unused-warning
  void tick;

  if (!tournament) {
    return (
      <section
        style={heroShellStyle}
        className="mb-6 grid gap-8 p-7 text-white"
      >
        <div>
          <div
            className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em]"
            style={{ color: accent, fontFamily: monoFont }}
          >
            Neste turnering
          </div>
          <h2 className="text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-white">
            Ingen turneringer planlagt enna.
          </h2>
          <p className="mt-3 max-w-[50ch] text-sm leading-[1.6] text-white/65">
            Legg til en turnering eller meld deg pa fra &quot;Alle turneringer&quot; for a komme i gang.
          </p>
        </div>
      </section>
    );
  }

  const start = new Date(tournament.startDate);
  const end = tournament.endDate ? new Date(tournament.endDate) : null;
  const isRegistered = Boolean(tournament.playerPlan?.isRegistered);
  const cd = diffParts(start);

  return (
    <section
      style={heroShellStyle}
      className="mb-6 grid gap-8 p-7 text-white lg:grid-cols-[1.4fr_1fr]"
    >
      <div>
        <div
          className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          Neste turnering
        </div>
        <h2 className="text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-white sm:text-[30px]">
          {tournament.name}
        </h2>
        {tournament.series ? (
          <p className="mt-2 text-[13px] text-white/65">{tournament.series}</p>
        ) : null}

        <div className="my-[18px] flex flex-wrap gap-[18px] text-[13px] text-white/70">
          {(tournament.course || tournament.location) && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-white/50" />
              {[tournament.course, tournament.location].filter(Boolean).join(", ")}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-white/50" />
            {format(start, "d. MMM", { locale: nb })}
            {end ? `–${format(end, "d. MMM", { locale: nb })}` : ""}
          </span>
          {tournament.numberOfHoles ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-white/50" />
              {tournament.numberOfHoles} hull
            </span>
          ) : null}
          {tournament.registrationDeadline ? (
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-white/50" />
              Frist {format(new Date(tournament.registrationDeadline), "d. MMM", { locale: nb })}
            </span>
          ) : null}
        </div>

        {isRegistered ? (
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-[5px] text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: "rgba(42,125,90,0.20)",
              borderColor: "rgba(42,125,90,0.35)",
              color: success,
              fontFamily: monoFont,
            }}
          >
            <CheckCircle2 className="h-3 w-3" />
            Pamelding bekreftet
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: accent, color: "#0A1F18" }}
          >
            <MapIcon className="h-3.5 w-3.5" />
            Bygg strategi
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}
          >
            <Calendar className="h-3.5 w-3.5" />
            Tee-tid
          </button>
          {tournament.externalUrl ? (
            <a
              href={tournament.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Turneringside
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-[18px]">
        <div className="flex-1">
          <div
            className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/50"
            style={{ fontFamily: monoFont }}
          >
            Tid til tee-off
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: cd.days, l: "Dager" },
              { v: cd.hours, l: "Timer" },
              { v: cd.mins, l: "Min" },
              { v: cd.secs, l: "Sek" },
            ].map((c) => (
              <div
                key={c.l}
                className="rounded-[10px] border px-2 py-3.5 text-center"
                style={{
                  background: "rgba(0,0,0,0.20)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-[28px] font-bold leading-none tracking-[-0.02em] text-white"
                  style={{ fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}
                >
                  {String(c.v).padStart(2, "0")}
                </div>
                <div
                  className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/50"
                  style={{ fontFamily: monoFont }}
                >
                  {c.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
