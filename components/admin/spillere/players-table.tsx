"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PlayerHcpTier, PlayerListRow, PlayerStatus } from "./types";

const HCP_PILL: Record<PlayerHcpTier, string> = {
  elite: "bg-[#D1F843] text-[#0A1F18]",
  adv: "bg-[rgba(42,125,90,0.18)] text-[#6FCBA1]",
  mid: "bg-[rgba(0,122,255,0.12)] text-[#6FB3FF]",
  beg: "bg-[rgba(196,138,50,0.18)] text-[#E8B967]",
};

const STATUS_PILL: Record<PlayerStatus, { label: string; className: string }> = {
  active: {
    label: "Aktiv",
    className: "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]",
  },
  "trending-down": {
    label: "Trender ned",
    className: "bg-[rgba(196,138,50,0.22)] text-[#E8B967]",
  },
  inactive: {
    label: "Inaktiv",
    className: "bg-[rgba(184,66,51,0.22)] text-[#F49283]",
  },
  stable: {
    label: "Stabil",
    className: "bg-white/5 text-white/70",
  },
};

const LAST_TONE: Record<PlayerListRow["lastRoundTone"], string> = {
  ok: "text-white/55",
  warn: "text-[#E8B967]",
  alert: "text-[#F49283]",
};

const ROW_GRID =
  "grid grid-cols-[32px_2fr_90px_1.2fr_0.8fr_0.8fr_100px_80px_24px] items-center gap-3.5 px-[18px]";

function formatSg(value: number): string {
  if (value >= 0) return `+${value.toFixed(2)}`;
  return `−${Math.abs(value).toFixed(2)}`;
}

export function PlayersTable({ rows }: { rows: PlayerListRow[] }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] shadow-[0_1px_2px_rgba(10,31,24,0.03),0_6px_20px_rgba(255,255,255,0.04)]">
      <div
        className={
          ROW_GRID +
          " border-b border-[#1a4a3a] bg-white/[0.025] py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45"
        }
      >
        <div />
        <div className="inline-flex cursor-pointer items-center gap-1">
          Navn <ChevronDown className="h-2.5 w-2.5" />
        </div>
        <div className="inline-flex cursor-pointer items-center gap-1">
          HCP <ChevronDown className="h-2.5 w-2.5" />
        </div>
        <div>Plan / Coach</div>
        <div className="inline-flex cursor-pointer items-center gap-1">
          SG (siste 5)
        </div>
        <div>Trend</div>
        <div>Siste runde</div>
        <div>Status</div>
        <div />
      </div>

      {rows.map((row) => {
        const status = STATUS_PILL[row.status];
        return (
          <Link
            key={row.id}
            href={`/portal/admin/spillere/${row.id}`}
            className={
              ROW_GRID +
              " border-b border-[#1a4a3a] py-3.5 text-[13px] last:border-b-0 hover:bg-white/[0.025]"
            }
          >
            <div
              className="flex h-[26px] w-[26px] items-center justify-center rounded-full text-[10px] font-bold text-[#0A1F18]"
              style={{ background: row.avatarColor }}
            >
              {row.initials}
            </div>

            <div>
              <div className="font-semibold text-white">{row.fullName}</div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-white/45">
                {row.username} · medlem siden {row.memberSince}
              </div>
            </div>

            <div>
              <span
                className={
                  "inline-block rounded-[5px] px-2 py-[3px] font-mono text-[11px] font-semibold tabular-nums " +
                  HCP_PILL[row.hcpTier]
                }
              >
                {row.hcp.toFixed(1)}
              </span>
            </div>

            <div className="text-white/85">
              {row.plan} · {row.coach}
            </div>

            <div
              className={
                "font-mono tabular-nums " +
                (row.sgRecent >= 0 ? "text-[#6FCBA1]" : "text-[#F49283]")
              }
            >
              {formatSg(row.sgRecent)}
            </div>

            <div>
              <svg
                viewBox="0 0 80 22"
                preserveAspectRatio="none"
                className="h-[22px] w-full"
              >
                <polyline
                  points={row.sparkPoints}
                  fill="none"
                  stroke={row.sparkColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              className={
                "font-mono text-[10px] tracking-[0.06em] " +
                LAST_TONE[row.lastRoundTone]
              }
            >
              {row.lastRoundLabel}
            </div>

            <div>
              <span
                className={
                  "inline-block rounded-full px-2.5 py-[3px] text-[10px] font-medium " +
                  status.className
                }
              >
                {status.label}
              </span>
            </div>

            <div className="flex justify-end">
              <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            </div>
          </Link>
        );
      })}

      <div className="flex items-center justify-between border-t border-[#1a4a3a] bg-white/[0.025] px-[18px] py-3.5 text-[12px] text-white/55">
        <div>
          Viser 1–{rows.length} av <strong className="text-white">42</strong>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            className="rounded-md border border-[#1a4a3a] bg-[#0D2E23] px-2.5 py-1 text-white/70 hover:bg-white/5"
          >
            ‹ Forrige
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              className={
                "rounded-md border px-2.5 py-1 " +
                (n === 1
                  ? "border-[#D1F843] bg-[#D1F843] text-[#0A1F18]"
                  : "border-[#1a4a3a] bg-[#0D2E23] text-white/70 hover:bg-white/5")
              }
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="rounded-md border border-[#1a4a3a] bg-[#0D2E23] px-2.5 py-1 text-white/70 hover:bg-white/5"
          >
            Neste ›
          </button>
        </div>
      </div>
    </div>
  );
}
