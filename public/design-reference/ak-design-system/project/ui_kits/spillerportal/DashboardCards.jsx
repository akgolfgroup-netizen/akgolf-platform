/* Dashboard cards — specific compositions for the Spillerportal */

function ActivitiesCard({ theme, period, setPeriod }) {
  const T = useT(theme);
  const fg = theme === "light" ? C.lightText : C.white;
  const mutedFg = theme === "light" ? C.lightMuted : C.muted;

  const weekData = [[15,20],[25,18],[10,22],[30,28],[18,35],[8,12],[22,15]];
  const weekLabels = ["Man","Tir","Ons","I dag","Tor","Fre","Lør"];

  return (
    <Card theme={theme} glow style={{ gridRow: "span 2", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Dot c={C.accent} s={8} />
          <span style={{ color: C.accent, fontWeight: 700, fontSize: 14, ...font }}>Aktiviteter</span>
        </div>
        <span style={{ color: mutedFg, fontSize: 16, cursor: "pointer" }}>⋯</span>
      </div>

      <div style={{
        padding: "8px 12px", borderRadius: 10,
        background: `${C.accent}12`, border: `1px solid ${C.accent}25`,
        marginBottom: 14, display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 12 }}><LucideIcon name="star" size={12} color={C.accent} /></span>
        <span style={{ fontSize: 11, color: C.accent, ...font }}>Du har 12-dagers treningsstreak</span>
        <span style={{ marginLeft: "auto", color: mutedFg, fontSize: 14, cursor: "pointer" }}>✕</span>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {["Uke", "Måned", "År", "Totalt"].map(p => (
          <Pill key={p} active={period === p} onClick={() => setPeriod(p)} small theme={theme}>{p}</Pill>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: fg, marginBottom: 4, ...font }}>Denne uken</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: mutedFg, ...font }}>Forrige uke</span>
        <span style={{
          padding: "2px 10px", borderRadius: 10,
          background: `${C.accent}20`, color: theme === "light" ? C.primary : C.accent,
          fontSize: 10, fontWeight: 600, ...font,
        }}>4t 15m</span>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 120, paddingBottom: 16 }}>
          {[40, 30, 20, 10].map(v => (
            <span key={v} style={{ fontSize: 8, color: mutedFg, ...font, textAlign: "right", width: 16 }}>{v}</span>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <WeekBars data={weekData} labels={weekLabels} todayIdx={3} />
        </div>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 11, color: mutedFg, ...font }}>I dag 1 treningsøkt</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: fg, fontWeight: 600, ...font }}><LucideIcon name="flag-triangle-right" size={12} />68 slag</span>
          <span style={{ color: mutedFg, fontSize: 14 }}>⋯</span>
        </div>
      </div>
    </Card>
  );
}

function HandicapCard({ theme }) {
  const fg = theme === "light" ? C.lightText : C.white;
  return (
    <Card theme={theme}>
      <CardHeader icon={<LucideIcon name="flag-triangle-right" size={14} />} title="Handicap" theme={theme} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: fg }}>
        <CircleProgress value={15.9} max={36} size={90} strokeWidth={6}
          label="15.9" sublabel="HCP"
          color={theme === "light" ? C.primary : C.accent} />
      </div>
    </Card>
  );
}

function TrackmanCard({ theme }) {
  const T = useT(theme);
  const mutedFg = theme === "light" ? C.lightMuted : C.muted;
  return (
    <Card theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.danger }}><LucideIcon name="target" size={14} /></span>
          <span style={{ color: theme === "light" ? C.lightText : C.white, fontWeight: 600, fontSize: 13, ...font }}>TrackMan Data</span>
        </div>
        <div style={{
          padding: "3px 10px", borderRadius: 12,
          background: theme === "light" ? C.white : T.card,
          border: `1px solid ${T.border}`,
          fontSize: 10, color: mutedFg, ...font,
        }}>Siste økt ▾</div>
      </div>
      <SignalBars count={35} h={55} color={theme === "light" ? C.primary : C.accent} dangerRange={[12, 18]} seed={5} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: mutedFg, ...font }}>
        <span>9:00</span><span>9:30</span><span>10:00</span><span>10:30</span><span>11:00</span>
      </div>
    </Card>
  );
}

function HeroCard({ theme }) {
  const isDark = theme === "dark";
  return (
    <div style={{
      gridRow: "span 2", borderRadius: 16, overflow: "hidden", position: "relative",
      background: isDark
        ? `linear-gradient(160deg, ${C.accent}30 0%, ${C.primary} 40%, ${C.bg} 100%)`
        : `linear-gradient(160deg, ${C.accent}50 0%, ${C.primary} 55%, #103729 100%)`,
      minHeight: 300,
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${C.accent}15, transparent 70%)` }} />
      <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", color: `${C.accent}aa` }}><LucideIcon name="flag-triangle-right" size={72} /></div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: 16,
        background: `linear-gradient(transparent, ${C.bg}ee)`,
      }}>
        <div style={{
          background: `${C.white}12`, backdropFilter: "blur(12px)",
          borderRadius: 14, padding: 14, border: `1px solid ${C.white}15`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Dot c={C.accent} />
            <span style={{ color: C.accent, fontWeight: 600, fontSize: 12, ...font }}>Siste runde ▾</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.white, ...font, lineHeight: 1 }}>
            78<span style={{ fontSize: 14, fontWeight: 400, color: C.mutedLight, marginLeft: 4 }}>slag</span>
          </div>
          <div style={{ fontSize: 11, color: C.mutedLight, marginTop: 6, ...font }}>Onsdag, 9. april</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
            {[
              ["timer", "3t 45m", C.accent],
              ["map-pin", "Gamle Fredrikstad GK", C.accent],
              ["heart-pulse", "32 putts", C.danger],
              ["thumbs-up", "Bra", C.green],
            ].map(([ic, text, c]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.white, ...font }}>
                <span style={{ color: c }}><LucideIcon name={ic} size={12} /></span>{text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PuttingCard({ theme }) {
  const fg = theme === "light" ? C.lightText : C.white;
  const mutedFg = theme === "light" ? C.lightMuted : C.muted;
  return (
    <Card theme={theme}>
      <CardHeader icon={<LucideIcon name="flag-triangle-right" size={14} />} title="Putting" theme={theme} />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: fg, ...font, lineHeight: 1 }}>1.72</div>
          <div style={{ fontSize: 10, color: mutedFg, ...font, marginTop: 4 }}>putts/hull</div>
        </div>
        <Gauge value={65} color={C.green} />
      </div>
    </Card>
  );
}

function TrainingStatusCard({ theme }) {
  const mutedFg = theme === "light" ? C.lightMuted : C.muted;
  return (
    <Card theme={theme}>
      <CardHeader icon={<LucideIcon name="droplets" size={14} />} title="Treningsstatus" theme={theme} />
      <WaterBars filled={5} total={8} />
      <div style={{ fontSize: 12, color: mutedFg, ...font, marginTop: 8 }}>5 / 7 økter</div>
    </Card>
  );
}

function SleepScoreCard({ theme }) {
  const T = useT(theme);
  const fg = theme === "light" ? C.lightText : C.white;
  const mutedFg = theme === "light" ? C.lightMuted : C.muted;
  return (
    <Card theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LucideIcon name="moon" size={14} />
          <span style={{ color: fg, fontWeight: 600, fontSize: 13, ...font }}>Søvnscore</span>
        </div>
        <span style={{ color: mutedFg, cursor: "pointer" }}>⋯</span>
      </div>
      <SleepChart />
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 14, paddingTop: 10, borderTop: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: mutedFg, ...font }}><LucideIcon name="zap" size={12} />Bra</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: fg, ...font }}>8,5</span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: mutedFg, ...font }}><LucideIcon name="clock" size={12} />7t 45m</span>
      </div>
    </Card>
  );
}

function ScoreAnalysisCard({ theme }) {
  const fg = theme === "light" ? C.lightText : C.white;
  const mutedFg = theme === "light" ? C.lightMuted : C.muted;
  return (
    <Card theme={theme} style={{ gridColumn: "span 2" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LucideIcon name="chart-column" size={14} />
          <span style={{ color: fg, fontWeight: 600, fontSize: 13, ...font }}>Scoreanalyse</span>
        </div>
        <span style={{ color: theme === "light" ? C.primary : C.accent, fontSize: 11, fontWeight: 600, ...font, cursor: "pointer" }}>Vis alt</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: mutedFg, ...font, marginBottom: 4 }}>HCP: 15.9 (Aktiv)</div>
        <HcpBar position={42} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: mutedFg, ...font }}>
          <span>10</span><span>18,5</span><span>25,0</span><span>36,0</span>
        </div>
        <div style={{ fontSize: 9, color: mutedFg, ...font, marginTop: 2 }}>HCP: handicapindeks</div>
      </div>

      <NutritionTable />
    </Card>
  );
}

Object.assign(window, {
  ActivitiesCard, HandicapCard, TrackmanCard, HeroCard,
  PuttingCard, TrainingStatusCard, SleepScoreCard, ScoreAnalysisCard,
});
