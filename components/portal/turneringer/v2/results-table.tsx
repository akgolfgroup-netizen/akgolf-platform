"use client";

import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { TournamentWithPlan } from "@/modules/tournament-planner";
import { cardStyle, monoFont } from "./styles";

interface Props {
  tournaments: TournamentWithPlan[];
  onSelect: (t: TournamentWithPlan) => void;
}

export function PastResultsTable({ tournaments, onSelect }: Props) {
  if (tournaments.length === 0) return null;

  return (
    <>
      <div className="mt-7 mb-3.5 flex items-end justify-between">
        <h3 className="text-[18px] font-bold tracking-[-0.02em] text-white">Gjennomforte</h3>
        <div
          className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45"
          style={{ fontFamily: monoFont }}
        >
          {tournaments.length} turneringer
        </div>
      </div>

      <section style={{ ...cardStyle, borderRadius: 16 }} className="overflow-hidden">
        <div
          className="grid items-center gap-3.5 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50"
          style={{
            background: "rgba(255,255,255,0.02)",
            gridTemplateColumns: "80px 1.6fr 1fr 100px 70px",
            fontFamily: monoFont,
          }}
        >
          <div>Dato</div>
          <div>Turnering</div>
          <div>Bane</div>
          <div>Plassering</div>
          <div />
        </div>

        {tournaments.map((t, idx) => {
          const start = new Date(t.startDate);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t)}
              className="grid w-full items-center gap-3.5 px-5 py-3.5 text-left text-[12.5px] transition-colors hover:bg-white/5"
              style={{
                borderBottom: idx === tournaments.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
                gridTemplateColumns: "80px 1.6fr 1fr 100px 70px",
              }}
            >
              <div
                className="text-[11px] text-white/70"
                style={{ fontFamily: monoFont }}
              >
                {format(start, "d. MMM", { locale: nb })}
              </div>
              <div className="font-semibold text-white">
                {t.name}
                {t.series ? (
                  <div className="mt-0.5 text-[11px] font-normal text-white/50">
                    {t.series}
                  </div>
                ) : null}
              </div>
              <div className="text-white/70">{t.course ?? t.location ?? "—"}</div>
              <div
                className="font-bold text-white"
                style={{ fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}
              >
                —
              </div>
              <div className="ml-auto">
                <span
                  className="grid h-7 w-7 place-items-center rounded-md text-white/70"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </>
  );
}
