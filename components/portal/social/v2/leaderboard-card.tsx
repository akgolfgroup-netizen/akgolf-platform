"use client";

import { cardStyle, monoFont, accent } from "./styles";
import type { SosialtLeaderboardEntry } from "@/app/portal/(dashboard)/sosialt/sosialt-client";

interface Props {
  entries: SosialtLeaderboardEntry[];
}

export function LeaderboardCard({ entries }: Props) {
  return (
    <div style={cardStyle} className="px-5 py-[18px] text-white">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="m-0 text-[13px] font-bold tracking-[-0.005em] text-white">
          HCP-toppliste · venner
        </h4>
        <span
          className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50"
          style={{ fontFamily: monoFont }}
        >
          {entries.length} spillere
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="py-2 text-[12px] text-white/55">
          Ingen data enna. Legg til venner og handicap.
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
                borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
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
                  {isYou ? <span className="ml-2 text-[10px] text-white/50">· DEG</span> : null}
                </div>
              </div>
              <span
                className="min-w-[32px] text-right text-[11px] font-bold"
                style={{
                  fontFamily: monoFont,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {p.value != null ? p.value.toFixed(1) : "—"}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
