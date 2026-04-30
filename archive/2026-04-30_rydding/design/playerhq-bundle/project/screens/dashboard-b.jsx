/* Dashboard B — ALT direction.
   - Left sidebar with labels (not icon-only)
   - Coach-first framing: "I dag" plan card leads, AI-coach brief second
   - Radar (SG-style) + heatmap for data viz
   - Content tabs (Oversikt · Runder · Øvelser · Plan)
   - Denser typography, more expressive hierarchy, same palette */

function DashboardB({ theme = "dark" }) {
  const T = akT(theme);
  const [tab, setTab] = React.useState("Oversikt");

  return (
    <div data-screen-label="03 Dashboard — Coach-first" style={{
      minHeight: 900, background: T.bg, color: T.text, ...akFont,
    }}>
      <div style={{ display: "flex", minHeight: 900 }}>
        <AkLeftNav theme={theme} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AkTopBarB theme={theme} />

          <div style={{ flex: 1, padding: "0 32px 40px" }}>
            {/* Player hero banner — breaks the bento */}
            <div style={{ paddingTop: 20 }}>
              <PlayerHeroBanner theme={theme} />
            </div>

            {/* Tab strip */}
            <div style={{
              display: "flex", gap: 2, marginTop: 18,
              borderBottom: `1px solid ${T.border}`,
            }}>
              {["Oversikt", "Runder", "Øvelser", "Plan"].map(t => {
                const active = t === tab;
                return (
                  <button key={t} onClick={() => setTab(t)} style={{
                    padding: "12px 18px", border: "none", background: "transparent",
                    color: active ? T.text : T.muted,
                    fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer",
                    borderBottom: active ? `2px solid ${T.accentInk}` : "2px solid transparent",
                    marginBottom: -1,
                    ...akFont, letterSpacing: "-.005em",
                  }}>{t}</button>
                );
              })}
            </div>

            {/* Top band: Today plan (large) + AI coach brief */}
            <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14, marginTop: 20 }}>
              <TodayPlanB theme={theme} />
              <CoachBriefB theme={theme} />
            </div>

            {/* Stat row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 14 }}>
              <StatB theme={theme} label="Handicap" value="15,9" delta="−0,4" deltaTone="success" sub="30d" icon="flag" />
              <StatB theme={theme} label="Scoring avg" value="78,6" delta="−1,2" deltaTone="success" sub="siste 10" icon="trending-down" />
              <StatB theme={theme} label="Putts / runde" value="32,1" delta="+0,3" deltaTone="danger" sub="siste 10" icon="circle-dot" />
              <StatB theme={theme} label="Fairways" value="64%" delta="+4%" deltaTone="success" sub="siste 10" icon="map-pin" />
            </div>

            {/* Main band: radar + heatmap + sessions */}
            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1.15fr 0.95fr", gap: 14, marginTop: 14 }}>
              <StrokesGainedB theme={theme} />
              <ConsistencyB theme={theme} />
              <SessionsB theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Nav pieces ─── */

function AkLeftNav({ theme }) {
  const T = akT(theme);
  const groups = [
    { label: "Spill", items: [
      { icon: "layout-dashboard", label: "Oversikt", active: true },
      { icon: "flag",             label: "Runder" },
      { icon: "bar-chart-3",      label: "Statistikk" },
      { icon: "target",           label: "Mål" },
    ]},
    { label: "Utvikling", items: [
      { icon: "clipboard-list",   label: "Treningsplan" },
      { icon: "dumbbell",         label: "Øvelser" },
      { icon: "users",            label: "Coach-team" },
    ]},
    { label: "Helse", items: [
      { icon: "heart-pulse",      label: "Helsestatus" },
      { icon: "moon-star",        label: "Søvn" },
    ]},
  ];
  return (
    <div style={{
      width: 232, background: theme === "light" ? T.card : "#081A13",
      borderRight: `1px solid ${T.border}`,
      padding: "20px 14px", flexShrink: 0,
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px 20px" }}>
        <img
          src={theme === "light"
            ? "assets/logos/ak-golf-logo-primary-on-light.svg"
            : "assets/logos/ak-golf-logo-primary-on-dark.svg"}
          alt="AK Golf Group"
          style={{ height: 22 }}
        />
      </div>

      {groups.map((g, gi) => (
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : 16 }}>
          <div style={{
            padding: "4px 10px", fontSize: 10, color: T.muted,
            fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
            ...akFont,
          }}>{g.label}</div>
          {g.items.map((it, i) => (
            <button key={i} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 10, border: "none",
              background: it.active ? (theme === "light" ? `${akC.primary}12` : `${akC.accent}14`) : "transparent",
              color: it.active ? T.accentInk : T.muted,
              fontSize: 13, fontWeight: it.active ? 600 : 500, cursor: "pointer",
              textAlign: "left", ...akFont, letterSpacing: "-.005em",
              transition: "background .15s ease",
            }}>
              <LucideIcon name={it.icon} size={15} color={it.active ? T.accentInk : T.muted} />
              {it.label}
              {it.active && <LucideIcon name="chevron-right" size={13} color={T.accentInk} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>
      ))}

      <div style={{ flex: 1 }} />
      <div style={{
        padding: 12, borderRadius: 12,
        background: theme === "light" ? `${akC.primary}0A` : `${akC.accent}0F`,
        border: `1px solid ${theme === "light" ? `${akC.primary}22` : `${akC.accent}22`}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <LucideIcon name="sparkles" size={13} color={T.accentInk} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.accentInk, ...akFont, letterSpacing: ".01em" }}>Coach AI</span>
        </div>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, ...akFont, textWrap: "pretty" }}>Spør om runden i går, eller få dagens fokuspunkt.</div>
      </div>
    </div>
  );
}

function AkTopBarB({ theme }) {
  const T = akT(theme);
  return (
    <div style={{
      padding: "14px 32px",
      borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: T.bg,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 14px", borderRadius: 10,
        background: theme === "light" ? T.card : akC.darkCard,
        border: `1px solid ${T.border}`,
        fontSize: 13, color: T.muted, width: 360,
        ...akFont,
      }}>
        <LucideIcon name="search" size={14} color={T.muted} />
        Søk etter runder, økter, øvelser
        <span style={{ marginLeft: "auto", fontSize: 10, color: T.muted, letterSpacing: ".04em", opacity: 0.7 }}>⌘K</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={{
          padding: "8px 12px", borderRadius: 10, border: `1px solid ${T.border}`,
          background: theme === "light" ? T.card : akC.darkCard,
          color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, ...akFont,
        }}>
          <LucideIcon name="calendar" size={13} color={T.muted} /> April 2026
        </button>
        <button style={{
          width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`,
          background: theme === "light" ? T.card : akC.darkCard,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <LucideIcon name="bell" size={14} color={T.muted} />
          <span style={{ position: "absolute", top: 8, right: 9, width: 6, height: 6, borderRadius: "50%", background: akC.accent }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 12, borderLeft: `1px solid ${T.border}` }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg,${akC.primary},${akC.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: akC.dark,
          }}>MK</div>
          <div style={akFont}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineHeight: 1.2 }}>Magnus Karlsson</div>
            <div style={{ fontSize: 10, color: T.muted }}>HCP 15,9 · Gamle Fredrikstad GK</div>
          </div>
          <LucideIcon name="chevron-down" size={13} color={T.muted} />
        </div>
      </div>
    </div>
  );
}

/* ─── Cards ─── */

function TodayPlanB({ theme }) {
  const T = akT(theme);
  const sessions = [
    { time: "08:00", done: true,  kind: "Mobility", dur: "20 min", color: akC.accent },
    { time: "10:00", done: false, kind: "Putting-lab m/ Andreas", dur: "60 min", color: akC.accent, main: true },
    { time: "14:30", done: false, kind: "Range – distansekontroll", dur: "45 min", color: T.muted },
    { time: "21:00", done: false, kind: "Restitusjon", dur: "15 min", color: T.muted },
  ];
  return (
    <AkCard theme={theme} glow style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accentInk }} />
          <span style={{ fontSize: 12, color: T.accentInk, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", ...akFont }}>I dag · torsdag 10. april</span>
        </div>
        <button style={{
          padding: "5px 12px", borderRadius: 20, border: `1px solid ${T.border}`,
          background: "transparent", color: T.muted,
          fontSize: 11, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 5, ...akFont,
        }}>
          Hele uken <LucideIcon name="arrow-right" size={11} color={T.muted} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: T.text, letterSpacing: "-.03em", lineHeight: 1, ...akFont }}>4 økter</div>
        <div style={{ fontSize: 13, color: T.muted, ...akFont }}>2t 20m total · 1 fullført</div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 60 }}>
        <div style={{
          position: "absolute", left: 70, top: 8, bottom: 8,
          width: 2, background: T.border,
        }} />
        {sessions.map((s, i) => {
          const dotBg = s.done ? akC.success : s.main ? T.accentInk : (theme === "light" ? T.card : akC.darkCard);
          const dotBorder = s.done ? akC.success : s.main ? T.accentInk : T.border;
          const textColor = s.done ? T.muted : T.text;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 18,
              padding: "10px 0", position: "relative",
            }}>
              <div style={{
                position: "absolute", left: -60, width: 48,
                fontSize: 11, color: T.muted, fontWeight: 600, ...akFont, letterSpacing: ".01em",
                textDecoration: s.done ? "line-through" : "none",
              }}>{s.time}</div>
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: dotBg, border: `2px solid ${dotBorder}`,
                flexShrink: 0, zIndex: 1,
                boxShadow: s.main ? `0 0 0 5px ${akC.accent}22` : "none",
              }}>
                {s.done && <LucideIcon name="check" size={8} color="#fff" style={{ marginTop: -1 }} />}
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: s.main ? 700 : 600, color: textColor, letterSpacing: "-.005em", ...akFont }}>{s.kind}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2, ...akFont }}>{s.dur}</div>
                </div>
                {s.main && (
                  <button style={{
                    padding: "7px 14px", borderRadius: 10, border: "none",
                    background: T.accentInk, color: theme === "light" ? "#fff" : akC.dark,
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6, ...akFont,
                  }}>Start <LucideIcon name="play" size={11} color={theme === "light" ? "#fff" : akC.dark} /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AkCard>
  );
}

function CoachBriefB({ theme }) {
  const T = akT(theme);
  const bullets = [
    { h: "Distansekontroll på 50-100m", b: "Spredning ±12m siste 3 runder. 15 min på range etter lunsj." },
    { h: "Putts innenfor 2m", b: "62% i går, du tar ofte på venstre leppe. Fokus: linje over tempo." },
    { h: "Søvn 7,5t+", b: "Restitusjon viktig før turneringen lørdag." },
  ];
  return (
    <AkCard theme={theme} style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LucideIcon name="sparkles" size={14} color={akC.ai} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: "-.005em", ...akFont }}>Coach AI brief</span>
        </div>
        <span style={{ fontSize: 10, color: T.muted, ...akFont }}>oppdatert 07:41</span>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.55, color: T.text, marginBottom: 14, textWrap: "pretty", ...akFont }}>
        Etter søndagens runde (78, +3) ser jeg tre ting som flytter HCP raskest denne uken:
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, paddingBottom: 12,
            borderBottom: i === bullets.length - 1 ? "none" : `1px solid ${T.border}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0,
              background: `${T.accentInk}1A`, color: T.accentInk,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, ...akFont,
            }}>{i + 1}</div>
            <div style={{ flex: 1, ...akFont }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 3, letterSpacing: "-.005em" }}>{b.h}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.55, textWrap: "pretty" }}>{b.b}</div>
            </div>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: 14, width: "100%",
        padding: "10px 14px", borderRadius: 10,
        border: `1px solid ${T.border}`, background: "transparent",
        color: T.text, fontSize: 12, fontWeight: 600, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...akFont,
      }}>
        <LucideIcon name="message-square" size={13} color={T.text} /> Diskuter med coach
      </button>
    </AkCard>
  );
}

function StatB({ theme, label, value, delta, deltaTone, sub, icon }) {
  const T = akT(theme);
  const tone = deltaTone === "success" ? akC.success : akC.danger;
  return (
    <AkCard theme={theme} style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: theme === "light" ? "#EEF2F1" : `${akC.darkMuted}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <LucideIcon name={icon} size={13} color={T.muted} />
        </div>
        <span style={{ fontSize: 12, color: T.muted, fontWeight: 600, ...akFont }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, ...akFont }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: T.text, letterSpacing: "-.025em", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: tone }}>
          {delta}
        </div>
      </div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 6, ...akFont, letterSpacing: ".02em" }}>{sub}</div>
    </AkCard>
  );
}

function StrokesGainedB({ theme }) {
  const T = akT(theme);
  const values = [0.85, 0.62, 0.48, 0.72, 0.55, 0.78];
  const labels = ["DRIVING", "APPROACH", "KORT", "PUTTING", "TEMPO", "MENTAL"];
  return (
    <AkCard theme={theme} style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: "-.005em", ...akFont }}>Strokes gained</div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2, ...akFont, letterSpacing: ".02em" }}>siste 10 runder · vs. HCP 15</div>
        </div>
        <AkMeta tone="success" theme={theme}>+2,4</AkMeta>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <AkRadar values={values} labels={labels} theme={theme} size={240} />
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
        marginTop: 4, paddingTop: 14, borderTop: `1px solid ${T.border}`,
      }}>
        <div><div style={{ fontSize: 10, color: T.muted, ...akFont }}>Sterkeste</div><div style={{ fontSize: 12, fontWeight: 700, color: akC.success, ...akFont }}>Driving</div></div>
        <div><div style={{ fontSize: 10, color: T.muted, ...akFont }}>Svakeste</div><div style={{ fontSize: 12, fontWeight: 700, color: akC.warning, ...akFont }}>Kort spill</div></div>
        <div><div style={{ fontSize: 10, color: T.muted, ...akFont }}>Mest i vekst</div><div style={{ fontSize: 12, fontWeight: 700, color: T.accentInk, ...akFont }}>Putting</div></div>
      </div>
    </AkCard>
  );
}

function ConsistencyB({ theme }) {
  const T = akT(theme);
  return (
    <AkCard theme={theme} style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: "-.005em", ...akFont }}>Treningsaktivitet</div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2, ...akFont, letterSpacing: ".02em" }}>siste 12 uker</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: T.muted, ...akFont }}>Mindre</span>
          <div style={{ display: "flex", gap: 2 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: 2,
                background: theme === "light"
                  ? ["#EDF1EF", "#CFE3D2", "#9BCFA6", "#5FA877", akC.primary][i]
                  : [`${akC.darkMuted}22`, `${T.accentInk}33`, `${T.accentInk}66`, `${T.accentInk}AA`, T.accentInk][i],
              }} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: T.muted, ...akFont }}>Mer</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: T.text, letterSpacing: "-.025em", ...akFont, lineHeight: 1 }}>78</div>
        <div style={{ fontSize: 12, color: T.muted, ...akFont }}>økter</div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: akC.success, fontWeight: 700, ...akFont, display: "flex", alignItems: "center", gap: 4 }}>
          <LucideIcon name="flame" size={12} color={akC.success} /> 12-dagers streak
        </div>
      </div>

      <AkHeatmap theme={theme} weeks={12} seed={9} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: T.muted, ...akFont }}>
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
        marginTop: 18, paddingTop: 14, borderTop: `1px solid ${T.border}`,
      }}>
        <div><div style={{ fontSize: 10, color: T.muted, ...akFont }}>Range</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, ...akFont }}>34</div></div>
        <div><div style={{ fontSize: 10, color: T.muted, ...akFont }}>Putting</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, ...akFont }}>22</div></div>
        <div><div style={{ fontSize: 10, color: T.muted, ...akFont }}>Runder</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, ...akFont }}>22</div></div>
      </div>
    </AkCard>
  );
}

function SessionsB({ theme }) {
  const T = akT(theme);
  const items = [
    { date: "Ons 09.04", kind: "Runde · Gamle Fredrikstad GK", stat: "78", good: true, meta: "+3 · 11 GIR · 32p" },
    { date: "Tir 08.04", kind: "Putting-lab",                  stat: "60m", good: true, meta: "1,61 avg · −0,11" },
    { date: "Man 07.04", kind: "Range · jern",                 stat: "45m", good: true, meta: "7j · 165m avg" },
    { date: "Søn 06.04", kind: "Runde · Onsøy GK",             stat: "81", good: false, meta: "+6 · 8 GIR · 35p" },
    { date: "Lør 05.04", kind: "Mobility",                     stat: "20m", good: true, meta: "hofte + skulder" },
  ];
  return (
    <AkCard theme={theme} style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: "-.005em", ...akFont }}>Historikk</div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2, ...akFont, letterSpacing: ".02em" }}>siste 5 økter + runder</div>
        </div>
        <button style={{
          padding: "4px 10px", borderRadius: 12, border: `1px solid ${T.border}`,
          background: "transparent", color: T.muted, fontSize: 10, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 4, ...akFont,
        }}>Alle <LucideIcon name="chevron-right" size={10} color={T.muted} /></button>
      </div>

      {items.map((it, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "11px 0",
          borderBottom: i === items.length - 1 ? "none" : `1px solid ${T.border}`,
          ...akFont,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: it.good ? `${akC.success}1A` : `${akC.warning}1A`,
            color: it.good ? akC.success : akC.warning,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, letterSpacing: "-.01em",
          }}>{it.stat}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, letterSpacing: "-.005em", ...akFont, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.kind}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 2, ...akFont }}>{it.date} · {it.meta}</div>
          </div>
          <LucideIcon name="chevron-right" size={13} color={T.muted} />
        </div>
      ))}
    </AkCard>
  );
}

Object.assign(window, { DashboardB });
