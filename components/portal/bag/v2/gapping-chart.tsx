"use client";

import type { PlayerClubData } from "@/app/portal/(dashboard)/bag/actions";
import { accent, cardStyle, monoFont } from "./styles";

interface Props {
  clubs: PlayerClubData[];
}

function shortName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("driver")) return "D";
  if (lower.includes("3 wood") || lower.includes("3w")) return "3W";
  if (lower.includes("5 wood") || lower.includes("5w")) return "5W";
  const hybrid = name.match(/(\d)\s*hybrid/i);
  if (hybrid) return `${hybrid[1]}H`;
  const iron = name.match(/(\d)\s*(?:iron|jern)/i);
  if (iron) return `${iron[1]}i`;
  if (lower === "pw" || lower.includes("pitching")) return "PW";
  if (lower === "gw" || lower.includes("gap")) return "GW";
  if (lower === "sw" || lower.includes("sand")) return "SW";
  if (lower === "lw" || lower.includes("lob")) return "LW";
  if (lower.includes("putter")) return "P";
  return name.slice(0, 3).toUpperCase();
}

export function GappingChart({ clubs }: Props) {
  const distanceClubs = clubs
    .filter((c) => (c.avgCarry ?? 0) > 0 && !/putter/i.test(c.name))
    .sort((a, b) => (b.avgCarry ?? 0) - (a.avgCarry ?? 0));
  const putter = clubs.find((c) => /putter/i.test(c.name));
  const max = Math.max(...distanceClubs.map((c) => c.avgCarry ?? 0), 260);

  return (
    <section style={cardStyle} className="mb-6 px-7 py-6 text-white">
      <div className="mb-4 flex items-end justify-between">
        <h4 className="m-0 text-[16px] font-bold tracking-[-0.01em] text-white">
          Gapping-chart · carry-distanse
        </h4>
        <div className="text-[11px] text-white/55">
          <span className="ml-3.5">
            <span
              className="mr-1 inline-block h-2 w-2 rounded-sm align-middle"
              style={{ background: "rgba(209,248,67,0.40)" }}
            />
            Spread
          </span>
          <span className="ml-3.5">
            <span
              className="mr-1 inline-block h-2 w-2 rounded-sm align-middle"
              style={{ background: accent }}
            />
            Median
          </span>
        </div>
      </div>

      {distanceClubs.length === 0 ? (
        <div className="py-8 text-center text-sm text-white/55">
          Ingen carry-tall registrert enna. Last opp Trackman eller legg til avstander.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {distanceClubs.map((club, idx) => {
            const carry = club.avgCarry ?? 0;
            const fillEnd = (carry / max) * 100;
            const fillStart = Math.max(0, fillEnd - 14);
            const midPos = fillEnd - 4;
            const prev = distanceClubs[idx - 1];
            const gap = prev ? (prev.avgCarry ?? 0) - carry : null;
            const tone =
              gap == null ? null : gap > 22 ? "bad" : gap > 18 || gap < 9 ? "warn" : "ok";

            return (
              <div
                key={club.id}
                className="grid items-center gap-4"
                style={{ gridTemplateColumns: "80px 1fr 90px 60px" }}
              >
                <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  <span
                    className="grid h-[26px] w-[26px] place-items-center rounded-md text-[11px] font-bold"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: monoFont,
                    }}
                  >
                    {shortName(club.name)}
                  </span>
                  <span className="truncate">{club.name}</span>
                </div>
                <div
                  className="relative h-[22px] rounded-md"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="absolute h-full rounded-[4px] border"
                    style={{
                      left: `${fillStart}%`,
                      right: `${100 - fillEnd}%`,
                      background:
                        "linear-gradient(90deg, rgba(209,248,67,0.30), rgba(209,248,67,0.50), rgba(209,248,67,0.30))",
                      borderColor: "rgba(209,248,67,0.50)",
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-[2px]"
                    style={{
                      left: `${midPos}%`,
                      background: accent,
                      boxShadow: "0 0 6px rgba(209,248,67,0.60)",
                    }}
                  />
                </div>
                <div
                  className="text-right text-[13px] font-bold text-white"
                  style={{ fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}
                >
                  {carry}
                  <span className="ml-0.5 text-[11px] font-medium text-white/50">m</span>
                </div>
                <div
                  className="text-right text-[11px]"
                  style={{
                    fontFamily: monoFont,
                    color:
                      tone === "bad"
                        ? "#F49283"
                        : tone === "warn"
                        ? "#E8B967"
                        : "rgba(255,255,255,0.55)",
                  }}
                >
                  {gap == null ? "—" : `−${gap.toFixed(0)} m`}
                </div>
              </div>
            );
          })}

          {putter ? (
            <div
              className="grid items-center gap-4"
              style={{ gridTemplateColumns: "80px 1fr 90px 60px" }}
            >
              <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
                <span
                  className="grid h-[26px] w-[26px] place-items-center rounded-md text-[11px] font-bold"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: monoFont,
                  }}
                >
                  P
                </span>
                Putter
              </div>
              <div
                className="relative h-[22px] rounded-md"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div
                  className="absolute top-1/2 h-px w-full"
                  style={{ borderTop: "1px dashed rgba(255,255,255,0.15)" }}
                />
              </div>
              <div className="text-right text-[13px] font-bold text-white">—</div>
              <div className="text-right text-[11px] text-white/55">{putter.brand ?? ""}</div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
