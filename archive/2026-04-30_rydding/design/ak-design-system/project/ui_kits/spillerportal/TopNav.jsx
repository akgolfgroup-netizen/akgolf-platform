/* Top navigation bar — Lucide icons, no emoji */

function TopNav({ theme, setTheme, activeTab = "Hjem" }) {
  const T = useT(theme);
  const tabs = [
    { icon: "home", label: "Hjem" },
    { icon: "activity", label: "Aktiviteter" },
    { icon: "heart-pulse", label: "Helsestatus" },
    { icon: "clipboard-list", label: "Treningsplan" },
  ];
  const innerPillBg = theme === "light" ? C.lightBg : T.card;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 28px", borderBottom: `1px solid ${T.border}`, background: T.bg,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img src={theme === "light"
          ? "../../assets/logos/ak-golf-logo-primary-on-light.svg"
          : "../../assets/logos/ak-golf-logo-primary-on-dark.svg"}
          alt="AK Golf Group" style={{ height: 26 }} />
        <div style={{ display: "flex", gap: 4, background: innerPillBg, borderRadius: 24, padding: 3 }}>
          {tabs.map(t => (
            <div key={t.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 20,
              background: t.label === activeTab ? C.primary : "transparent",
              color: t.label === activeTab ? C.white : (theme === "light" ? C.lightMuted : C.muted),
              fontSize: 12, fontWeight: 500, cursor: "pointer", ...font,
            }}>
              <LucideIcon name={t.icon} size={14} />{t.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", background: innerPillBg, borderRadius: 20, padding: 3 }}>
          <div onClick={() => setTheme("light")} style={{
            width: 28, height: 28, borderRadius: "50%",
            background: theme === "light" ? C.primary : "transparent",
            color: theme === "light" ? C.white : C.muted,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}><LucideIcon name="sun" size={14} /></div>
          <div onClick={() => setTheme("dark")} style={{
            width: 28, height: 28, borderRadius: "50%",
            background: theme === "dark" ? C.primary : "transparent",
            color: theme === "dark" ? C.white : C.muted,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}><LucideIcon name="moon" size={14} /></div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: innerPillBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme === "light" ? C.lightMuted : C.muted }}>
          <LucideIcon name="bell" size={14} />
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.bg }}>MK</div>
        <span style={{ fontSize: 12, color: T.muted || C.muted }}>▾</span>
      </div>
    </div>
  );
}

function Sidebar({ theme }) {
  const items = ["flag-triangle-right", "chart-column", "target", "activity", "moon", "settings"];
  return (
    <div style={{ width: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 40, flexShrink: 0 }}>
      {items.map((ic, i) => (
        <div key={i} style={{
          width: 32, height: 32, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: i === 0 ? C.primary : "transparent",
          color: i === 0 ? C.accent : (theme === "light" ? C.lightMuted : C.muted),
          cursor: "pointer",
        }}><LucideIcon name={ic} size={16} /></div>
      ))}
    </div>
  );
}

function UtilityRow({ theme }) {
  const T = useT(theme);
  const pillBg = theme === "light" ? C.white : T.card;
  const border = `1px solid ${theme === "light" ? C.lightBorder : T.border}`;
  const muted = theme === "light" ? C.lightMuted : C.muted;
  const items = [{i: "search", l: "Søk"}, {i: "calendar", l: "Kalender"}, {i: "bot", l: "ChatBot AI"}];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map(t => (
        <div key={t.l} style={{
          padding: "7px 16px", borderRadius: 20, background: pillBg, border,
          fontSize: 12, color: muted, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", ...font,
        }}><LucideIcon name={t.i} size={14} />{t.l}</div>
      ))}
    </div>
  );
}

Object.assign(window, { TopNav, Sidebar, UtilityRow });
