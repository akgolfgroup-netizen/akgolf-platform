import { SectionHeading } from "./section-heading";

interface HcpPoint {
  date: string; // ISO
  handicapIndex: number;
}

interface HcpHistoryCardProps {
  history: HcpPoint[];
  current: number | null;
  goal?: number;
}

export function HcpHistoryCard({ history, current, goal = 5.0 }: HcpHistoryCardProps) {
  const hasData = history.length >= 2;
  const start = hasData ? history[0].handicapIndex : null;
  const lowest = hasData
    ? history.reduce((min, p) => Math.min(min, p.handicapIndex), history[0].handicapIndex)
    : null;

  return (
    <>
      <SectionHeading title="HCP-utvikling" sub="SISTE 12 MND · GOLFBOX-DATA" />

      <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-6 py-6">
        <div className="mb-4 grid grid-cols-2 gap-4 border-b border-[#1a4a3a] pb-4 sm:grid-cols-4">
          <Stat label="Start" value={start !== null ? start.toFixed(1) : "—"} />
          <Stat label="Lavest" value={lowest !== null ? lowest.toFixed(1) : "—"} />
          <Stat label="Nå" value={current !== null ? current.toFixed(1) : "—"} accent />
          <Stat label={`Mål ${new Date().getFullYear()}`} value={goal.toFixed(1)} />
        </div>

        {hasData ? (
          <HcpSvg history={history} goal={goal} />
        ) : (
          <div className="grid h-[180px] place-items-center text-sm text-white/40">
            Ikke nok HCP-data ennå
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-[28px] font-extrabold leading-none tabular-nums tracking-[-0.03em] ${
          accent ? "text-[#D1F843]" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function HcpSvg({ history, goal }: { history: HcpPoint[]; goal: number }) {
  const W = 720;
  const H = 180;
  const pad = { l: 0, r: 0, t: 30, b: 30 };
  const innerH = H - pad.t - pad.b;
  const innerW = W - pad.l - pad.r;

  const values = history.map((p) => p.handicapIndex);
  const min = Math.min(...values, goal) - 0.5;
  const max = Math.max(...values) + 0.5;
  const yOf = (v: number) => pad.t + ((max - v) / (max - min)) * innerH;
  const xOf = (i: number) =>
    history.length === 1
      ? pad.l
      : pad.l + (i / (history.length - 1)) * innerW;

  const points = history.map((p, i) => `${xOf(i)},${yOf(p.handicapIndex)}`).join(" ");
  const areaPath = `M ${xOf(0)} ${yOf(history[0].handicapIndex)} L ${history
    .map((p, i) => `${xOf(i)} ${yOf(p.handicapIndex)}`)
    .join(" L ")} L ${xOf(history.length - 1)} ${H - pad.b} L ${xOf(0)} ${H - pad.b} Z`;

  const last = history[history.length - 1];
  const lastX = xOf(history.length - 1);
  const lastY = yOf(last.handicapIndex);

  const goalY = yOf(goal);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[180px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hcpFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D1F843" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#D1F843" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1={pad.t + innerH * 0.25} x2={W} y2={pad.t + innerH * 0.25} stroke="rgba(255,255,255,0.04)" />
      <line x1="0" y1={pad.t + innerH * 0.5} x2={W} y2={pad.t + innerH * 0.5} stroke="rgba(255,255,255,0.04)" />
      <line x1="0" y1={pad.t + innerH * 0.75} x2={W} y2={pad.t + innerH * 0.75} stroke="rgba(255,255,255,0.04)" />

      <line
        x1="0"
        y1={goalY}
        x2={W}
        y2={goalY}
        stroke="rgba(209,248,67,0.4)"
        strokeDasharray="4 4"
      />
      <text
        x={W - 5}
        y={goalY - 4}
        fill="rgba(209,248,67,0.6)"
        fontSize="10"
        fontFamily="JetBrains Mono"
        textAnchor="end"
      >
        MÅL {goal.toFixed(1)}
      </text>

      <path d={areaPath} fill="url(#hcpFill)" />
      <polyline points={points} fill="none" stroke="#D1F843" strokeWidth="2.5" />
      <circle cx={lastX} cy={lastY} r="10" fill="#D1F843" fillOpacity="0.2" />
      <circle cx={lastX} cy={lastY} r="5" fill="#D1F843" />
    </svg>
  );
}
