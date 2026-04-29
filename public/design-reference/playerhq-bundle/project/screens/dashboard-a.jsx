/* Dashboard A — system-tro refinement of the Spillerportal dashboard.
   Lucide icons, unified data model, one hero card, clear grid hierarchy. */

function DashboardA({ theme = "dark" }) {
  const T = akT(theme);
  const [period, setPeriod] = React.useState("Uke");

  return (
    <div data-screen-label="01 Dashboard — System-tro" style={{
      minHeight: 900, background: T.bg, color: T.text, ...akFont,
    }}>
      <AkTopNav theme={theme} activeTab="Hjem" />

      <div style={{ display: "flex" }}>
        <AkSidebar theme={theme} active={0} />

        <div style={{ flex: 1, padding: "28px 32px 40px 24px", maxWidth: 1340 }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <PlayerHeaderRow theme={theme} />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 14px", borderRadius: 20, border: `1px solid ${T.border}`,
                background: T.card, color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", ...akFont,
              }}>
                <LucideIcon name="calendar" size={13} color={T.muted} /> Kalender
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 14px", borderRadius: 20, border: "none",
                background: T.accentInk, color: theme === "light" ? "#fff" : akC.dark,
                fontSize: 12, fontWeight: 700, cursor: "pointer", ...akFont,
              }}>
                <LucideIcon name="sparkles" size={13} color={theme === "light" ? "#fff" : akC.dark} /> Coach AI
              </button>
            </div>
          </div>

          {/* Main grid: hero activities (tall) · two stat cards · hero siste runde (tall) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr 1fr 260px",
            gridTemplateRows: "auto auto",
            gap: 14,
          }}>
            <ActivitiesA theme={theme} period={period} setPeriod={setPeriod} />
            <HandicapA theme={theme} />
            <TrackmanA theme={theme} />
            <HeroRundeA theme={theme} />

            <PuttingA theme={theme} />
            <TrainingStatusA theme={theme} />
          </div>

          {/* Lower row: sleep + score analysis */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr 260px",
            gap: 14, marginTop: 14,
          }}>
            <SleepA theme={theme} />
            <ScoreAnalysisA theme={theme} />
            <NextSessionA theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Cards ─── */

function ActivitiesA({ theme, period, setPeriod }) {
  const T = akT(theme);
  const weekData = [[15,20],[25,18],[10,22],[30,28],[18,35],[8,12],[22,15]];
  const weekLabels = ["Man","Tir","Ons","I dag","Tor","Fre","Lør"];
  return (
    <AkCard theme={theme} glow style={{ gridRow: "span 2", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AkDot c={T.accentInk} s={8} />
          <span style={{ color: T.accentInk, fontWeight: 700, fontSize: 14, ...akFont, letterSpacing: "-.005em" }}>Aktiviteter</span>
        </div>
        <LucideIcon name="more-horizontal" size={16} color={T.muted} />
      </div>

      {/* Streak banner */}
      <div style={{
        padding: "10px 12px", borderRadius: 10,
        background: `${T.accentInk}12`, border: `1px solid ${T.accentInk}2A`,
        marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
      }}>
        <LucideIcon name="flame" size={13} color={T.accentInk} />
        <span style={{ fontSize: 11, color: T.accentInk, fontWeight: 600, ...akFont, letterSpacing: ".005em" }}>Du har 12-dagers treningsstreak</span>
        <LucideIcon name="x" size={13} color={T.muted} style={{ marginLeft: "auto", cursor: "pointer" }} />
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {["Uke", "Måned", "År", "Totalt"].map(p => (
          <AkPill key={p} active={period === p} onClick={() => setPeriod(p)} small theme={theme}>{p}</AkPill>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: "-.02em", ...akFont }}>4t 47m</div>
        <AkMeta tone="success" theme={theme}>+12%</AkMeta>
      </div>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, ...akFont }}>Denne uken · forrige uke 4t 15m</div>

      <AkWeekBars data={weekData} labels={weekLabels} todayIdx={3} theme={theme} h={130} />

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 11, color: T.muted, ...akFont }}>I dag · 1 treningsøkt</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, ...akFont }}>
          <LucideIcon name="flag" size={12} color={T.text} />
          <span style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>68 slag</span>
        </div>
      </div>
    </AkCard>
  );
}

function HandicapA({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme}>
      <AkCardHeader icon="flag" title="Handicap" theme={theme} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <AkRing value={15.9} max={36} size={96} strokeWidth={7} label="15.9" sublabel="HCP" theme={theme} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, marginBottom: 4, ...akFont }}>Trend</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: akC.success, ...akFont, letterSpacing: "-.01em" }}>−0.4</span>
            <span style={{ fontSize: 10, color: T.muted, ...akFont }}>siste 30d</span>
          </div>
          <AkAreaChart data={[18.1, 17.8, 17.4, 17.0, 16.9, 16.5, 16.2, 16.0, 15.9]} theme={theme} h={40} color={akC.success} />
        </div>
      </div>
    </AkCard>
  );
}

function TrackmanA({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LucideIcon name="target" size={14} color={akC.danger} />
          <span style={{ color: T.text, fontWeight: 600, fontSize: 13, ...akFont, letterSpacing: "-.005em" }}>TrackMan Data</span>
        </div>
        <button style={{
          padding: "4px 10px", borderRadius: 12,
          background: theme === "light" ? T.bg : "#081A13",
          border: `1px solid ${T.border}`,
          fontSize: 10, color: T.muted, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4, ...akFont,
        }}>Siste økt <LucideIcon name="chevron-down" size={10} color={T.muted} /></button>
      </div>
      <AkSignalBars count={40} h={60} theme={theme} dangerRange={[14, 20]} seed={5} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: T.muted, ...akFont }}>
        <span>9:00</span><span>9:30</span><span>10:00</span><span>10:30</span><span>11:00</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
        <div>
          <div style={{ fontSize: 10, color: T.muted, ...akFont, marginBottom: 2 }}>Ball speed</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, ...akFont }}>153 <span style={{ fontSize: 10, color: T.muted, fontWeight: 400 }}>mph</span></div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.muted, ...akFont, marginBottom: 2 }}>Smash</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, ...akFont }}>1,48</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.muted, ...akFont, marginBottom: 2 }}>Carry</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, ...akFont }}>245 <span style={{ fontSize: 10, color: T.muted, fontWeight: 400 }}>m</span></div>
        </div>
      </div>
    </AkCard>
  );
}

function HeroRundeA({ theme }) {
  const isDark = theme === "dark";
  return (
    <div style={{
      gridRow: "span 2", borderRadius: 16, overflow: "hidden", position: "relative",
      background: isDark
        ? `linear-gradient(160deg, ${akC.accent}33 0%, ${akC.primary} 45%, ${akC.dark} 100%)`
        : `linear-gradient(160deg, ${akC.accent}66 0%, ${akC.primary} 50%, #0F3A2B 100%)`,
      minHeight: 360,
      border: `1px solid ${isDark ? akC.darkBorder : akC.lightBorder}`,
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 25%, ${akC.accent}22, transparent 65%)` }} />

      {/* Badge */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        padding: "4px 10px", borderRadius: 12,
        background: `${akC.dark}66`, backdropFilter: "blur(8px)",
        fontSize: 10, fontWeight: 700, color: akC.accent,
        letterSpacing: ".08em", textTransform: "uppercase", ...akFont,
        border: `1px solid ${akC.accent}33`,
      }}>Siste runde</div>

      {/* Silhouette flag */}
      <svg viewBox="0 0 80 80" style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 90, height: 90, opacity: 0.55 }}>
        <line x1="20" y1="14" x2="20" y2="70" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 14 L55 20 L20 30 Z" fill={akC.accent} />
        <circle cx="20" cy="70" r="4" fill="#fff" />
      </svg>

      <div style={{
        position: "absolute", bottom: 12, left: 12, right: 12, padding: 14,
        background: `${akC.white}14`, backdropFilter: "blur(14px)",
        borderRadius: 14, border: `1px solid ${akC.white}18`,
        ...akFont,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-.03em" }}>
            78<span style={{ fontSize: 14, fontWeight: 400, color: akC.darkMutedSoft, marginLeft: 4 }}>slag</span>
          </div>
          <span style={{
            padding: "3px 8px", borderRadius: 10,
            background: `${akC.success}44`, color: "#C4F3D7",
            fontSize: 10, fontWeight: 700, ...akFont,
          }}>+3</span>
        </div>
        <div style={{ fontSize: 11, color: akC.darkMutedSoft, marginBottom: 10 }}>Onsdag, 9. april · Gamle Fredrikstad GK</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["clock",       "3t 45m",         akC.accent],
            ["map-pin",     "18 hull",         akC.accent],
            ["target",      "32 putts",        akC.danger],
            ["thumbs-up",   "Bra · 11 GIR",   akC.success],
          ].map(([ic, text, c]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#fff" }}>
              <LucideIcon name={ic} size={12} color={c} />{text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PuttingA({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme}>
      <AkCardHeader icon="circle-dot" title="Putting" theme={theme} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <AkKpi value="1,72" label="putts/hull" theme={theme} size={34} />
        <AkGauge value={62} color={akC.success} theme={theme} size={96} />
      </div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 6, ...akFont }}>Mål: 1,60 · denne sesongen</div>
    </AkCard>
  );
}

function TrainingStatusA({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme}>
      <AkCardHeader icon="activity" title="Treningsstatus" theme={theme} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "-.02em", ...akFont, lineHeight: 1 }}>5 <span style={{ fontSize: 14, color: T.muted, fontWeight: 500 }}>/ 7</span></div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4, ...akFont }}>økter denne uken</div>
        </div>
        <AkWaterBars filled={5} total={7} theme={theme} />
      </div>
      <div style={{ marginTop: 12, fontSize: 10, color: akC.success, fontWeight: 600, ...akFont }}>På plan · 2 økter til i uken</div>
    </AkCard>
  );
}

function SleepA({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme}>
      <AkCardHeader icon="moon-star" title="Søvnscore" theme={theme} />
      <AkSleepChart theme={theme} h={84} />
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 11, color: T.muted, ...akFont }}>Bra</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "-.02em", ...akFont }}>8,5</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.muted, ...akFont }}>
          <LucideIcon name="clock" size={11} color={T.muted} /> 7t 45m
        </div>
      </div>
    </AkCard>
  );
}

function ScoreAnalysisA({ theme }) {
  const T = akT(theme);
  const rows = [
    { label: "Driving",    val: "245 m",  goal: "260 m",    pct: 68, tone: "warn" },
    { label: "Jern",       val: "165 m",  goal: "170 m",    pct: 82, tone: "ok" },
    { label: "Putting",    val: "1,72",   goal: "1,60",     pct: 54, tone: "warn" },
    { label: "Short game", val: "3,1",    goal: "2,8",      pct: 61, tone: "warn" },
  ];
  return (
    <AkCard theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LucideIcon name="bar-chart-3" size={14} color={T.muted} />
          <span style={{ color: T.text, fontWeight: 600, fontSize: 13, ...akFont, letterSpacing: "-.005em" }}>Scoreanalyse</span>
        </div>
        <span style={{ color: T.accentInk, fontSize: 11, fontWeight: 700, ...akFont, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
          Vis alt <LucideIcon name="arrow-right" size={11} color={T.accentInk} />
        </span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.muted, ...akFont, marginBottom: 4 }}>
          <span>HCP: 15.9 <span style={{ color: akC.success, marginLeft: 6 }}>Aktiv</span></span>
          <span>Spredning: ±3,2</span>
        </div>
        <AkHcpBar position={42} theme={theme} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: T.muted, ...akFont }}>
          <span>10,0</span><span>18,5</span><span>25,0</span><span>36,0</span>
        </div>
      </div>

      <div>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "90px 70px 1fr 60px 40px",
            alignItems: "center", gap: 12,
            padding: "11px 0",
            borderTop: i === 0 ? `1px solid ${T.border}` : "none",
            borderBottom: `1px solid ${T.border}`, ...akFont,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.accentInk }}>{r.val}</span>
            <div style={{ height: 4, borderRadius: 2, background: theme === "light" ? "#EEF2F1" : `${akC.darkMuted}22`, overflow: "hidden" }}>
              <div style={{ width: `${r.pct}%`, height: "100%", background: r.tone === "ok" ? akC.success : akC.warning, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: T.muted, textAlign: "right" }}>Mål {r.goal}</span>
            <span style={{ fontSize: 11, color: r.tone === "ok" ? akC.success : akC.warning, textAlign: "right", fontWeight: 600 }}>{r.pct}%</span>
          </div>
        ))}
      </div>
    </AkCard>
  );
}

function NextSessionA({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme}>
      <AkCardHeader icon="calendar-check" title="Neste økt" theme={theme} />
      <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, ...akFont, marginBottom: 4 }}>Torsdag 10:00</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, ...akFont, letterSpacing: "-.01em", marginBottom: 2 }}>Putting-lab</div>
      <div style={{ fontSize: 11, color: T.muted, ...akFont, marginBottom: 12 }}>med coach Andreas</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ padding: "3px 8px", borderRadius: 10, background: `${akC.primary}22`, color: T.accentInk, fontSize: 10, fontWeight: 600, ...akFont }}>60 min</span>
        <span style={{ padding: "3px 8px", borderRadius: 10, background: theme === "light" ? "#EEF2F1" : `${akC.darkMuted}22`, color: T.muted, fontSize: 10, fontWeight: 600, ...akFont }}>Innendørs</span>
      </div>
      <button style={{
        width: "100%", padding: "9px 12px", borderRadius: 12,
        background: T.accentInk, color: theme === "light" ? "#fff" : akC.dark,
        border: "none", cursor: "pointer",
        fontSize: 12, fontWeight: 700, ...akFont,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        Forbered økt <LucideIcon name="arrow-right" size={12} color={theme === "light" ? "#fff" : akC.dark} />
      </button>
    </AkCard>
  );
}

Object.assign(window, { DashboardA });
