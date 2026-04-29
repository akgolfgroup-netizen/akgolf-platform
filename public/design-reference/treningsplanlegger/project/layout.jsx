/* Layout chrome — topbar, sidebar, breadcrumb */

function TopBar({ theme, setTheme, density, setDensity, sidePanelOpen, setSidePanelOpen }) {
  const T = useTheme(theme);
  const muted = T.muted;
  const innerPillBg = theme === "light" ? AK.lightSubtle : AK.cardHover + "55";
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img
          src={theme === "light" ? "assets/logos/ak-golf-logo-primary-on-light.svg" : "assets/logos/ak-golf-logo-primary-on-dark.svg"}
          alt="AK Golf Group" style={{ height: 22 }}
        />
        <div style={{ display: "flex", gap: 2, background: innerPillBg, borderRadius: 22, padding: 3 }}>
          {[
            { icon: "home", label: "Hjem", active: false },
            { icon: "trending", label: "Aktiviteter", active: false },
            { icon: "target", label: "Helse", active: false },
            { icon: "calendar", label: "Treningsplan", active: true },
          ].map(t => (
            <div key={t.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 20,
              background: t.active ? AK.primary : "transparent",
              color: t.active ? AK.white : muted,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              ...akFont,
            }}>
              <Icon name={t.icon} size={13} />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          padding: "6px 12px", borderRadius: 20,
          background: innerPillBg, color: muted,
          fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", ...akFont,
        }}>
          <Icon name="search" size={13} /> Søk i øvelser
        </div>
        <button onClick={() => setSidePanelOpen(!sidePanelOpen)} title="Vis sidemeny" style={{
          background: "transparent", border: `1px solid ${T.border}`,
          width: 30, height: 30, borderRadius: 8, color: muted,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Icon name="panel" size={14} />
        </button>
        <div style={{ display: "flex", background: innerPillBg, borderRadius: 20, padding: 3 }}>
          <div onClick={() => setTheme("light")} style={{
            width: 26, height: 26, borderRadius: "50%",
            background: theme === "light" ? AK.primary : "transparent",
            color: theme === "light" ? AK.white : muted,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer",
          }}>☀</div>
          <div onClick={() => setTheme("dark")} style={{
            width: 26, height: 26, borderRadius: "50%",
            background: theme === "dark" ? AK.primary : "transparent",
            color: theme === "dark" ? AK.white : muted,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer",
          }}>🌙</div>
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: innerPillBg, color: muted,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}><Icon name="bell" size={14} /></div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${AK.primary}, ${AK.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: AK.bg,
        }}>MK</div>
      </div>
    </div>
  );
}

function LeftRail({ theme }) {
  const T = useTheme(theme);
  const items = [
    { icon: "home", label: "Oversikt" },
    { icon: "calendar", label: "Treningsplan", active: true },
    { icon: "trending", label: "Statistikk" },
    { icon: "bookopen", label: "Dagbok" },
    { icon: "target", label: "Mål" },
    { icon: "trophy", label: "Turneringer" },
    { icon: "message", label: "Coach" },
  ];
  const bottom = [
    { icon: "settings", label: "Innstillinger" },
  ];
  return (
    <div style={{
      width: 56, flexShrink: 0,
      background: T.bg,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      padding: "16px 0",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        {items.map((it, i) => (
          <div key={i} title={it.label} style={{
            width: 38, height: 38, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: it.active ? AK.primary : "transparent",
            color: it.active ? AK.accent : T.muted,
            cursor: "pointer", position: "relative",
          }}>
            <Icon name={it.icon} size={17} />
            {it.active && (
              <span style={{
                position: "absolute", left: -1, top: 9, bottom: 9, width: 2,
                background: AK.accent, borderRadius: 2,
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        {bottom.map((it, i) => (
          <div key={i} title={it.label} style={{
            width: 38, height: 38, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.muted, cursor: "pointer",
          }}>
            <Icon name={it.icon} size={17} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PageHeader({ theme, view, setView, periode, setPeriode, weekLabel, onPrev, onNext, onToday, onAuto, onNew }) {
  const T = useTheme(theme);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 24px 16px", flexShrink: 0,
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.01em",
            color: T.text, ...akFont,
          }}>Treningsplan</h1>
          <span style={{
            ...akFont, fontSize: 11, fontWeight: 700, color: AK.accent,
            background: AK.primary, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.4,
          }}>UKE 17</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: T.muted, fontSize: 13, ...akFont }}>
          <span>13. — 19. april 2026</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: T.muted }} />
          <span>9 av 13 økter fullført</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: T.muted }} />
          <span style={{ color: AK.accent, fontWeight: 600 }}>⚡ 12-dagers streak</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 2, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3 }}>
          {[
            { id: "uke",      label: "Uke",         icon: "calendar" },
            { id: "dag",      label: "Dag",         icon: "list" },
            { id: "pyramide", label: "Pyramide",    icon: "layers" },
          ].map(v => (
            <div key={v.id} onClick={() => setView(v.id)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: view === v.id ? AK.primary : "transparent",
              color: view === v.id ? AK.white : T.muted,
              display: "flex", alignItems: "center", gap: 6, cursor: "pointer", ...akFont,
            }}>
              <Icon name={v.icon} size={13} /> {v.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 2, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3 }}>
          <div onClick={onPrev} style={{
            width: 28, height: 28, borderRadius: 6, display: "flex",
            alignItems: "center", justifyContent: "center", color: T.muted, cursor: "pointer",
          }}><Icon name="chevL" size={14} /></div>
          <div onClick={onToday} style={{
            padding: "0 12px", height: 28, borderRadius: 6, display: "flex",
            alignItems: "center", justifyContent: "center", color: T.text, cursor: "pointer",
            fontSize: 12, fontWeight: 600, ...akFont,
          }}>I dag</div>
          <div onClick={onNext} style={{
            width: 28, height: 28, borderRadius: 6, display: "flex",
            alignItems: "center", justifyContent: "center", color: T.muted, cursor: "pointer",
          }}><Icon name="chevR" size={14} /></div>
        </div>

        <button onClick={onAuto} style={{
          padding: "8px 14px", borderRadius: 10,
          border: `1px solid ${AK.accent}55`,
          background: theme === "dark" ? AK.accent + "18" : AK.accent + "30",
          color: theme === "dark" ? AK.accent : AK.primary,
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, ...akFont,
        }}>
          <Icon name="sparkles" size={13} /> Auto-generer uke
        </button>

        <button onClick={onNew} style={{
          padding: "8px 14px", borderRadius: 10, border: "none",
          background: AK.primary, color: AK.white,
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, ...akFont,
        }}>
          <Icon name="plus" size={14} /> Ny økt
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { TopBar, LeftRail, PageHeader });
