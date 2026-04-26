/* Charts — SVG/div primitives matching the AK Golf visual system.
   All accept theme prop; dark-first defaults. */

/* Paired bar chart (week activity) */
function AkWeekBars({ data, labels, todayIdx = 3, theme = "dark", h = 120, color }) {
  const T = akT(theme);
  const accent = color || T.accentInk;
  const mx = Math.max(...data.flat());
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: h, padding: "0 2px" }}>
      {data.map((pair, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: h - 18 }}>
            <div style={{
              width: 10, borderRadius: "3px 3px 0 0", background: `${accent}55`,
              height: `${(pair[0] / mx) * 95}%`, transition: "height .4s ease",
            }} />
            <div style={{
              width: 10, borderRadius: "3px 3px 0 0", background: accent,
              height: `${(pair[1] / mx) * 95}%`, transition: "height .4s ease",
            }} />
          </div>
          <span style={{
            fontSize: 10,
            color: i === todayIdx ? T.text : T.muted,
            fontWeight: i === todayIdx ? 700 : 500,
            ...akFont,
          }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* Circular progress ring */
function AkRing({ value, max, size = 80, strokeWidth = 6, label, sublabel, color, trackColor, theme = "dark" }) {
  const T = akT(theme);
  const c = color || T.accentInk;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={trackColor || (theme === "light" ? "#E6ECEA" : `${akC.darkMuted}22`)}
          strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={strokeWidth}
          strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...akFont }}>
        <span style={{ fontSize: size * 0.3, fontWeight: 800, color: T.text, lineHeight: 1, letterSpacing: "-.02em" }}>{label}</span>
        {sublabel && <span style={{ fontSize: 9, color: T.muted, marginTop: 3, letterSpacing: ".05em", textTransform: "uppercase", fontWeight: 600 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

/* TrackMan-style signal bars */
function AkSignalBars({ count = 30, h = 54, color, dangerRange, seed = 0, theme = "dark" }) {
  const T = akT(theme);
  const c = color || T.accentInk;
  const heights = React.useMemo(() => {
    let s = seed || 1;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: count }, () => 8 + rng() * 40);
  }, [count, seed]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: h }}>
      {heights.map((base, i) => {
        const isDanger = dangerRange && i >= dangerRange[0] && i < dangerRange[1];
        return <div key={i} style={{
          width: 3, borderRadius: 1.5,
          height: base,
          background: isDanger ? akC.danger : i % 3 === 0 ? `${c}66` : c,
        }} />;
      })}
    </div>
  );
}

/* Half-circle gauge */
function AkGauge({ value = 35, max = 100, color, theme = "dark", size = 80 }) {
  const T = akT(theme);
  const c = color || akC.success;
  const pct = Math.min(1, value / max);
  const trackC = theme === "light" ? "#E6ECEA" : `${akC.darkMuted}26`;
  const w = size, hgt = size * 0.55;
  return (
    <div style={{ position: "relative", width: w, height: hgt, overflow: "hidden" }}>
      <svg width={w} height={hgt} viewBox={`0 0 ${w} ${hgt}`}>
        <path d={`M5 ${hgt - 4} A${(w - 10) / 2} ${(w - 10) / 2} 0 0 1 ${w - 5} ${hgt - 4}`} fill="none" stroke={trackC} strokeWidth={6} strokeLinecap="round" />
        <path d={`M5 ${hgt - 4} A${(w - 10) / 2} ${(w - 10) / 2} 0 0 1 ${w - 5} ${hgt - 4}`} fill="none" stroke={c} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${pct * Math.PI * ((w - 10) / 2)} 500`} />
      </svg>
    </div>
  );
}

/* Training status stacked water bars */
function AkWaterBars({ filled = 5, total = 7, seed = 2, theme = "dark" }) {
  const T = akT(theme);
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: 8, height: 14 + rng() * 20, borderRadius: 2,
          background: i < filled ? T.accentInk : (theme === "light" ? "#D8E2DE" : `${akC.darkMuted}33`),
        }} />
      ))}
    </div>
  );
}

/* Sleep chart — 4 stages over time */
function AkSleepChart({ theme = "dark", h = 80 }) {
  const T = akT(theme);
  const stages = ["Våken", "REM", "Lett", "Dyp"];
  const colors = [akC.danger, T.accentInk, `${T.accentInk}88`, akC.yellow];
  const pattern = React.useMemo(() => {
    const pts = []; let y = 2; let s = 17;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 60; i++) {
      if (rng() > 0.82) y = Math.max(0, Math.min(3, y + Math.floor(rng() * 3) - 1));
      pts.push(y);
    }
    return pts;
  }, []);
  return (
    <div style={{ position: "relative", height: h }}>
      {stages.map((s, row) => (
        <div key={s} style={{ position: "absolute", left: 0, right: 0, top: row * (h / 4), height: h / 4 - 2, display: "flex", alignItems: "center" }}>
          <span style={{ width: 40, fontSize: 9, color: T.muted, ...akFont, textAlign: "right", paddingRight: 8, flexShrink: 0, letterSpacing: ".02em" }}>{s}</span>
          <div style={{ flex: 1, height: h / 4 - 4, display: "flex", gap: 0.5 }}>
            {pattern.map((v, i) => (
              <div key={i} style={{
                flex: 1,
                background: v === row ? colors[row] : "transparent",
                borderRadius: 1,
                opacity: v === row ? (row === 0 ? 0.9 : 0.8) : 0,
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* HCP gradient bar with marker */
function AkHcpBar({ position = 42, theme = "dark" }) {
  const T = akT(theme);
  return (
    <div style={{
      position: "relative", height: 8, borderRadius: 4,
      background: `linear-gradient(90deg, ${akC.success}, ${akC.yellow}, ${akC.danger})`,
      marginTop: 6,
    }}>
      <div style={{
        position: "absolute", left: `${position}%`, top: -4,
        width: 16, height: 16, borderRadius: "50%",
        background: T.text, border: `3px solid ${T.card}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        transform: "translateX(-50%)",
      }} />
    </div>
  );
}

/* Contribution heatmap — 12 weeks × 7 days */
function AkHeatmap({ theme = "dark", weeks = 12, seed = 9 }) {
  const T = akT(theme);
  const accent = T.accentInk;
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const grid = React.useMemo(() => Array.from({ length: weeks }, () =>
    Array.from({ length: 7 }, () => Math.floor(rng() * 5))
  ), [weeks, seed]);
  const stops = theme === "light"
    ? ["#EDF1EF", "#CFE3D2", "#9BCFA6", "#5FA877", `${akC.primary}`]
    : [`${akC.darkMuted}22`, `${accent}33`, `${accent}66`, `${accent}AA`, accent];
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {grid.map((col, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {col.map((v, j) => (
            <div key={j} style={{
              width: 12, height: 12, borderRadius: 3,
              background: stops[v],
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* Line/area chart — generic */
function AkAreaChart({ data, theme = "dark", h = 100, color }) {
  const T = akT(theme);
  const c = color || T.accentInk;
  const w = 300;
  const mx = Math.max(...data);
  const mn = Math.min(...data);
  const span = mx - mn || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - mn) / span) * (h - 10) - 5;
    return [x, y];
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h, display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`akAreaGrad-${color || "def"}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.28" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#akAreaGrad-${color || "def"})`} />
      <path d={path} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => i === pts.length - 1 ? (
        <circle key={i} cx={x} cy={y} r={3.5} fill={c} stroke={T.card} strokeWidth={2} />
      ) : null)}
    </svg>
  );
}

/* Radar/SG-style chart — 6 axes */
function AkRadar({ values, labels, theme = "dark", size = 200, color }) {
  const T = akT(theme);
  const c = color || T.accentInk;
  const n = values.length;
  const cx = size / 2, cy = size / 2, R = size / 2 - 24;
  const points = values.map((v, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = R * Math.min(1, Math.max(0, v));
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const rings = [0.25, 0.5, 0.75, 1];
  const poly = points.map(p => p.join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {rings.map((r, i) => (
        <polygon key={i}
          points={Array.from({ length: n }, (_, k) => {
            const a = (Math.PI * 2 * k) / n - Math.PI / 2;
            return `${cx + Math.cos(a) * R * r},${cy + Math.sin(a) * R * r}`;
          }).join(" ")}
          fill="none"
          stroke={theme === "light" ? "#E0E8E5" : `${akC.darkMuted}22`}
          strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, k) => {
        const a = (Math.PI * 2 * k) / n - Math.PI / 2;
        return <line key={k} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R}
          stroke={theme === "light" ? "#E0E8E5" : `${akC.darkMuted}22`} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={`${c}33`} stroke={c} strokeWidth="2" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={c} />
      ))}
      {labels.map((l, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + Math.cos(a) * (R + 14);
        const ly = cy + Math.sin(a) * (R + 14);
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fontSize="10" fontFamily="Inter" fontWeight="600"
          fill={T.muted} style={{ letterSpacing: ".02em" }}>{l}</text>;
      })}
    </svg>
  );
}

Object.assign(window, {
  AkWeekBars, AkRing, AkSignalBars, AkGauge, AkWaterBars,
  AkSleepChart, AkHcpBar, AkHeatmap, AkAreaChart, AkRadar,
});
