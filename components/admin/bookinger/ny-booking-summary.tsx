"use client";

import Link from "next/link";
import {
  Calendar,
  Check,
  Dumbbell,
  MapPin,
  MessageSquare,
  Repeat,
  Save,
  User,
  UserCheck,
} from "lucide-react";

const SUMMARY_ROWS = [
  { icon: User, k: "Spiller", v: "Sofie Holm · HCP 4.2" },
  { icon: Dumbbell, k: "Type · Fokus", v: "Coaching · Short-game (bunker)" },
  { icon: UserCheck, k: "Coach", v: "Erik S. · short-game-spesialist" },
  { icon: MapPin, k: "Lokasjon", v: "Bunker (utendørs)" },
  { icon: Calendar, k: "Når", v: "Fredag 2. mai · 14:00–14:30" },
  { icon: Repeat, k: "Gjentakelse", v: "Engangs" },
];

const FRIDAY_SCHEDULE = [
  { t: "09:00", who: "Pelle K. · Putting" },
  { t: "10:30", who: "Tor S. · Chip" },
  { t: "11:30", who: "Markus E. · Bunker" },
  { t: "13:30", who: "Camilla R. · Putting" },
  { t: "14:00", who: "Sofie H. · Bunker (NY)", highlight: true },
  { t: "15:30", who: "Anne M. · Chip" },
  { t: "17:00", who: "Henrik V. · Putting" },
];

export function NyBookingSummary() {
  return (
    <div>
      {/* Sticky summary card */}
      <div
        className="sticky top-[78px] overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.04]"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
      >
        {/* Header */}
        <div
          className="border-b border-white/8 px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(209,248,67,0.10), rgba(209,248,67,0.04))",
            borderBottomColor: "rgba(255,255,255,0.10)",
          }}
        >
          <div
            className="font-mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: "#D1F843" }}
          >
            Forhåndsvisning · Live
          </div>
          <h3
            className="mt-1 text-[22px] font-medium leading-tight tracking-tight text-white"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Short-game-økt
            <br />
            med Erik S.
          </h3>
        </div>

        {/* Rows */}
        {SUMMARY_ROWS.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.k}
              className="flex items-start gap-3.5 border-b border-white/8 px-5 py-3 text-[13px] last:border-b-0"
            >
              <div className="w-5 flex-shrink-0 pt-0.5 text-white/50">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
                  {r.k}
                </div>
                <div className="mt-0.5 font-medium text-white">{r.v}</div>
              </div>
            </div>
          );
        })}

        {/* Note row */}
        <div className="flex items-start gap-3.5 border-b border-white/8 px-5 py-3 text-[13px]">
          <div className="w-5 flex-shrink-0 pt-0.5 text-white/50">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
              Notat (SMS)
            </div>
            <div className="mt-0.5 text-[12px] leading-relaxed text-white/70">
              «Møt opp med wedge og bunker-jern. 5–10 min oppvarming først.»
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t border-white/8 px-5 py-4"
          style={{ background: "rgba(0,0,0,0.20)" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[12px] text-white/60">Pris</div>
              <div className="mt-1 font-mono text-[22px] font-bold text-white">
                490 <span className="text-[12px] font-medium text-white/50">kr</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
                Belastes
              </div>
              <div className="mt-1 font-mono text-[11px] tracking-wider text-white/70">
                PERFORMANCE +<br />SUPPLEMENT
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/bookinger"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white/85 transition hover:bg-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
            >
              <Save className="h-3.5 w-3.5" strokeWidth={1.8} /> Lagre utkast
            </Link>
            <Link
              href="/admin/bookinger"
              className="flex flex-[2] items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition hover:opacity-90"
              style={{ background: "#D1F843", color: "#0A1F18" }}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2} /> Bekreft &amp; bok
            </Link>
          </div>
        </div>
      </div>

      {/* Friday context */}
      <div
        className="mt-3.5 rounded-xl border border-white/8 bg-white/[0.04] p-4"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <div className="text-[12px] font-semibold text-white">Fredag 2. mai · Erik S.</div>
          <span className="font-mono text-[10px] tracking-wider text-white/50">7 ØKTER</span>
        </div>
        <div className="flex flex-col gap-1 font-mono text-[11px]">
          {FRIDAY_SCHEDULE.map((s) => (
            <div
              key={s.t}
              className={
                "flex gap-2.5 rounded px-2 py-1.5 " +
                (s.highlight ? "border" : "")
              }
              style={
                s.highlight
                  ? {
                      background: "rgba(209,248,67,0.14)",
                      borderColor: "rgba(209,248,67,0.30)",
                    }
                  : { background: "rgba(255,255,255,0.025)" }
              }
            >
              <span
                className={
                  "w-[50px] " +
                  (s.highlight ? "font-semibold" : "text-white/50")
                }
                style={s.highlight ? { color: "#D1F843" } : undefined}
              >
                {s.t}
              </span>
              <span className={s.highlight ? "font-semibold text-white" : "text-white/85"}>
                {s.who}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
