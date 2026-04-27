"use client";

import { Map as MapIcon, Check, Info, CheckCircle2, X } from "lucide-react";
import { format, isBefore } from "date-fns";
import { nb } from "date-fns/locale";
import type { TournamentWithPlan } from "@/modules/tournament-planner";
import { cardStyle, monoFont, accent } from "./styles";

interface Props {
  tournaments: TournamentWithPlan[];
  onSelect: (t: TournamentWithPlan) => void;
}

function pillStyle(t: TournamentWithPlan): { label: string; bg: string; color: string } {
  const isReg = Boolean(t.playerPlan?.isRegistered);
  if (isReg) return { label: "Pameldt", bg: "rgba(42,125,90,0.20)", color: "#6FCBA1" };
  if (t.registrationDeadline && !isBefore(new Date(t.registrationDeadline), new Date())) {
    return { label: "Pamelding apen", bg: "rgba(196,138,50,0.22)", color: "#E8B967" };
  }
  return { label: "Foreslatt", bg: "rgba(107,177,255,0.18)", color: "#6BB1FF" };
}

export function UpcomingTournamentGrid({ tournaments, onSelect }: Props) {
  if (tournaments.length === 0) return null;

  return (
    <>
      <div className="mt-7 mb-3.5 flex items-end justify-between">
        <h3 className="text-[18px] font-bold tracking-[-0.02em] text-white">Andre kommende</h3>
        <div
          className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45"
          style={{ fontFamily: monoFont }}
        >
          {tournaments.length} turneringer
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        {tournaments.map((t) => {
          const start = new Date(t.startDate);
          const pill = pillStyle(t);
          const isReg = Boolean(t.playerPlan?.isRegistered);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t)}
              style={cardStyle}
              className="flex flex-col gap-3 p-5 text-left transition-colors hover:brightness-110"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div
                  className="w-14 flex-shrink-0 rounded-[10px] border px-2.5 py-2 text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="text-[22px] font-bold leading-none tracking-[-0.03em] text-white">
                    {format(start, "d")}
                  </div>
                  <div
                    className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/50"
                    style={{ fontFamily: monoFont }}
                  >
                    {format(start, "MMM", { locale: nb })}
                  </div>
                </div>
                <span
                  className="rounded px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ fontFamily: monoFont, background: pill.bg, color: pill.color }}
                >
                  {pill.label}
                </span>
              </div>

              <div className="flex-1">
                <div className="text-[15px] font-bold leading-tight tracking-[-0.005em] text-white">
                  {t.name}
                </div>
                {t.series ? (
                  <div className="mt-0.5 text-[12px] text-white/55">{t.series}</div>
                ) : null}
              </div>

              <div
                className="flex flex-col gap-1.5 border-t pt-3"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                {t.course ? (
                  <Row label="Bane" value={t.course} />
                ) : null}
                {t.location ? <Row label="Sted" value={t.location} /> : null}
                {t.registrationDeadline ? (
                  <Row
                    label="Frist"
                    value={format(new Date(t.registrationDeadline), "d. MMM", { locale: nb })}
                  />
                ) : null}
              </div>

              <div className="mt-1 flex gap-1.5">
                <span
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-semibold text-white/85"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  {isReg ? <Check className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                  Detaljer
                </span>
                <span
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold"
                  style={{ background: accent, color: "#0A1F18" }}
                >
                  {isReg ? <Check className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isReg ? "Klar" : "Plan"}
                </span>
                <span aria-hidden className="hidden">
                  <X className="h-0 w-0" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[11.5px]">
      <span className="text-white/50">{label}</span>
      <span
        className="font-semibold text-white"
        style={{ fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </span>
    </div>
  );
}
