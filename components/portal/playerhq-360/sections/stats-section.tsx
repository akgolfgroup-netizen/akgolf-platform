"use client";

import { FullDetailLink } from "../accordion-section";

export interface StatsSectionData {
  hcpHistory: { date: string; handicapIndex: number }[];
  sg: {
    driving: number | null;
    approach: number | null;
    short: number | null;
    chip: number | null;
    putt: number | null;
  };
  clubs: { label: string; meters: number; tone: string; pct: number }[];
}

interface StatsSectionProps {
  data: StatsSectionData;
}

export function StatsSection({ data }: StatsSectionProps) {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <CapsLabel>SG-radar · siste 10</CapsLabel>
          <SgRadar sg={data.sg} />
        </div>
        <div>
          <CapsLabel>HCP · 12 måneder</CapsLabel>
          <HcpChart history={data.hcpHistory} />
        </div>
      </div>

      <CapsLabel className="mt-6">Klubb-utvikling · TrackMan-snitt</CapsLabel>
      <div className="mt-3.5 flex flex-col gap-2.5">
        {data.clubs.map((c) => (
          <div
            key={c.label}
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: "90px 1fr 60px" }}
          >
            <div
              className="font-mono text-[11px]"
              style={{
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {c.label}
            </div>
            <div
              className="overflow-hidden"
              style={{
                height: 8,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 999,
              }}
            >
              <span
                className="block h-full"
                style={{
                  width: `${Math.max(0, Math.min(100, c.pct))}%`,
                  background: c.tone,
                  borderRadius: 999,
                }}
              />
            </div>
            <div className="text-right text-[14px] font-bold tabular-nums text-white">
              {c.meters}m
            </div>
          </div>
        ))}
        {data.clubs.length === 0 ? (
          <div className="text-[13px] text-white/55">
            Ingen TrackMan-data registrert ennå.
          </div>
        ) : null}
      </div>

      <FullDetailLink
        meta="DRILL-DOWN PER HULL · WIND ADJ · DISPERSION"
        href="/portal/statistikk"
      />
    </>
  );
}

function CapsLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-[9px] uppercase ${className ?? ""}`}
      style={{
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {children}
    </div>
  );
}

function SgRadar({ sg }: { sg: StatsSectionData["sg"] }) {
  // Normalize to 0-80 (SVG radius)
  const max = 1.5;
  const norm = (v: number | null) =>
    v === null ? 0 : Math.max(0, Math.min(80, ((v + max) / (max * 2)) * 80));

  const pts = [
    { x: 0, y: -norm(sg.driving) },
    { x: norm(sg.approach) * 0.95, y: -norm(sg.approach) * 0.31 },
    { x: norm(sg.short) * 0.59, y: norm(sg.short) * 0.81 },
    { x: -norm(sg.chip) * 0.59, y: norm(sg.chip) * 0.81 },
    { x: -norm(sg.putt) * 0.95, y: -norm(sg.putt) * 0.31 },
  ];

  const polygonPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="grid place-items-center p-2">
      <svg viewBox="0 0 220 200" className="max-w-[220px]">
        <defs>
          <radialGradient id="hq360-rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D1F843" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#D1F843" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <g transform="translate(110,100)">
          <polygon
            points="0,-80 76,-25 47,65 -47,65 -76,-25"
            fill="none"
            stroke="rgba(255,255,255,0.10)"
          />
          <polygon
            points="0,-60 57,-19 35,49 -35,49 -57,-19"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
          />
          <polygon
            points="0,-40 38,-13 24,32 -24,32 -38,-13"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
          />
          <line x1="0" y1="0" x2="0" y2="-80" stroke="rgba(255,255,255,0.08)" />
          <line x1="0" y1="0" x2="76" y2="-25" stroke="rgba(255,255,255,0.08)" />
          <line x1="0" y1="0" x2="47" y2="65" stroke="rgba(255,255,255,0.08)" />
          <line x1="0" y1="0" x2="-47" y2="65" stroke="rgba(255,255,255,0.08)" />
          <line x1="0" y1="0" x2="-76" y2="-25" stroke="rgba(255,255,255,0.08)" />
          <polygon
            points={polygonPoints}
            fill="url(#hq360-rg)"
            stroke="#D1F843"
            strokeWidth="1.5"
          />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D1F843" />
          ))}
          <text
            x="0"
            y="-90"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="#fff"
            textAnchor="middle"
            letterSpacing="1"
          >
            DRIVER
          </text>
          <text
            x="86"
            y="-25"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="#fff"
            textAnchor="start"
            letterSpacing="1"
          >
            APP
          </text>
          <text
            x="50"
            y="80"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="#fff"
            textAnchor="middle"
            letterSpacing="1"
          >
            KORT
          </text>
          <text
            x="-50"
            y="80"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="#fff"
            textAnchor="middle"
            letterSpacing="1"
          >
            CHIP
          </text>
          <text
            x="-86"
            y="-25"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="#fff"
            textAnchor="end"
            letterSpacing="1"
          >
            PUTT
          </text>
        </g>
      </svg>
    </div>
  );
}

function HcpChart({
  history,
}: {
  history: { date: string; handicapIndex: number }[];
}) {
  if (history.length < 2) {
    return (
      <div className="mt-3.5 rounded-xl bg-white/5 p-6 text-center text-[13px] text-white/55">
        For lite HCP-data registrert ennå.
      </div>
    );
  }
  const w = 380;
  const h = 110;
  const xs = history.map((_, i) => (i / (history.length - 1)) * w);
  const ys = history.map((p) => p.handicapIndex);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = Math.max(1, maxY - minY);
  const points = history.map((p, i) => {
    const x = xs[i] ?? 0;
    const y = 20 + ((p.handicapIndex - minY) / range) * (h - 40);
    return { x, y };
  });
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const fillPath = `${path} L${w},${h} L0,${h} Z`;
  const last = points[points.length - 1];
  const first = history[0]?.handicapIndex.toFixed(1) ?? "—";
  const now = history[history.length - 1]?.handicapIndex.toFixed(1) ?? "—";

  return (
    <div className="mt-3.5">
      <svg viewBox="0 0 380 110" preserveAspectRatio="none" className="w-full">
        <defs>
          <linearGradient id="hq360-hcg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D1F843" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#D1F843" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="20"
          x2="380"
          y2="20"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="2,4"
        />
        <line
          x1="0"
          y1="55"
          x2="380"
          y2="55"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="2,4"
        />
        <line
          x1="0"
          y1="90"
          x2="380"
          y2="90"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="2,4"
        />
        <path d={fillPath} fill="url(#hq360-hcg)" />
        <path d={path} fill="none" stroke="#D1F843" strokeWidth="1.8" />
        {last ? <circle cx={last.x} cy={last.y} r="4" fill="#D1F843" /> : null}
      </svg>
      <div
        className="mt-1 flex justify-between font-mono text-[9px]"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        <span>START · {first}</span>
        <span>NÅ · {now}</span>
      </div>
    </div>
  );
}
