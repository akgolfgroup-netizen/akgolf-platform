"use client";

import { CheckCircle2, Calendar, MessageCircle } from "lucide-react";

export interface TrainingVolumeDay {
  day: string;
  pct: number;
  isToday?: boolean;
  isEmpty?: boolean;
}

export interface TrainingHeroData {
  weekProgressPct: number;
  loggedSessions: number;
  totalSessions: number;
  description: string;
  weekVolume: TrainingVolumeDay[];
  weekHours: string;
  weekGoalHours: string;
  activeDaysPerWeek: number;
  trendVsPrevious: string;
}

export function TrainingHero({ data }: { data: TrainingHeroData }) {
  return (
    <section
      className="relative overflow-hidden rounded-[22px] border-[1.5px] px-8 py-7 mb-6 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]"
      style={{
        background:
          "radial-gradient(circle at 75% 30%, rgba(209,248,67,0.10), transparent 60%), #0D2E23",
        borderColor: "rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.08)",
      }}
    >
      <div>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#D1F843] mb-2.5">
          Programstatus · uke 4 av 12
        </div>
        <h2 className="font-display m-0 text-[28px] font-extrabold leading-[1.2] tracking-[-0.025em] text-white">
          Du har gjort{" "}
          <em className="not-italic text-[#D1F843]">{data.weekProgressPct} %</em>
          <br />
          av denne ukens drills.
        </h2>
        <p className="mt-3 text-sm leading-[1.6] text-white/70 max-w-[50ch]">
          {data.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1F843] bg-[#D1F843] px-3.5 py-2 text-sm font-semibold text-[#0A1F18] hover:bg-[#C7EE3F] transition">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.4} />
            Logg dagens økt
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">
            <Calendar className="w-3.5 h-3.5" />
            Se ukesplan
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3.5 py-2 text-sm font-semibold text-white/70 hover:bg-white/5 transition">
            <MessageCircle className="w-3.5 h-3.5" />
            Spør coach
          </button>
        </div>
      </div>

      <VolumeCard data={data} />
    </section>
  );
}

function VolumeCard({ data }: { data: TrainingHeroData }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-6 py-5">
      <div className="flex items-end justify-between mb-4">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/55">
          Treningsvolum · denne uken
        </span>
        <span className="font-mono text-[11px] font-bold text-[#D1F843]">
          {data.weekHours} · MÅL {data.weekGoalHours}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2 h-[100px] items-end">
        {data.weekVolume.map((d) => (
          <div
            key={d.day}
            className="flex flex-col items-center gap-1 h-full justify-end"
          >
            <div
              className={[
                "w-full rounded min-h-[4px]",
                d.isToday
                  ? "bg-gradient-to-t from-[#D1F843] to-[#6FCBA1] shadow-[0_0_8px_rgba(209,248,67,0.40)]"
                  : d.isEmpty
                    ? "bg-white/[0.06]"
                    : "bg-[#D1F843]",
              ].join(" ")}
              style={{ height: `${Math.max(4, d.pct)}%` }}
            />
            <div
              className={`font-mono text-[9px] tracking-[0.10em] mt-0.5 ${
                d.isToday ? "text-[#D1F843] font-bold" : "text-white/50"
              }`}
            >
              {d.day}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-3">
        <FootStat
          value={String(data.activeDaysPerWeek)}
          suffix="/ uke"
          label="Aktive dager"
        />
        <FootStat value={String(data.loggedSessions)} label="Logg-økter" />
        <FootStat value={data.trendVsPrevious} suffix="vs forrige" label="Trend" />
      </div>
    </div>
  );
}

function FootStat({
  value,
  suffix,
  label,
}: {
  value: string;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="text-[11px] text-white/55">
      <strong className="block text-white text-base font-extrabold mb-0 tracking-[-0.02em]">
        {value}
        {suffix && (
          <small className="text-[11px] font-normal text-white/50 ml-0.5">
            {suffix}
          </small>
        )}
      </strong>
      {label}
    </div>
  );
}
