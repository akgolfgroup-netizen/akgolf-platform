/* Top navigation bar — "ak" logo · pill tabs · theme toggle · avatar */

function TopNav({ theme, setTheme, activeTab = "Hjem" }) {
  const T = useT(theme);
  const tabs = [
    { icon: "⊞", label: "Hjem" },
    { icon: "⛳", label: "Aktiviteter" },
    { icon: "♥", label: "Helsestatus" },
    { icon: "📋", label: "Treningsplan" },
  ];
  const innerPillBg = theme === "light" ? C.lightBg : T.card;
  const fg = theme === "light" ? C.lightText : C.white;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 28px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Logo — serif "ak" with lime dot (matches brand logotype visually at nav scale) */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <img
            src={theme === "light"
              ? "../../assets/logos/ak-golf-logo-primary-on-light.svg"
              : "../../assets/logos/ak-golf-logo-primary-on-dark.svg"}
            alt="AK Golf Group"
            style={{ height: 26 }}
          />
        </div>
        {/* Tab pills */}
        <div style={{ display: "flex", gap: 4, background: innerPillBg, borderRadius: 24, padding: 3 }}>
          {tabs.map(t => (
            <div key={t.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 20,
              background: t.label === activeTab ? C.primary : "transparent",
              color: t.label === activeTab ? C.white : (theme === "light" ? C.lightMuted : C.muted),
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              ...font,
            }}>
              <span style={{ fontSize: 11 }}>{t.icon}</span>{t.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Theme toggle */}
        <div style={{ display: "flex", background: innerPillBg, borderRadius: 20, padding: 3 }}>
          <div onClick={() => setTheme("light")} style={{
            width: 28, height: 28, borderRadius: "50%",
            background: theme === "light" ? C.primary : "transparent",
            color: theme === "light" ? C.white : C.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, cursor: "pointer",
          }}>☀</div>
          <div onClick={() => setTheme("dark")} style={{
            width: 28, height: 28, borderRadius: "50%",
            background: theme === "dark" ? C.primary : "transparent",
            color: theme === "dark" ? C.white : C.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, cursor: "pointer",
          }}>🌙</div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: innerPillBg,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
        }}>🔔</div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `linear-gradient(135deg,${C.primary},${C.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: C.bg,
        }}>MK</div>
        <span style={{ fontSize: 12, color: T.muted || C.muted }}>▾</span>
      </div>
    </div>
  );
}

function Sidebar({ theme }) {
  const T = useT(theme);
  const items = ["🏌", "📊", "🎯", "⛳", "🌙", "⚙"];
  return (
    <div style={{
      width: 48, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 20, paddingTop: 40, flexShrink: 0,
    }}>
      {items.map((ic, i) => (
        <div key={i} style={{
          width: 32, height: 32, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15,
          background: i === 0 ? C.primary : "transparent",
          color: i === 0 ? C.accent : (theme === "light" ? C.lightMuted : C.muted),
          cursor: "pointer",
        }}>
          {ic}
        </div>
      ))}
    </div>
  );
}

function UtilityRow({ theme }) {
  const T = useT(theme);
  const pillBg = theme === "light" ? C.white : T.card;
  const border = theme === "light" ? `1px solid ${C.lightBorder}` : `1px solid ${T.border}`;
  const muted = theme === "light" ? C.lightMuted : C.muted;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["🔍 Søk", "📅 Kalender", "🤖 ChatBot AI"].map(t => (
        <div key={t} style={{
          padding: "7px 16px", borderRadius: 20,
          background: pillBg, border,
          fontSize: 12, color: muted, display: "flex", alignItems: "center", gap: 6, ...font,
          cursor: "pointer",
        }}>{t}</div>
      ))}
    </div>
  );
}

Object.assign(window, { TopNav, Sidebar, UtilityRow });
