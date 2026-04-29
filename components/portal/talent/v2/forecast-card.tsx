"use client";

import { Target } from "lucide-react";

export interface ForecastData {
  expectedHcp: number;
  errorMargin: number;
  best5pct: number;
  worst5pct: number;
  probabilityTarget: number;
  trainingHoursWeek: number;
  description: string;
}

export function ForecastCard({ data }: { data: ForecastData }) {
  return (
    <>
      <div className="flex items-end justify-between mb-3.5 mt-7">
        <h3 className="font-display m-0 text-lg font-bold tracking-[-0.02em] text-white">
          HCP-prognose · 12 måneder
        </h3>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          MONTE CARLO N=10 000 · DAGLIG OPPDATERING
        </div>
      </div>
      <section className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-7 py-6 grid items-start gap-7 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D1F843]/[0.18] text-[#D1F843] font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded mb-3">
            <Target className="w-[11px] h-[11px]" />
            Sikkerhet 95 %
          </div>
          <h4 className="font-display m-0 mb-1.5 text-[17px] font-bold tracking-[-0.01em] text-white">
            Forventet HCP om 12 mnd: {data.expectedHcp.toFixed(1)} ± {data.errorMargin.toFixed(1)}
          </h4>
          <p className="m-0 text-[13px] leading-[1.55] text-white/65 mb-3.5">
            {data.description}
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-white/[0.06]">
            <KV label="Beste 5 % utfall" value={`HCP ${data.best5pct.toFixed(1)}`} accent />
            <KV label="Verste 5 % utfall" value={`HCP ${data.worst5pct.toFixed(1)}`} />
            <KV label="Sannsynlighet nivå D" value={`${data.probabilityTarget} %`} accent />
            <KV label="Treningsvolum krevd" value={`${data.trainingHoursWeek} t / uke`} />
          </div>
        </div>

        <FanChart />
      </section>
    </>
  );
}

function KV({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45 mb-1">
        {label}
      </div>
      <div
        className={`font-display text-lg font-extrabold tracking-[-0.02em] ${
          accent ? "text-[#D1F843]" : "text-white/85"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function FanChart() {
  return (
    <div className="relative h-60">
      <div className="absolute left-0 top-0 bottom-[18px] w-9">
        {[
          { v: "10.0", top: 8 },
          { v: "8.0", top: 56 },
          { v: "6.0", top: 110 },
          { v: "4.0", top: 165 },
        ].map((it) => (
          <span
            key={it.v}
            className="absolute left-0 font-mono text-[9px] text-white/40"
            style={{ top: `${it.top}px` }}
          >
            {it.v}
          </span>
        ))}
        <span className="absolute left-0 bottom-[26px] font-mono text-[9px] text-white/40">
          2.0
        </span>
      </div>
      <svg
        className="absolute left-9 top-0 right-0 bottom-[18px]"
        viewBox="0 0 600 240"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,4" />
        <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,4" />
        <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,4" />
        <line x1="0" y1="220" x2="600" y2="220" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,4" />

        <path
          d="M 0 80 L 60 90 L 150 92 L 240 78 L 330 60 L 420 50 L 510 36 L 600 28 L 600 130 L 510 140 L 420 142 L 330 134 L 240 116 L 150 110 L 60 96 L 0 90 Z"
          fill="rgba(209,248,67,0.10)"
        />
        <path
          d="M 0 84 L 60 92 L 150 96 L 240 84 L 330 68 L 420 60 L 510 50 L 600 46 L 600 110 L 510 124 L 420 130 L 330 122 L 240 110 L 150 102 L 60 94 L 0 86 Z"
          fill="rgba(209,248,67,0.18)"
        />
        <path
          d="M 0 85 C 80 92, 200 100, 300 88 C 400 76, 500 60, 600 54"
          stroke="#D1F843"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 0 110 L 30 102 L 60 96 L 90 88 L 120 92 L 150 86 L 180 90 L 200 84"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1="200"
          y1="15"
          x2="200"
          y2="225"
          stroke="rgba(255,255,255,0.40)"
          strokeDasharray="3,3"
          strokeWidth="1"
        />
        <circle cx="200" cy="84" r="5" fill="#fff" stroke="#0A1F18" strokeWidth="2" />
        <text
          x="200"
          y="14"
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          fontSize="9"
          fill="rgba(255,255,255,0.6)"
          letterSpacing="1"
        >
          I DAG · 8.4
        </text>
        <circle cx="600" cy="54" r="5" fill="#D1F843" />
      </svg>
      <div className="absolute left-9 right-0 bottom-0 grid grid-cols-5 font-mono text-[9px] tracking-[0.10em] uppercase text-white/40">
        <span className="text-center">Apr 25</span>
        <span className="text-center">Jul 25</span>
        <span className="text-center">Okt 25</span>
        <span className="text-center">Jan 26</span>
        <span className="text-center">Apr 26</span>
      </div>
    </div>
  );
}
