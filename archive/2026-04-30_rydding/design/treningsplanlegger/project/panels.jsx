/* KPI-rad, Coach-meldinger, Mål-progresjon, Logg */

function KpiRow({ theme }) {
  const T = useTheme(theme);
  const kpis = [
    { label: "Denne uken", value: "9/13", sub: "økter fullført", color: AK.accent, pct: 69 },
    { label: "Treningstid", value: "5t 45m", sub: "av 8t mål", color: AK.tek, pct: 72 },
    { label: "Streak", value: "12", sub: "dager på rad", color: AK.slag, icon: "zap" },
    { label: "Neste økt", value: "15:00", sub: "Svinganalyse · 40m", color: AK.fys },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
      {kpis.map((k, i) => (
        <div key={i} style={{
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px",
          ...akFont, position: "relative", overflow: "hidden",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: 0.5, textTransform: "uppercase" }}>{k.label}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: k.color }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
              {k.value}
            </div>
            {k.icon && <Icon name={k.icon} size={14} color={k.color} />}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{k.sub}</div>
          {k.pct != null && (
            <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: theme === "dark" ? "#ffffff10" : "#0000000a", overflow: "hidden" }}>
              <div style={{ width: k.pct + "%", height: "100%", background: k.color, borderRadius: 2 }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CoachPanel({ theme }) {
  const T = useTheme(theme);
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16,
      ...akFont,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="message" size={14} color={T.muted} />
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Coach-meldinger</span>
          <span style={{
            background: AK.accent, color: AK.bg, fontSize: 9, fontWeight: 800,
            padding: "1px 6px", borderRadius: 6,
          }}>2</span>
        </div>
        <span style={{ fontSize: 11, color: T.muted, cursor: "pointer" }}>Alle →</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COACH_MELDINGER.map((m, i) => (
          <div key={i} style={{
            display: "flex", gap: 10,
            padding: 10, borderRadius: 10,
            background: m.unread ? (theme === "dark" ? AK.bg + "60" : AK.lightSubtle) : "transparent",
            border: `1px solid ${m.unread ? T.border : "transparent"}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: m.ai ? `linear-gradient(135deg, ${AK.accent}, ${AK.primary})`
                : `linear-gradient(135deg, ${AK.primary}, ${AK.tek})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: AK.bg,
            }}>{m.ai ? "AI" : m.from.split(" ").map(s => s[0]).join("")}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{m.from}</span>
                <span style={{ fontSize: 10, color: T.muted }}>· {m.role}</span>
              </div>
              <div style={{ fontSize: 12, color: T.text, opacity: 0.85, lineHeight: 1.5 }}>{m.text}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaalPanel({ theme }) {
  const T = useTheme(theme);
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16,
      ...akFont,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="target" size={14} color={T.muted} />
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Progresjon mot mål</span>
        </div>
        <span style={{ fontSize: 11, color: T.muted }}>Sesong 2026</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {MAAL.map((g, i) => {
          const range = g.start - g.target;
          const progress = (g.start - g.current) / range;
          const pct = Math.max(0, Math.min(100, progress * 100));
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{g.name}</span>
                <span style={{ fontSize: 11, color: T.muted, fontVariantNumeric: "tabular-nums" }}>
                  <b style={{ color: T.text, fontSize: 13 }}>{g.current}{g.unit}</b> / {g.target}{g.unit}
                </span>
              </div>
              <div style={{ position: "relative", height: 6, background: theme === "dark" ? "#ffffff08" : "#00000008", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: pct + "%", background: `linear-gradient(90deg, ${AK.tek}, ${AK.accent})`,
                  borderRadius: 3,
                }} />
              </div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>
                Start: {g.start}{g.unit} · {Math.round(pct)}% framdrift
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoggPanel({ theme, useColors }) {
  const T = useTheme(theme);
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16,
      ...akFont,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="bookopen" size={14} color={T.muted} />
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Nylig logg</span>
        </div>
        <span style={{ fontSize: 11, color: T.muted, cursor: "pointer" }}>Hele dagboken →</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LOGG.map((l, i) => {
          const c = useColors ? PYR[l.level].color : T.muted;
          return (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 0",
              borderBottom: i < LOGG.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: c + "22", color: c,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><Icon name="check" size={14} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{l.title}</span>
                  <span style={{ fontSize: 10, color: T.muted }}>{l.date}</span>
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>
                  {l.duration} min · {PYR[l.level].label}
                </div>
                <div style={{ fontSize: 11, color: T.text, opacity: 0.75, lineHeight: 1.5, fontStyle: "italic" }}>
                  «{l.note}»
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Empty / onboarding state */
function EmptyState({ theme, onAuto }) {
  const T = useTheme(theme);
  return (
    <div style={{
      background: T.card, border: `1.5px dashed ${T.border}`, borderRadius: 16, padding: 60,
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      ...akFont,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: AK.accent + "20", color: AK.accent,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
      }}><Icon name="sparkles" size={32} /></div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 8 }}>Klar for å starte uken?</div>
      <div style={{ fontSize: 14, color: T.muted, maxWidth: 380, lineHeight: 1.6, marginBottom: 24 }}>
        Du har ingen planlagte økter ennå. Generer en plan basert på dine mål og treningspyramide,
        eller velg en standard økt for å komme i gang.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onAuto} style={{
          padding: "10px 18px", borderRadius: 10, border: "none",
          background: AK.primary, color: AK.white, fontSize: 13, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8, ...akFont,
        }}>
          <Icon name="sparkles" size={14} /> Auto-generer ukeplan
        </button>
        <button style={{
          padding: "10px 18px", borderRadius: 10,
          background: "transparent", border: `1px solid ${T.border}`,
          color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, ...akFont,
        }}>
          <Icon name="bookopen" size={14} /> Bla gjennom standard økter
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { KpiRow, CoachPanel, MaalPanel, LoggPanel, EmptyState });
