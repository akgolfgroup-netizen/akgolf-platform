/* Charts — hand-rolled SVG/div primitives matching the Spillerportal mockup */

function WeekBars({ data, labels, todayIdx = 3 }) {
  const mx = Math.max(...data.flat());
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
      {data.map((pair, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 100 }}>
            <div style={{
              width: 10, borderRadius: 3, background: `${C.accent}55`,
              height: `${(pair[0] / mx) * 90}%`, transition: "height .3s",
            }} />
            <div style={{
              width: 10, borderRadius: 3, background: C.accent,
              height: `${(pair[1] / mx) * 90}%`, transition: "height .3s",
            }} />
          </div>
          <span style={{
            fontSize: 9,
            color: i === todayIdx ? C.white : C.muted,
            fontWeight: i === todayIdx ? 700 : 400,
            ...font,
          }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function CircleProgress({ value, max, size = 72, strokeWidth = 5, label, sublabel, color = C.accent, trackColor }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / max;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor || `${C.muted}25`} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.3, fontWeight: 800, color: "inherit", ...font, lineHeight: 1 }}>{label}</span>
        {sublabel && <span style={{ fontSize: 8, color: C.muted, ...font, marginTop: 2 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

function SignalBars({ count = 30, h = 50, color = C.accent, dangerRange = [10, 16], seed = 0 }) {
  // deterministic-ish heights per render via seeded pseudo-random
  const rng = React.useMemo(() => {
    let s = seed || 1;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }, [seed, count]);
  const heights = React.useMemo(() => Array.from({ length: count }, () => 8 + rng() * 35), [count, seed]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 1.5, height: h }}>
      {heights.map((base, i) => {
        const isDanger = i >= dangerRange[0] && i < dangerRange[1];
        return <div key={i} style={{
          width: 3, borderRadius: 1.5,
          height: base,
          background: isDanger ? C.danger : i % 3 === 0 ? `${color}60` : color,
          transition: "height .2s",
        }} />;
      })}
    </div>
  );
}

function Gauge({ value = 35, max = 100, color = C.green }) {
  const pct = value / max;
  return (
    <div style={{ position: "relative", width: 80, height: 44, overflow: "hidden" }}>
      <svg width={80} height={44} viewBox="0 0 80 44">
        <path d="M5 40 A35 35 0 0 1 75 40" fill="none" stroke={`${C.muted}25`} strokeWidth={5} strokeLinecap="round" />
        <path d="M5 40 A35 35 0 0 1 75 40" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={`${pct * 110} 110`} />
      </svg>
    </div>
  );
}

function WaterBars({ filled = 5, total = 8, seed = 2 }) {
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: 4, height: 12 + rng() * 14, borderRadius: 2,
          background: i < filled ? C.accent : `${C.muted}30`,
        }} />
      ))}
    </div>
  );
}

function SleepChart() {
  const stages = ["Våken", "REM", "Lett", "Dyp"];
  const colors = [C.danger, C.accent, `${C.accent}70`, C.yellow];
  const pattern = React.useMemo(() => {
    const pts = []; let y = 2; let s = 17;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 60; i++) {
      if (rng() > 0.85) y = Math.max(0, Math.min(3, y + Math.floor(rng() * 3) - 1));
      pts.push(y);
    }
    return pts;
  }, []);
  return (
    <div style={{ position: "relative", height: 80 }}>
      {stages.map((s, row) => (
        <div key={s} style={{ position: "absolute", left: 0, right: 0, top: row * 20, height: 18, display: "flex", alignItems: "center" }}>
          <span style={{ width: 40, fontSize: 9, color: C.muted, ...font, textAlign: "right", paddingRight: 8, flexShrink: 0 }}>{s}</span>
          <div style={{ flex: 1, height: 14, display: "flex", gap: 0.5 }}>
            {pattern.map((v, i) => (
              <div key={i} style={{
                flex: 1,
                background: v === row ? colors[row] : "transparent",
                borderRadius: 1,
                opacity: v === row ? (row === 0 ? 0.9 : 0.75) : 0,
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HcpBar({ position = 42 }) {
  return (
    <div style={{
      position: "relative", height: 8, borderRadius: 4,
      background: `linear-gradient(90deg, ${C.green}, ${C.yellow}, ${C.danger})`,
      marginTop: 8,
    }}>
      <div style={{
        position: "absolute", left: `${position}%`, top: -3,
        width: 14, height: 14, borderRadius: "50%",
        background: C.white, border: `2px solid ${C.bg}`, transform: "translateX(-50%)",
      }} />
    </div>
  );
}

function NutritionTable() {
  const rows = [
    { label: "Driving", val: "245 m", avg: "Avg distanse", goal: "260 m Mål", pct: "43,5%" },
    { label: "Jern", val: "165 m", avg: "Avg distanse", goal: "170 m Mål", pct: "43,5%" },
    { label: "Putting", val: "1.72", avg: "Avg putts/hull", goal: "1.60 Mål", pct: "43,5%" },
    { label: "Short game", val: "3.1", avg: "Avg opp-ned", goal: "2.8 Mål", pct: "43,5%" },
  ];
  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "9px 0", borderBottom: `1px solid ${C.border}`, ...font,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.white, width: 80 }}>{r.label}</span>
          <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, width: 50 }}>{r.val}</span>
          <span style={{ fontSize: 10, color: C.muted, flex: 1 }}>{r.avg}</span>
          <span style={{ fontSize: 10, color: C.accent, width: 60, textAlign: "right" }}>{r.goal}</span>
          <span style={{ fontSize: 10, color: C.muted, width: 40, textAlign: "right" }}>{r.pct}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  WeekBars, CircleProgress, SignalBars, Gauge, WaterBars, SleepChart, HcpBar, NutritionTable,
});
