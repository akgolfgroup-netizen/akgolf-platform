"use client";

import { ChevronDown } from "lucide-react";

export type Period = "30d" | "90d" | "season" | "1y";

const PERIODS: { key: Period; label: string }[] = [
  { key: "30d", label: "30 dager" },
  { key: "90d", label: "90 dager" },
  { key: "season", label: "Sesong" },
  { key: "1y", label: "1 år" },
];

export interface FilterBarProps {
  clubs: string[]; // tilgjengelige klubber fra data
  selectedClub: string | "ALL";
  onClubChange: (club: string | "ALL") => void;
  period: Period;
  onPeriodChange: (p: Period) => void;
  sessions: { id: string; label: string }[];
  selectedSessionId: string | "ALL";
  onSessionChange: (id: string | "ALL") => void;
}

export function FilterBar({
  clubs,
  selectedClub,
  onClubChange,
  period,
  onPeriodChange,
  sessions,
  selectedSessionId,
  onSessionChange,
}: FilterBarProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#121614] p-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
      {/* Klubbe-velger */}
      <div className="flex-1 min-w-[140px]">
        <label
          htmlFor="trackman-club-filter"
          className="block font-mono text-[9px] text-white/45 tracking-[0.14em] uppercase mb-1.5"
        >
          Klubbe
        </label>
        <SelectShell>
          <select
            id="trackman-club-filter"
            value={selectedClub}
            onChange={(e) => onClubChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm text-white px-3 py-2 pr-8 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#121614]">
              Alle klubber
            </option>
            {clubs.map((c) => (
              <option key={c} value={c} className="bg-[#121614]">
                {c}
              </option>
            ))}
          </select>
        </SelectShell>
      </div>

      {/* Periode-pills */}
      <div className="flex-1">
        <div className="font-mono text-[9px] text-white/45 tracking-[0.14em] uppercase mb-1.5">
          Periode
        </div>
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg">
          {PERIODS.map((p) => {
            const active = p.key === period;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onPeriodChange(p.key)}
                className={[
                  "flex-1 text-xs font-semibold rounded-md py-1.5 transition",
                  active
                    ? "bg-[#D1F843] text-[#0A1F18]"
                    : "text-white/55 hover:text-white",
                ].join(" ")}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sesjon-velger */}
      <div className="flex-1 min-w-[180px]">
        <label
          htmlFor="trackman-session-filter"
          className="block font-mono text-[9px] text-white/45 tracking-[0.14em] uppercase mb-1.5"
        >
          Sesjon
        </label>
        <SelectShell>
          <select
            id="trackman-session-filter"
            value={selectedSessionId}
            onChange={(e) => onSessionChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm text-white px-3 py-2 pr-8 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#121614]">
              Alle sesjoner
            </option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#121614]">
                {s.label}
              </option>
            ))}
          </select>
        </SelectShell>
      </div>
    </div>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 transition focus-within:border-[#D1F843]/50">
      {children}
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
    </div>
  );
}
