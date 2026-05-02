"use client";

import { cardStyle, monoFont, accent } from "./styles";
import type { SosialtLeaderboardEntry } from "@/app/portal/(dashboard)/sosialt/sosialt-client";

type LeaderboardMode = "handicap" | "improvement" | "streak";

interface Props {
  entries: SosialtLeaderboardEntry[];
  mode?: LeaderboardMode;
  onModeChange?: (mode: LeaderboardMode) => void;
}

const MODE_CONFIG: Record<
  LeaderboardMode,
  { label: string; title: string; unit: string; format: (v: number) => string }
> = {
  handicap: {
    label: "HCP",
    title: "HCP-toppliste · venner",
    unit: "",
    format: (v) => v.toFixed(1),
  },
  improvement: {
    label: "Forbedring",
    title: "Største forbedring · 30 dager",
    unit: "↓",
    format: (v) => `${v >= 0 ? "−" : "+"}${Math.abs(v).toFixed(1)}`,
  },
  streak: {
    label: "Streak",
    title: "Treningsstreak · 30 dager",
    unit: "økter",
    format: (v) => String(Math.round(v)),
  },
};

const MODES: LeaderboardMode[] = ["handicap", "improvement", "streak"];

export function LeaderboardCard({ entries, mode = "handicap", onModeChange }: Props) {
  const config = MODE_CONFIG[mode];

  return (
    <div style={cardStyle} className="px-5 py-[18px] text-white">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="m-0 text-[13px] font-bold tracking-[-0.005em] text-white">
          {config.title}
        </h4>
        <span
          className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50"
          style={{ fontFamily: monoFont }}
        >
          {entries.length} spillere
        </span>
      </div>

      {/* Mode-toggle */}
      {onModeChange ? (
        <div
          className="mb-3 flex gap-1 rounded-lg p-1"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {MODES.map((m) => {
            const isActive = m === mode;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className="flex-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer border-none"
                style={{
                  background: isActive
                    ? "rgba(209,248,67,0.14)"
                    : "transparent",
                  color: isActive ? accent : "rgba(255,255,255,0.55)",
                }}
              >
                {MODE_CONFIG[m].label}
              </button>
            );
          })}
        </div>
      ) : null}

      {entries.length === 0 ? (
        <p className="py-2 text-[12px] text-white/55">
          Ingen data ennå. Legg til venner og handicap.
        </p>
      ) : (
        entries.slice(0, 8).map((p, idx) => {
          const rank = idx + 1;
          const isYou = p.isCurrentUser;
          return (
            <div
              key={p.id}
              className="grid items-center gap-2.5 py-2"
              style={{
                gridTemplateColumns: "22px 1fr auto",
                borderTop:
                  idx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                background: isYou ? "rgba(209,248,67,0.06)" : "transparent",
                borderRadius: isYou ? 6 : 0,
                marginLeft: isYou ? -6 : 0,
                marginRight: isYou ? -6 : 0,
                paddingLeft: isYou ? 6 : 0,
                paddingRight: isYou ? 6 : 0,
              }}
            >
              <span
                className="text-center text-[11px] font-bold"
                style={{
                  fontFamily: monoFont,
                  color: isYou ? accent : "rgba(255,255,255,0.5)",
                }}
              >
                {rank}
              </span>
              <div className="min-w-0">
                <div
                  className="truncate text-[12.5px] font-semibold"
                  style={{ color: isYou ? "#fff" : "rgba(255,255,255,0.85)" }}
                >
                  {p.name}
                  {isYou ? (
                    <span className="ml-2 text-[10px] text-white/50">· DEG</span>
                  ) : null}
                </div>
              </div>
              <span
                className="min-w-[32px] text-right text-[11px] font-bold"
                style={{
                  fontFamily: monoFont,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {p.value != null ? config.format(p.value) : "—"}
                {p.value != null && config.unit ? (
                  <span className="ml-1 font-normal text-white/40">
                    {config.unit}
                  </span>
                ) : null}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
