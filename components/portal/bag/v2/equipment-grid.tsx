"use client";

import {
  Rocket,
  Zap,
  Layers,
  Triangle,
  CircleDot,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PlayerClubData } from "@/app/portal/(dashboard)/bag/actions";
import { accent, monoFont } from "./styles";

interface Props {
  clubs: PlayerClubData[];
  onDelete: (id: string) => void;
  pending: boolean;
}

function categoryFor(club: PlayerClubData): { cat: string; Icon: LucideIcon } {
  const n = club.name.toLowerCase();
  if (n.includes("driver")) return { cat: "Driver", Icon: Rocket };
  if (n.includes("wood") || /\dw/.test(n)) return { cat: "Wood", Icon: Zap };
  if (n.includes("hybrid")) return { cat: "Hybrid", Icon: Triangle };
  if (n.includes("iron") || /\d.*jern|^\d+i$/.test(n)) return { cat: "Jern", Icon: Layers };
  if (/wedge|pw|gw|sw|lw/.test(n)) return { cat: "Wedge", Icon: Triangle };
  if (n.includes("putter")) return { cat: "Putter", Icon: CircleDot };
  return { cat: "Klubb", Icon: Layers };
}

export function EquipmentGrid({ clubs, onDelete, pending }: Props) {
  if (clubs.length === 0) return null;

  return (
    <>
      <div className="mt-7 mb-3.5 flex items-end justify-between">
        <h3 className="m-0 text-[18px] font-bold tracking-[-0.02em] text-white">Bag-utstyr</h3>
        <div
          className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45"
          style={{ fontFamily: monoFont }}
        >
          {clubs.length} klubber
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {clubs.map((club) => {
          const { cat, Icon } = categoryFor(club);
          return (
            <div
              key={club.id}
              className="grid items-center gap-4 rounded-2xl border px-5 py-4 text-white"
              style={{
                background: "#0D2E23",
                borderColor: "#1a4a3a",
                gridTemplateColumns: "56px 1fr auto",
              }}
            >
              <div
                className="grid h-14 w-14 place-items-center rounded-xl"
                style={{ background: "rgba(209,248,67,0.10)", color: accent }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div
                  className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50"
                  style={{ fontFamily: monoFont }}
                >
                  {cat}
                </div>
                <div className="mt-1 truncate text-[14px] font-bold tracking-[-0.005em] text-white">
                  {club.name}
                  {club.loft != null ? ` · ${club.loft}°` : ""}
                </div>
                <div className="mt-1 truncate text-[12px] text-white/55">
                  {[club.brand, club.model].filter(Boolean).join(" ") || "Ikke spesifisert"}
                  {club.avgCarry != null ? (
                    <span className="ml-2 font-semibold text-white">
                      Carry {club.avgCarry} m
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(club.id)}
                disabled={pending}
                className="grid h-9 w-9 place-items-center rounded-lg border text-white/70 transition-colors hover:border-white/20 hover:bg-white/5 disabled:opacity-50"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
                aria-label={`Fjern ${club.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
