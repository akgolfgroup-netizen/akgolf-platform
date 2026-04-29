"use client";

import type { MyTalentTournamentRow } from "@/app/portal/(dashboard)/talent/actions";

const AGE_LABEL: Record<string, string> = {
  G19: "Gutter 16-19",
  G15: "Gutter 13-15",
  G12: "Gutter -12",
  J19: "Jenter 16-19",
  J15: "Jenter 13-15",
  J12: "Jenter -12",
  HERR: "Herrer 20+",
  DAME: "Damer 20+",
  HERR_SENIOR: "Herrer senior",
  DAME_SENIOR: "Damer senior",
  MIX: "Mix",
  M5: "M5",
  M8: "M8",
  M10: "M10",
  M12: "M12",
  UKJENT: "Ukjent",
};

function fmtDate(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function fmtToPar(n: number | null): string {
  if (n === null || n === undefined) return "—";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

export function TournamentResultsCard({
  results,
}: {
  results: MyTalentTournamentRow[];
}) {
  return (
    <>
      <div className="flex items-end justify-between mb-3.5 mt-7">
        <h3 className="font-display m-0 text-lg font-bold tracking-[-0.02em] text-white">
          Siste turneringer · {results.length} resultater
        </h3>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          NGF · WAGR · COLLEGE
        </div>
      </div>

      <section className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] overflow-hidden">
        {results.length === 0 ? (
          <div className="px-7 py-8 text-center text-sm text-white/55">
            Ingen turneringsresultater registrert enda.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 bg-black/15">
              <span>Turnering</span>
              <span className="text-right">Dato</span>
              <span className="text-right">Hull</span>
              <span className="text-right">Plass</span>
              <span className="text-right">Til par</span>
            </div>
            {results.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 text-sm items-center"
              >
                <div>
                  <div className="text-white font-medium leading-tight">
                    {r.tournamentName}
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">
                    {AGE_LABEL[r.ageGroup] ?? r.ageGroup}
                  </div>
                </div>
                <div className="text-right text-white/65 font-mono text-xs tabular-nums">
                  {fmtDate(r.tournamentDate)}
                </div>
                <div className="text-right text-white/55 font-mono text-xs tabular-nums">
                  {r.holes}
                </div>
                <div className="text-right text-white font-bold font-mono tabular-nums">
                  {r.position ?? "—"}
                </div>
                <div
                  className={`text-right font-mono font-bold tabular-nums ${
                    r.toPar !== null && r.toPar < 0
                      ? "text-[#D1F843]"
                      : r.toPar !== null && r.toPar > 0
                        ? "text-[#F49283]"
                        : "text-white/65"
                  }`}
                >
                  {fmtToPar(r.toPar)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
