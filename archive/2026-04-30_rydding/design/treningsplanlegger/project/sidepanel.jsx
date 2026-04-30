/* Sidemeny — pyramide-filter, øvelsesbank, standard økter, AI-forslag */

function FilterPyramid({ theme, useColors, activeFilter, setActiveFilter }) {
  const T = useTheme(theme);
  return (
    <div>
      <SectionHeader theme={theme} icon="layers" title="Treningspyramide" hint="Klikk for å filtrere" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Object.entries(PYR).reverse().map(([key, p]) => {
          const active = activeFilter === key;
          const c = useColors ? p.color : T.muted;
          const count = OVELSER.filter(o => o.level === key).length;
          return (
            <div key={key} onClick={() => setActiveFilter(active ? null : key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 8,
              background: active ? c + "18" : "transparent",
              border: `1px solid ${active ? c + "44" : "transparent"}`,
              cursor: "pointer", ...akFont, transition: "all 150ms ease",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: T.text }}>{p.label}</div>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader({ theme, icon, title, hint, action }) {
  const T = useTheme(theme);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 10, marginTop: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name={icon} size={13} color={T.muted} />
        <span style={{ fontSize: 11, fontWeight: 700, color: T.text, letterSpacing: 0.5, ...akFont, textTransform: "uppercase" }}>{title}</span>
      </div>
      {action ? action : (hint && <span style={{ fontSize: 10, color: T.muted, ...akFont }}>{hint}</span>)}
    </div>
  );
}

function StandardOkterPanel({ theme, useColors }) {
  const T = useTheme(theme);
  return (
    <div>
      <SectionHeader theme={theme} icon="bookopen" title="Standard økter" hint="Dra til kalenderen" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {STANDARD_OKTER.map(s => {
          const p = PYR[s.level];
          const c = useColors ? p.color : T.muted;
          return (
            <div key={s.id} draggable style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 8,
              background: theme === "dark" ? AK.bg + "60" : AK.lightSubtle,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${c}`,
              cursor: "grab", ...akFont, transition: "all 150ms ease",
            }}>
              <Icon name="grip" size={12} color={T.muted} style={{ opacity: 0.5 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 10, color: T.muted, display: "flex", gap: 8 }}>
                  <span>{s.duration} min</span>
                  <span>·</span>
                  <span>{s.exercises.length} øvelser</span>
                </div>
              </div>
              <PyrBadge level={s.level} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseBank({ theme, useColors, activeFilter }) {
  const T = useTheme(theme);
  const filtered = activeFilter ? OVELSER.filter(o => o.level === activeFilter) : OVELSER;
  return (
    <div>
      <SectionHeader theme={theme} icon="dumbbell" title={activeFilter ? `Øvelser — ${PYR[activeFilter].label}` : "Øvelsesbank"}
        action={activeFilter ? null : <span style={{ fontSize: 10, color: T.muted, ...akFont }}>{filtered.length} øvelser</span>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto" }}>
        {filtered.map(e => {
          const p = PYR[e.level];
          const c = useColors ? p.color : T.muted;
          return (
            <div key={e.id} draggable style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 8,
              background: "transparent",
              border: `1px solid transparent`,
              cursor: "grab", ...akFont, transition: "all 150ms ease",
            }}
              onMouseEnter={e2 => { e2.currentTarget.style.background = T.cardSubtle; e2.currentTarget.style.borderColor = T.border; }}
              onMouseLeave={e2 => { e2.currentTarget.style.background = "transparent"; e2.currentTarget.style.borderColor = "transparent"; }}
            >
              <Icon name="grip" size={11} color={T.muted} style={{ opacity: 0.4 }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
              <div style={{ flex: 1, fontSize: 12, color: T.text, fontWeight: 500 }}>{e.name}</div>
              {e.fav && <span style={{ color: AK.accent, fontSize: 11 }}>★</span>}
              <span style={{ fontSize: 10, color: T.muted, fontVariantNumeric: "tabular-nums" }}>{e.duration}m</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AIForslag({ theme }) {
  const T = useTheme(theme);
  return (
    <div style={{
      background: theme === "dark" ? AK.accent + "0E" : AK.accent + "20",
      border: `1px solid ${AK.accent}40`,
      borderRadius: 12, padding: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon name="sparkles" size={13} color={theme === "dark" ? AK.accent : AK.primary} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, ...akFont,
          color: theme === "dark" ? AK.accent : AK.primary, textTransform: "uppercase" }}>AI-forslag</span>
      </div>
      <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5, ...akFont, marginBottom: 10 }}>
        SPILL-volumet er <b>5% under mål</b> denne uken. Foreslår å legge inn en runde lørdag.
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button style={{
          flex: 1, padding: "7px 10px", borderRadius: 8, border: "none",
          background: AK.primary, color: AK.white, fontSize: 11, fontWeight: 700,
          cursor: "pointer", ...akFont,
        }}>Legg til</button>
        <button style={{
          padding: "7px 10px", borderRadius: 8,
          background: "transparent", border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", ...akFont,
        }}>Avvis</button>
      </div>
    </div>
  );
}

function SidePanel({ theme, useColors, open, onClose }) {
  const T = useTheme(theme);
  const [activeFilter, setActiveFilter] = React.useState(null);
  const [tab, setTab] = React.useState("standard");

  if (!open) return null;

  return (
    <div style={{
      width: 320, flexShrink: 0,
      background: T.bg, borderLeft: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 18px", borderBottom: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 0.5, ...akFont }}>BIBLIOTEK</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.text, ...akFont, marginTop: 2 }}>Bygg din uke</div>
        </div>
        <button onClick={onClose} style={{
          background: "transparent", border: "none", color: T.muted, cursor: "pointer", padding: 4,
        }}><Icon name="x" size={16} /></button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 22 }}>
        <AIForslag theme={theme} />
        <FilterPyramid theme={theme} useColors={useColors} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <StandardOkterPanel theme={theme} useColors={useColors} />
        <ExerciseBank theme={theme} useColors={useColors} activeFilter={activeFilter} />
      </div>
    </div>
  );
}

Object.assign(window, { SidePanel, AIForslag, FilterPyramid, ExerciseBank, StandardOkterPanel, SectionHeader });
