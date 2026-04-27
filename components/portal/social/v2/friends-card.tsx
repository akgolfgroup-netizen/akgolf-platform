"use client";

import type { SosialtFriend } from "@/app/portal/(dashboard)/sosialt/sosialt-client";
import { cardStyle, monoFont } from "./styles";

interface Props {
  friends: SosialtFriend[];
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function isOnline(lastActiveAt: string | null): boolean {
  if (!lastActiveAt) return false;
  return Date.now() - new Date(lastActiveAt).getTime() < 5 * 60 * 1000;
}

function lastActiveLabel(lastActiveAt: string | null): string {
  if (!lastActiveAt) return "Ikke sett";
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "AKTIV NÅ";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}t siden`;
  const days = Math.floor(hours / 24);
  return `${days}d siden`;
}

const COLOR_PALETTE = [
  { bg: "rgba(107,177,255,0.20)", color: "#6BB1FF" },
  { bg: "rgba(42,125,90,0.30)", color: "#6FCBA1" },
  { bg: "rgba(175,82,222,0.20)", color: "#C99CF3" },
  { bg: "rgba(196,138,50,0.22)", color: "#E8B967" },
  { bg: "rgba(209,248,67,0.20)", color: "#D1F843" },
];

export function FriendsCard({ friends }: Props) {
  return (
    <div style={cardStyle} className="px-5 py-[18px] text-white">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="m-0 text-[13px] font-bold tracking-[-0.005em] text-white">Venner</h4>
        <span
          className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50"
          style={{ fontFamily: monoFont }}
        >
          {friends.length} totalt
        </span>
      </div>

      {friends.length === 0 ? (
        <p className="py-2 text-[12px] text-white/55">
          Du har ingen venner enna. Legg til en for a komme i gang.
        </p>
      ) : (
        friends.slice(0, 8).map((f, idx) => {
          const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          const online = isOnline(f.lastActiveAt);
          return (
            <div
              key={f.id}
              className="grid items-center gap-2.5 py-2"
              style={{
                gridTemplateColumns: "32px 1fr auto",
                borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: palette.bg, color: palette.color }}
              >
                {getInitials(f.name)}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[12.5px] font-semibold text-white">
                  {f.name}
                  {online ? (
                    <span
                      aria-hidden
                      className="ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                      style={{ background: "#6FCBA1", boxShadow: "0 0 6px #6FCBA1" }}
                    />
                  ) : null}
                </div>
                <div
                  className="mt-0.5 truncate text-[9.5px] uppercase tracking-[0.04em] text-white/50"
                  style={{ fontFamily: monoFont }}
                >
                  {lastActiveLabel(f.lastActiveAt)}
                </div>
              </div>
              <div
                className="text-right text-[11px] font-bold text-white/70"
                style={{ fontFamily: monoFont }}
              >
                {f.latestHandicap != null ? (
                  <>
                    {f.latestHandicap.toFixed(1)}
                    <small className="block text-[9px] uppercase tracking-[0.10em] text-white/40">
                      HCP
                    </small>
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
